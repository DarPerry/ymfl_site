import dayjs from "dayjs";
import _ from "lodash";
import axios from "axios";
import express from "express";
import * as cheerio from "cheerio";
import { getAvatar } from "./services/avatar.service.js";
import {
    getAllDraftsForLeague,
    getDraftPicks,
    getPlayerADPs,
} from "./services/draft.service.js";
import {
    getAllLeagueSeasons,
    getAllLeaguesForUser,
    getLastCompletedSeason,
    getLeague,
    getLeagueManagers,
    getLeagueTransactions,
} from "./services/league.service.js";

import playerImages from "./data/players.json" assert { type: "json" };

import { getUser } from "./services/user.service.js";
import {
    getActivePlayers,
    getAllPlayers,
    normalizePlayerName,
} from "./services/player.service.js";
import { getRostersFromLastCompletedSeason } from "./services/roster.service.js";
import { FANTASY_POSITIONS } from "./config/index.config.js";
import { resolveSoa } from "dns";

const app = express();

const HistoryEntry = ({
    playerName,
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

const getValidPlayers = async () => {
    const allPlayers = await getAllPlayers();
    const playerIdMap = {};

    const players = Object.values(allPlayers).reduce((acc, player) => {
        const { status, position } = player;

        if (status === "Active" && FANTASY_POSITIONS.includes(position)) {
            playerIdMap[normalizePlayerName(player.full_name)] =
                player.player_id;

            return acc.concat(player);
        }

        return acc;
    }, []);

    return { players, playerIdMap };
};

const getAllDrafts = async () => {
    const allLeagueSeasons = await getAllLeagueSeasons();

    const allDrafts = await Promise.all(
        allLeagueSeasons.map(
            async ({ league_id }) => await getAllDraftsForLeague(league_id)
        )
    );

    return _.flatten(allDrafts);
};

const getDraftPicksByPlayerId = async () => {
    const allDrafts = await getAllDrafts();

    const allDraftPicks = [];

    await Promise.all(
        allDrafts.map(async ({ season, draft_id }) => {
            const draftPicks = await getDraftPicks(draft_id);

            const picksWithSeason = draftPicks.map((pick) => {
                const {
                    is_keeper,
                    round,
                    roster_id,
                    pick_no,
                    draft_slot,
                    player_id,
                } = pick;

                return {
                    player_id,
                    season,
                    type: `DRAFT_${is_keeper ? "KEEPER" : "PICK"}`,
                    round,
                    pick: draft_slot,
                    overall: pick_no,
                    draftedBy: roster_id,
                };
            });

            allDraftPicks.push(...picksWithSeason);
        })
    );

    return _.groupBy(allDraftPicks, "player_id");
};

const getTransactionByPlayerIDs = async () => {
    const allLeagueSeasons = await getAllLeagueSeasons();

    const transactions = await Promise.all(
        allLeagueSeasons.map(async ({ league_id, season }) => {
            const t = [];

            const p = await Promise.all(
                _.times(18).map((i) => getLeagueTransactions(league_id, i))
            );

            t.push(..._.flatten(p));

            return _.flattenDeep(t.map((y) => ({ ...y, season })));
        })
    );

    return _.flatten(transactions)
        .filter(({ status }) => status === "complete")
        .reduce((acc, { leg, adds, drops, type, season, ...r }) => {
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
};

const mergePlayerTransactions = (draftPicks = [], transactions = []) => {
    return _.orderBy(
        [...draftPicks, ...transactions],
        ({ season, week, type }) => {
            return [Number(season), Number(week || 100), type];
        },
        ["desc", "desc", "desc"]
    );
};

const getPlayerKeeperValue = (transactions, player) => {
    const nonTradedTransactions = transactions.filter(
        ({ type }) => !type.includes("TRADE")
    );

    const lastTransaction = nonTradedTransactions?.at(0);

    if (!lastTransaction) return 0;

    const {
        season: lastTransactionSeason,
        type: lastTransactionSeasonType,
        round: lastRoundDrafted,
        draftedBy: lastTeamDraftedBy,
    } = lastTransaction;

    if (
        Number(lastTransactionSeason) !== dayjs().year() - 1 ||
        lastTransactionSeasonType === "WAIVER_DROP"
    ) {
        return 0;
    } else if (lastTransactionSeasonType === "DRAFT_PICK") {
        return lastRoundDrafted - 1;
    } else if (lastTransactionSeasonType === "DRAFT_KEEPER") {
        const consecutiveTimesKeptByOwner = nonTradedTransactions.findIndex(
            ({ type, draftedBy }) =>
                type !== "DRAFT_KEEPER" || draftedBy !== lastTeamDraftedBy
        );

        const keeperAdjustment = getFibonacciNumberFromSequence(
            consecutiveTimesKeptByOwner
        );

        return lastRoundDrafted - keeperAdjustment;
    } else {
        return "TBD";
    }
};

const getFibonacciNumberFromSequence = (sequence) =>
    [0, 1, 2, 3, 5, 8, 13, 21][sequence + 1] || "TBD";

const getPlayerAdpMap = async (playerIdMap) => {
    const { data } = await axios.get(
        "https://www.fantasypros.com/nfl/adp/half-point-ppr-overall.php"
    );

    const playerAdpMap = {};

    const $ = cheerio.load(data);
    $("tbody tr").each((i, el) => {
        const $el = $(el);
        const name = $el.find(".player-name").text();
        const adp = Number($el.find("td").eq(-1).text());

        const playerId = playerIdMap[normalizePlayerName(name)];

        playerAdpMap[playerId] = adp;
    });

    return playerAdpMap;
};

const getAllPlayersTransactions = async () => {
    const { players, playerIdMap } = await getValidPlayers();

    const playerAdpMap = await getPlayerAdpMap(playerIdMap);

    const draftPicksByPlayerId = await getDraftPicksByPlayerId();
    const transactionsByPlayerId = await getTransactionByPlayerIDs();

    return players.map((player) => {
        const { player_id: playerId, full_name, position } = player;

        const playerDraftPicks = draftPicksByPlayerId[playerId];
        const playerTransactions = transactionsByPlayerId[playerId];

        const transactions = mergePlayerTransactions(
            playerDraftPicks,
            playerTransactions
        );

        const keeperValueForCurrentTeam = getPlayerKeeperValue(
            transactions,
            full_name
        );

        const adp = playerAdpMap[playerId] || null;
        const adr = adp ? Math.ceil(adp / 12) : null;

        return {
            // ...player,
            playerId,
            adp,
            adr,
            name: full_name,
            position,
            keeperValueForCurrentTeam,
            transactions,
        };
    });

    return { transactions, draftPicksBySeason, players };

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

    const b = Object.entries(transactions).reduce(
        (acc, [playerId, transactions]) => {
            const playerTransactions = transactions[playerId];

            if (!acc[playerId]) {
                if (!players[playerId]) return acc;
                const { first_name, last_name } = players[playerId];

                acc[playerId] = {
                    name: `${first_name} ${last_name}`,
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

const getKeeperValue = (playerId, allPlayerHistory, allPLayerADPData) => {
    if (!allPlayerHistory[playerId] || !allPlayerHistory[playerId].name) {
        console.log(`No Transactions for ${playerId}`);
        return;
    }

    const playerNameKey = normalizePlayerName(allPlayerHistory[playerId].name);
    const adpData = allPLayerADPData[playerNameKey] || { adr: 9, adp: null };

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
        const value = adpData.adr + 1;
        return {
            name: allPlayerHistory[playerId].name,
            value: value > 19 ? 19 : value,
            playerId,
            isAdpCalculated: true,

            ...adpData,
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

    if (
        lastNonTradeTransaction?.type === "DRAFT_PICK" &&
        lastNonTradeTransaction?.draftMetadata.round <= 2
    ) {
        return {
            name: allPlayerHistory[playerId].name,
            value: 0,
            playerId,
            ...adpData,
        };
    }

    if (
        ["WAIVER_ADD", "WAIVER_DROP"].includes(
            sortedTransactions.at(seasonsWithOwner - 1).type
        )
    ) {
        const value =
            sortedTransactions.at(0).draftMetadata?.round -
            getFibinnaci(seasonsWithOwner + 1);

        return {
            name: allPlayerHistory[playerId].name,
            value: value < 0 ? 0 : value,
            playerId,
            ...adpData,
        };
    }

    if (
        ["TRADED_IN"].includes(sortedTransactions.at(seasonsWithOwner - 1).type)
    ) {
        if (lastNonTradeTransaction.type === "WAIVER_ADD") {
            const value = adpData.adr - keeperValue;

            return {
                name: allPlayerHistory[playerId].name,
                value: value > 19 ? 19 : value,
                playerId,
                isAdpCalculated: true,
                ...adpData,
            };
        }

        return {
            name: allPlayerHistory[playerId].name,
            value: lastNonTradeTransaction?.draftMetadata.round - keeperValue,
            playerId,
            ...adpData,
        };
    }

    const intialDraftValue = sortedTransactions.at(seasonsWithOwner - 1)
        .draftMetadata.round;

    if (intialDraftValue - keeperValue < 1) {
        return {
            name: allPlayerHistory[playerId].name,
            value: 0,
            playerId,
            ...adpData,
        };
    }

    return {
        name: allPlayerHistory[playerId].name,
        value: intialDraftValue - keeperValue,
        playerId,
    };
};

app.get("/", async (req, res) => {
    const allPlayerHistory = await getAllPlayersTransactions();

    return res.send(allPlayerHistory);
    const playerADPs = await getPlayerADPs();
    // const allPlayers = await getAllPlayers();
    const currentLeagueManagers = await getLeagueManagers();
    //TODO:

    return res.send({
        allPlayerHistory,
        playerADPs,
        // allPlayers,
        currentLeagueManagers,
    });

    // const activePlayers = await getActivePlayers();

    const rosters = await getRostersFromLastCompletedSeason();

    const sortOrder = {
        QB: 1,
        RB: 2,
        WR: 3,
        TE: 4,
        K: 5,
        DEF: 6,
    };

    const n = Object.entries(rosters).reduce((acc, [teamId, roster]) => {
        const tid = currentLeagueManagers[teamId].metadata.team_name;
        if (!acc[tid]) {
            acc[tid] = [];
        }

        acc[tid] = _.uniqBy(
            roster
                .map((playerId) =>
                    getKeeperValue(playerId, allPlayerHistory, playerADPs)
                )
                .filter(Boolean),
            "playerId"
        ).map((history) => {
            const playerData = allPlayers[history.playerId];

            const normalizedName = normalizePlayerName(history.name);

            return {
                ...history,
                team: playerData.team,
                position: playerData.position,
                id: playerData.sportradar_id,
                image: playerImages[`${playerData.position}_${normalizedName}`],
                positionOrder: sortOrder[playerData.position],
            };
        });

        return acc;
    }, {});

    res.send(n);
});

app.listen(1738, () => {
    console.log("Server is running on port 1738");
});
