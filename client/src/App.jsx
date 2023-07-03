import PropTypes from "prop-types";
import classNames from "classnames";

import { useEffect, useState } from "react";

import styles from "./App.module.scss";

import MobileApp from "./components/MobileApp/MobileApp";

const PlayerCard = ({
    name,
    position,
    team,
    keeperValueForCurrentTeam: keeperCost,
}) => {
    const teamColors = {
        ARI: "#9b2743",
        ATL: "#a6192e",
        BAL: "#241773",
        BUF: "#c60c30",
        CAR: "#0085ca",
        CHI: "#c83803",
        CIN: "#fc4c02",
        CLE: "#fb4f14",
        DAL: "#b0b7bc",
        DEN: "#0c2340",
        DET: "#0069b1",
        GB: "#ffb611",
        HOU: "#a71930",
        IND: "#a5acaf",
        JAX: "#9f792c",
        KC: "#ffb611",
        LAC: "#127dc5",
        LAR: "#063992",
        LV: "#87909a",
        MIA: "#008c95",
        MIN: "#ffc72c",
        NE: "#c60c30",
        NO: "#9f8958",
        NYJ: "#115740",
        NYG: "#a71930",
        PHI: "#a5acaf",
        PIT: "#ffb81c",
        SEA: "#69be29",
        SF: "#b3995d",
        TB: "#c91331",
        TEN: "#4b92db",
    };

    return (
        <div className={styles.playerCard}>
            <div className={styles.left}>
                <div
                    className={styles.imageContainer}
                    style={{ backgroundColor: teamColors[team] }}
                >
                    <img
                        className={styles.playerImage}
                        src="../public/images/justin-fields.png"
                    />
                </div>

                <div className={styles.playerInfo}>
                    <div className={styles.playerName}>{name}</div>
                    <div className={styles.playerDetails}>
                        <div
                            className={classNames(
                                styles.position,
                                styles[position]
                            )}
                        >
                            {position}
                        </div>
                        <div className={styles.divider}>|</div>
                        <div
                            className={styles.position}
                            style={{
                                color: teamColors[team],
                                borderColor: teamColors[team],
                            }}
                        >
                            {team}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.keeperCost}>{keeperCost}th</div>
                <div className={styles.roundLabel}>Round Pick</div>
                <div className={styles.roundLabel}>Round Pick</div>
            </div>
        </div>
    );
};

PlayerCard.propTypes = {
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
    keeperValueForCurrentTeam: PropTypes.number.isRequired,
};

const App = () => {
    return <MobileApp />;
};

export default App;

//! Payout Ideas !\\
/*
- Payout Everytime you win
- Knockout Lowest Player Each Week
- 1st, 2nd, Most Points, 1st in Regular Season
- 3rd -> Money Back, 2nd -> 2x Money Back, 1st -> Rest, Weekly 1/3 Payout Hightst Score
-Payout for best QB RB WR TE K DEF
- 12 Teams, $150 Buy In, Champ gets $600 and tranactiob moneym SB loser gets $250
-10 team 100 buck buy in. Winner gets a G, 2nd gets money back, and last place kicks in an extra 100. 
*/

//! Keeper Rules !\\
/*
Our league format is a 3 keeper league, you franchise one player who is 🔒.
Then select 3 more from your roster (you can’t match position with franchise player) and they go into a lottery where 1 is randomly thrown back into the draft.
Can only keep players twice
- Undrafted Free Agents
We decided that they would go for an 8th round pick the first year and then jump 2 rounds every year afte
Our keeper league allows players to be kept in the round they were drafted and then increasing by 3 rounds each consecutive season up to their ADP. 
- no keepers in first 2 rounds
-trade still uses value- fibanacci for keepers
*/
