import { fetchFromSleeperEndpoint } from "../util/api.util.js";

export const getAllDraftsForUser = async (userId, season) =>
    fetchFromSleeperEndpoint(`/user/${userId}/drafts/nfl/${season}`);

export const getAllDraftsForLeague = async (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/drafts`);

export const getDraft = async (draftId) =>
    fetchFromSleeperEndpoint(`/draft/${draftId}`);

export const getDraftPicks = async (draftId) =>
    fetchFromSleeperEndpoint(`/draft/${draftId}/picks`);

export const getDraftTradedPicks = async (draftId) =>
    fetchFromSleeperEndpoint(`/draft/${draftId}/traded_picks`);
