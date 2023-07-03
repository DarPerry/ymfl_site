import _ from "lodash";
import dayjs from "dayjs";

import { fetchFromSleeperEndpoint } from "../util/api.util.js";

const YEAR_STARTED = 2019;
const MY_USER_ID = "444630794862850048";
const YMFL_LEAGUE_ID = "837484548060192768";
const LEAGUE_NAME = "Your Mom's Favorite League";
const JUSTIN_JEFFERSON_PLAYER_ID = "6794";

const getAllLeaguesForUser = async (userId, season) =>
    fetchFromSleeperEndpoint(`/user/${userId}/leagues/nfl/${season}`);

const getLeague = (leagueId) => fetchFromSleeperEndpoint(`/league/${leagueId}`);

const getLeagueRosters = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/rosters`);

const getLeagueUsers = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/users`);

const getLeagueMatchups = (leagueId, week) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/matchups/${week}`);

//TODO: Getting the Playoff Bracket
const getPlayoffBracket = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/winners_bracket`);

const getLeagueTransactions = (leagueId, week) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/transactions/${week}`);

const getLeagueTradedPicks = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/traded_picks`);

const getNflState = () => fetchFromSleeperEndpoint(`/state/nfl`);

const getAllLeagueSeasons = async () => {
    const yearsLeagueHasExisted = dayjs().diff(
        dayjs(`${YEAR_STARTED}-01-01`),
        "year"
    );

    const responses = await Promise.all(
        Array.from({ length: yearsLeagueHasExisted }).map(async (_, i) => {
            const year = YEAR_STARTED + i;
            const leagues = await getAllLeaguesForUser(MY_USER_ID, year);
            return leagues;
        })
    );

    const leaguesSinceInception = _.flatten(responses).filter(
        ({ name }) => name === LEAGUE_NAME
    );

    return leaguesSinceInception;
};

const getLastCompletedSeason = async () => {
    const allLeagueSeasons = await getAllLeagueSeasons();

    return allLeagueSeasons[allLeagueSeasons.length - 1];
};

// GET https://api.sleeper.app/v1/user/<user_id>/leagues/<sport>/<season>

const getLeagueManagers = async (req, res) => {
    const currentLeagueId = await fetchFromSleeperEndpoint(
        `/user/${MY_USER_ID}/leagues/nfl/${dayjs().year()}`
    );

    const cli = currentLeagueId.at(0).league_id;

    const currentRosters = await fetchFromSleeperEndpoint(
        `/league/${cli}/rosters`
    );

    const currentUsers = await fetchFromSleeperEndpoint(`/league/${cli}/users`);

    return currentUsers.reduce((acc, curr) => {
        const match = currentRosters.find(
            ({ owner_id }) => owner_id === curr.user_id
        );

        acc[match.roster_id] = { ...match, ...curr };

        return acc;
    }, {});
};
