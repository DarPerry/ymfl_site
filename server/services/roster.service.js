import { getLastCompletedSeason, getLeagueRosters } from "./league.service.js";

const getRostersFromLastCompletedSeason = async () => {
    const { league_id } = await getLastCompletedSeason();

    const leagueRosters = await getLeagueRosters(league_id);

    // return leagueRosters;

    return leagueRosters.reduce((acc, { players, reserve, roster_id }) => {
        if (Number(roster_id)) {
            acc[roster_id] = [...players, ...(reserve || [])];
        }

        return acc;
    }, {});
};
