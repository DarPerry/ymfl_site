import { fetchFromSleeperEndpoint } from "../util/api.util.js";

export const getAllPlayers = async () =>
    fetchFromSleeperEndpoint(`/players/nfl`);

export const getTrendingPlayers = async () =>
    fetchFromSleeperEndpoint(`/players/nfl/trending`);

export const normalizePlayerName = (playerName) => {
    return playerName
        .toUpperCase()
        .replace(/[^a-zA-Z ]/g, "")
        .replace(/ (?:I+$|JR)/gi, "")
        .replace(/ /, "_");
    // .replace(/\s+/g, " ") // remove suffixes
    // .replace(/[^a-zA-Z ]/g, "")
    // .replace(/\s+/g, " ") // remove suffixes
    // .trim();
};
