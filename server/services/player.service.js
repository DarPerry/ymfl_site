import { fetchFromSleeperEndpoint } from "../util/api.util.js";

export const getAllPlayers = async () =>
    fetchFromSleeperEndpoint(`/players/nfl`);

export const getTrendingPlayers = async () =>
    fetchFromSleeperEndpoint(`/players/nfl/trending`);
