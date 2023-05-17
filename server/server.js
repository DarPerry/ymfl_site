import express from "express";
import { getAvatar } from "./services/avatar.service.js";
import { getAllLeaguesForUser, getLeague } from "./services/league.service.js";

import { getUser } from "./services/user.service.js";

const app = express();

const MY_USER_ID = "444630794862850048";
const YMFL_LEAGUE_ID = "837484548060192768";

app.get("/", async (req, res) => {
    res.send(await getLeague(YMFL_LEAGUE_ID));
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
