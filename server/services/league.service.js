import { fetchFromSleeperEndpoint } from "../util/api.util.js";

export const getAllLeaguesForUser = async (userId, season) =>
    fetchFromSleeperEndpoint(`/user/${userId}/leagues/nfl/${season}`);

export const getLeague = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}`);

export const getLeagueRosters = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/rosters`);

export const getLeagueUsers = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/users`);

export const getLeagueMatchups = (leagueId, week) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/matchups/${week}`);

//TODO: Getting the Playoff Bracket
export const getPlayoffBracket = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/winners_bracket`);

export const getLeagueTransactions = (leagueId, week) =>
    fetchFromSleeperEndpoint(`/transactions/${leagueId}/${week}`);

export const getLeagueTradedPicks = (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/traded_picks`);

export const getNflState = () => fetchFromSleeperEndpoint(`/state/nfl`);
