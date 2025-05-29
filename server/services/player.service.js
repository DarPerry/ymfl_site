import { fetchFromSleeperEndpoint } from "../util/api.util.js";

export const getAllPlayers = async () =>
    fetchFromSleeperEndpoint(`/players/nfl`);

const getTrendingPlayers = async () =>
    fetchFromSleeperEndpoint(`/players/nfl/trending`);

export const normalizePlayerName = (playerName) => {
    return playerName
        ?.replaceAll(/ (?:I+$|JR|SR)/gi, "")
        ?.replaceAll(/[.]/gi, "")
        ?.replaceAll(/[ -]/g, "_")
        ?.replaceAll(/Hollywood/g, "MARQUISE")
        .toUpperCase();
    // .replace(/\s+/g, " ") // remove suffixes
    // .replace(/[^a-zA-Z ]/g, "")
    // .replace(/\s+/g, " ") // remove suffixes
    // .trim();
};

const getActivePlayers = async () => {
    const response = await fetch(
        "https://api.sportsdata.io/v3/nfl/scores/json/Players?key=e340a235c01640018359b01b03877534"
    );
    const data = await response.json();

    return data.reduce((acc, { PhotoUrl, FirstName, LastName, Position }) => {
        const playerName = normalizePlayerName(`${FirstName} ${LastName}`);
        acc[`${Position}_${playerName}`] = PhotoUrl;
        return acc;
    }, {});
};
