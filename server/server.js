import dayjs from "dayjs";
import _ from "lodash";
import axios from "axios";
import express from "express";
import * as cheerio from "cheerio";
import {
    getAllDraftsForLeague,
    getDraftPicks,
} from "./services/draft.service.js";
import {
    getAllLeagueSeasons,
    getLeagueRosters,
    getLeagueTransactions,
} from "./services/league.service.js";

const ROUNDS_IN_DRAFT = 18;

import {
    getAllPlayers,
    normalizePlayerName,
} from "./services/player.service.js";
import { FANTASY_POSITIONS, LEAGUE_ID } from "./config/index.config.js";

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
        season: Number(season),
        week,
        type,
        draftMetadata,
    };
};

const getValidPlayers = async () => {
    const allPlayers = await getAllPlayers();

    const playerIdMap = {};

    const teamNameMap = {
        ARI: "Arizona Cardinals",
        ATL: "Atlanta Falcons",
        BAL: "Baltimore Ravens",
        BUF: "Buffalo Bills",
        CAR: "Carolina Panthers",
        CHI: "Chicago Bears",
        CIN: "Cincinnati Bengals",
        CLE: "Cleveland Browns",
        DAL: "Dallas Cowboys",
        DEN: "Denver Broncos",
        DET: "Detroit Lions",
        GB: "Green Bay Packers",
        HOU: "Houston Texans",
        IND: "Indianapolis Colts",
        JAX: "Jacksonville Jaguars",
        KC: "Kansas City Chiefs",
        LAC: "Los Angeles Chargers",
        LAR: "Los Angeles Rams",
        LV: "Las Vegas Raiders",
        MIA: "Miami Dolphins",
        MIN: "Minnesota Vikings",
        NE: "New England Patriots",
        NO: "New Orleans Saints",
        NYG: "New York Giants",
        NYJ: "New York Jets",
        PHI: "Philadelphia Eagles",
        PIT: "Pittsburgh Steelers",
        SEA: "Seattle Seahawks",
        SF: "San Francisco 49ers",
        TB: "Tampa Bay Buccaneers",
        TEN: "Tennessee Titans",
        WAS: "Washington Football Team",
    };

    const additionalIdsToInclude = ["jamesonwilliams"];

    const players = Object.values(allPlayers).reduce((acc, player) => {
        const { status, position, active, search_full_name } = player;

        const isActive =
            additionalIdsToInclude.includes(player.search_full_name) ||
            status === "Active" ||
            (position === "DEF" && active);

        if (isActive && FANTASY_POSITIONS.includes(position)) {
            playerIdMap[
                normalizePlayerName(player.full_name) ||
                    `${teamNameMap[player.team]
                        .replaceAll(/ /g, "_")
                        .toUpperCase()}_DST`
            ] = player.player_id || `${player.team}_DST`;

            return acc.concat(player);
        }

        return acc;
    }, []);

    return { players, playerIdMap, playerIdMap };
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
                    season: Number(season),
                    week: 0,
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
        ["season", "week", "type"],
        ["desc", "desc", "asc"]
    );
};

const getPlayerKeeperValue = (transactions, playerAdr) => {
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

    let keeperValue = 0;

    if (
        Number(lastTransactionSeason) !== dayjs().year() - 1 ||
        lastTransactionSeasonType === "WAIVER_DROP"
    ) {
        return 0;
    } else if (lastTransactionSeasonType === "DRAFT_PICK") {
        keeperValue = lastRoundDrafted - 1;
    } else if (lastTransactionSeasonType === "DRAFT_KEEPER") {
        const consecutiveTimesKeptByOwner = nonTradedTransactions.findIndex(
            ({ type, draftedBy }) =>
                type !== "DRAFT_KEEPER" || draftedBy !== lastTeamDraftedBy
        );

        const keeperAdjustment = getFibonacciNumberFromSequence(
            consecutiveTimesKeptByOwner
        );

        keeperValue = lastRoundDrafted - keeperAdjustment;
    } else {
        keeperValue = !playerAdr ? ROUNDS_IN_DRAFT : playerAdr + 1;
    }

    if (keeperValue < 0) {
        return 0;
    }

    if (keeperValue > ROUNDS_IN_DRAFT) {
        return ROUNDS_IN_DRAFT;
    }

    return keeperValue;
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

    // return playerAdpMap;

    const draftPicksByPlayerId = await getDraftPicksByPlayerId();
    const transactionsByPlayerId = await getTransactionByPlayerIDs();

    return players.map((player) => {
        const { player_id: playerId, full_name, position, team } = player;

        const adp = playerAdpMap[playerId] || null;
        const adr = adp ? Math.ceil(adp / 12) : null;

        const playerDraftPicks = draftPicksByPlayerId[playerId];
        const playerTransactions = transactionsByPlayerId[playerId];

        const transactions = mergePlayerTransactions(
            playerDraftPicks,
            playerTransactions
        );

        const keeperValueForCurrentTeam = getPlayerKeeperValue(
            transactions,
            adr
        );

        return {
            // ...player,
            playerId,
            team,
            adp,
            adr,
            name: full_name || `${team} DST`,
            position,
            keeperValueForCurrentTeam,
            // transactions,
            diff:
                keeperValueForCurrentTeam <= 0
                    ? 999
                    : adr
                    ? adr - keeperValueForCurrentTeam
                    : 999,
        };
    });
};

const getRostersByTeamId = async () => {
    const rosters = await getLeagueRosters(LEAGUE_ID);
    const allPlayerHistory = await getAllPlayersTransactions();

    const nameMap = {
        1: "Darius",
        2: "Zack",
        3: "Nick",
        4: "Jeremiah",
        5: "Bob",
        6: "Hues",
        7: "Brayden",
        8: "Jack",
        9: "Quast",
        10: "T Cool",
        11: "Tri",
        12: "Joel",
    };

    const playerHistoryById = _.keyBy(allPlayerHistory, "playerId");

    return rosters.reduce((acc, { roster_id, players }) => {
        acc[roster_id] = players.map((playerId) => ({
            ...playerHistoryById[playerId],
            rosteredBy: nameMap[roster_id],
        }));
        return acc;
    }, {});
};

app.get("/", async (req, res) => {
    return res.send(await getRostersByTeamId());
});

app.listen(1738, () => {
    console.log("Server is running on port 1738");
});
