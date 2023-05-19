import dayjs from "dayjs";
import _ from "lodash";
import express from "express";
import { getAvatar } from "./services/avatar.service.js";
import {
    getAllDraftsForLeague,
    getDraftPicks,
} from "./services/draft.service.js";
import {
    getAllLeagueSeasons,
    getAllLeaguesForUser,
    getLastCompletedSeason,
    getLeague,
    getLeagueTransactions,
} from "./services/league.service.js";

import { getUser } from "./services/user.service.js";
import { getAllPlayers } from "./services/player.service.js";
import { getRostersFromLastCompletedSeason } from "./services/roster.service.js";

const app = express();

const HistoryEntry = ({
    rosterId,
    season,
    week,
    type,
    round,
    pick,
    overall,
    keeper,
}) => {
    const draftMetadata =
        round || pick || overall || keeper
            ? {
                  round,
                  pick,
                  overall,
                  keeper,
              }
            : null;

    return {
        rosterId,
        season,
        week,
        type,
        draftMetadata,
    };
};

const func = async () => {
    //dayjs years since
    const allLeagueSeasons = await getAllLeagueSeasons();

    const allDrafts = await Promise.all(
        allLeagueSeasons.map(async ({ league_id }) => {
            const drafts = await getAllDraftsForLeague(league_id);
            return drafts;
        })
    );

    const finalAllDrafts = _.flatten(allDrafts);

    const draftPicksBySeason = {};

    const x = await Promise.all(
        finalAllDrafts.map(async ({ season, draft_id }) => {
            const draftPicks = await getDraftPicks(draft_id);
            draftPicksBySeason[season] = draftPicks;
        })
    );

    const transactions = await Promise.all(
        allLeagueSeasons.map(async ({ league_id, season }) => {
            const t = [];

            const p = await Promise.all(
                _.times(20).map((i) => getLeagueTransactions(league_id, i))
            );

            t.push(..._.flatten(p));

            return _.flattenDeep(t.map((y) => ({ ...y, season })));
        })
    );

    const allTransacation = _.flatten(transactions)
        .filter(({ status }) => status === "complete")
        .reduce((acc, { leg, adds, drops, type, season }) => {
            Object.entries(adds || {}).forEach(([playerId, rosterId]) => {
                if (!acc[playerId]) {
                    acc[playerId] = [];
                }

                if (type === "commissioner") {
                    return;
                }

                const isWaiverMove = ["waiver", "free_agent"].includes(type);

                acc[playerId].push(
                    HistoryEntry({
                        rosterId,
                        season,
                        week: leg,
                        type: isWaiverMove
                            ? "WAIVER_ADD"
                            : type === "trade"
                            ? "TRADED_IN"
                            : "DRAFT_PICK",
                    })
                );
            });

            Object.entries(drops || {}).forEach(([playerId, rosterId]) => {
                const isWaiverMove = ["waiver", "free_agent"].includes(type);

                if (type === "commissioner") {
                    return;
                }

                if (!acc[playerId]) {
                    acc[playerId] = [];
                }
                acc[playerId].push(
                    HistoryEntry({
                        rosterId,
                        season,
                        week: leg,
                        type: isWaiverMove
                            ? "WAIVER_DROP"
                            : type === "trade"
                            ? "TRADED_OUT"
                            : "DRAFT_PICK",
                    })
                );
            });

            return acc;
        }, {});

    const transactionMap = {};

    const a = Object.entries(draftPicksBySeason).reduce(
        (acc, [season, draftPicks]) => {
            draftPicks.forEach(
                ({
                    player_id,
                    roster_id,
                    pick_no,
                    is_keeper,
                    round,
                    metadata,
                    draft_slot,
                }) => {
                    if (!acc[player_id]) {
                        acc[player_id] = {
                            name: `${metadata.first_name} ${metadata.last_name}`,
                            transactions: [],
                        };
                    }

                    acc[player_id].transactions.push(
                        HistoryEntry({
                            rosterId: roster_id,
                            type: "DRAFT_PICK",
                            season,
                            week: 0,
                            round,
                            pick: draft_slot,
                            overall: pick_no,
                            keeper: !!is_keeper,
                        })
                    );
                }
            );

            return acc;
        },
        {}
    );

    const b = Object.entries(allTransacation).reduce(
        (acc, [playerId, transactions]) => {
            const playerTransactions = allTransacation[playerId];

            if (!acc[playerId]) {
                acc[playerId] = {
                    name: playerTransactions[0].player_name,
                    transactions: [],
                };
            }

            playerTransactions?.forEach((pt) => {
                acc[playerId].transactions.push(pt);
            });

            return acc;
        },
        a
    );

    return b;
};

