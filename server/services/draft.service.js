import { load } from "cheerio";
import got from "got";
import { fetchFromSleeperEndpoint } from "../util/api.util.js";
import { normalizePlayerName } from "./player.service.js";

const getAllDraftsForUser = async (userId, season) =>
    fetchFromSleeperEndpoint(`/user/${userId}/drafts/nfl/${season}`);

export const getAllDraftsForLeague = async (leagueId) =>
    fetchFromSleeperEndpoint(`/league/${leagueId}/drafts`);

const getDraft = async (draftId) =>
    fetchFromSleeperEndpoint(`/draft/${draftId}`);

export const getDraftPicks = async (draftId) =>
    fetchFromSleeperEndpoint(`/draft/${draftId}/picks`);

const getDraftTradedPicks = async (draftId) =>
    fetchFromSleeperEndpoint(`/draft/${draftId}/traded_picks`);

const getPlayerADPs = async () => {
    const playerAdpMap = {};

    const { body: html } = await got(
        "https://www.fantasypros.com/nfl/rankings/superflex-cheatsheets.php"
    );
    const $ = load(html);
    const $selected = $("tr");

    $selected.each((i, el) => {
        if (i === 0) return;

        const nameText = $(el).children().eq(1).text();
        const nameFragments = nameText.trim().split(" ");
        nameFragments.splice(-2);
        const playerName = normalizePlayerName(nameFragments.join(" "));
        const adp = Number($(el).children().eq(9).text());

        playerAdpMap[playerName] = {
            adr: Math.ceil(adp / 10),
            adp,
        };
    });

    return playerAdpMap;
};
