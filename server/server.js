import dayjs from "dayjs";
import _ from "lodash";
import express from "express";
import { getAvatar } from "./services/avatar.service.js";
import {
    getAllDraftsForLeague,
    getDraftPicks,
} from "./services/draft.service.js";
import { getAllLeaguesForUser, getLeague } from "./services/league.service.js";

import { getUser } from "./services/user.service.js";
import { getAllPlayers } from "./services/player.service.js";

const app = express();

const MY_USER_ID = "444630794862850048";
const YMFL_LEAGUE_ID = "837484548060192768";
const YEAR_STARTED = 2019;
const LEAGUE_NAME = "Your Mom's Favorite League";
const JUSTIN_JEFFERSON_PLAYER_ID = "6794";

const func = async () => {
    //dayjs years since
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

    const allDrafts = await Promise.all(
        leaguesSinceInception.map(async ({ league_id }) => {
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

    return draftPicksBySeason;

    const myLeagues = await getAllLeaguesForUser(MY_USER_ID);

    return myLeagues;
};

app.get("/", async (req, res) => {
    res.send(await func());
});

app.listen(1738, () => {
    console.log("Server is running on port 1738");
});