const getKeeperValue = (playerId, allPlayerHistory) => {
    if (!allPlayerHistory[playerId] || !allPlayerHistory[playerId].name) {
        console.log(`No Transactions for ${playerId}`);
        return;
    }

    const { transactions } = allPlayerHistory[playerId];
    const sortedTransactions = _.orderBy(
        transactions,
        ["season", "week"],
        ["desc", "desc"]
    );

    const lastNonTradeTransaction = sortedTransactions.find(
        ({ type }) => !["TRADED_IN", "TRADED_OUT"].includes(type)
    );

    if (sortedTransactions.at(0).type === "WAIVER_ADD") {
        return {
            name: allPlayerHistory[playerId].name,
            value: "ADP + 1",
            playerId,
        };
    }

    const seasonsWithOwner =
        sortedTransactions.length === 1
            ? 1
            : sortedTransactions.every(
                  ({ rosterId }) =>
                      rosterId === sortedTransactions.at(0).rosterId
              )
            ? sortedTransactions.length
            : sortedTransactions.findIndex(
                  ({ rosterId }) => rosterId !== sortedTransactions[0].rosterId
              );

    const firstOtherUserTransaction = sortedTransactions.find(
        ({ rosterId }) => {
            return rosterId !== sortedTransactions[0].rosterId;
        }
    );

    const getFibinnaci = (n) => {
        if (n <= 1) return 1;
        return getFibinnaci(n - 1) + getFibinnaci(n - 2);
    };

    const keeperValue = _.sum(
        _.times(seasonsWithOwner).map((i) => getFibinnaci(i + 2))
    );

    console.log(allPlayerHistory[playerId].name);
    console.log(lastNonTradeTransaction);

    if (
        lastNonTradeTransaction?.type === "DRAFT_PICK" &&
        lastNonTradeTransaction?.draftMetadata.round <= 2
    ) {
        return { name: allPlayerHistory[playerId].name, value: 0, playerId };
    }

    if (
        ["WAIVER_ADD", "WAIVER_DROP"].includes(
            sortedTransactions.at(seasonsWithOwner - 1).type
        )
    ) {
        console.log(allPlayerHistory[playerId].name);
        console.log(sortedTransactions.at(0));

        const value =
            sortedTransactions.at(0).draftMetadata.round -
            getFibinnaci(seasonsWithOwner + 1);

        return {
            name: allPlayerHistory[playerId].name,
            value: value < 0 ? 0 : value,
            playerId,
        };
    }

    if (
        ["TRADED_IN"].includes(sortedTransactions.at(seasonsWithOwner - 1).type)
    ) {
        if (lastNonTradeTransaction.type === "WAIVER_ADD") {
            return {
                name: allPlayerHistory[playerId].name,
                value: `ADP - ${keeperValue}`,
                playerId,
            };
        }

        return {
            name: allPlayerHistory[playerId].name,
            value: lastNonTradeTransaction?.draftMetadata.round - keeperValue,
            playerId,
        };
    }

    const intialDraftValue = sortedTransactions.at(seasonsWithOwner - 1)
        .draftMetadata.round;

    if (intialDraftValue - keeperValue < 1) {
        return { name: allPlayerHistory[playerId].name, value: 0, playerId };
    }

    return {
        name: allPlayerHistory[playerId].name,
        value: intialDraftValue - keeperValue,
        playerId,
    };

    return `Keeper value for ${allPlayerHistory[playerId].name} is ${
        intialDraftValue - keeperValue
    }.`;
};

app.get("/", async (req, res) => {
    const allPlayerHistory = await func();
    const rosters = await getRostersFromLastCompletedSeason();

    const n = Object.entries(rosters).reduce((acc, [teamId, roster]) => {
        if (!acc[teamId]) {
            acc[teamId] = [];
        }

        acc[teamId] = _.uniqBy(
            roster
                .map((playerId) => getKeeperValue(playerId, allPlayerHistory))
                .filter(Boolean),
            "playerId"
        );

        return acc;
    }, {});

    res.send(n);
});

app.listen(1738, () => {
    console.log("Server is running on port 1738");
});
