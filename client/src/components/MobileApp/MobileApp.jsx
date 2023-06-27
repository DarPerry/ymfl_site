import PlayerRow from "../PlayerRow/PlayerRow";
import styles from "./MobileApp.module.scss";

import _ from "lodash";

const getNumberSuffix = (number) => {
    const lastDigit = number % 10;

    if (lastDigit === 1) {
        return "st";
    } else if (lastDigit === 2) {
        return "nd";
    } else if (lastDigit === 3) {
        return "rd";
    } else {
        return "th";
    }

    return "";
};

const MobileApp = ({ data }) => {
    const players = _.orderBy(
        _.flattenDeep(Object.values(data)),
        "keeperValueForCurrentTeam"
    );

    return (
        <div className={styles.mobileApp}>
            <div className={styles.header}>
                <div className={styles.left}>Left</div>
                <div className={styles.middle}>
                    <div className={styles.leagueInfo}>
                        <img className={styles.leagueImage} />
                        <div className={styles.leagueName}>The Usubi Boys</div>
                    </div>
                    <div className={styles.pages}>
                        <div className={styles.page}>Rules</div>
                        <div className={styles.page}>Keepers</div>
                    </div>
                </div>
                <div className={styles.right}>Right</div>
            </div>
            <div className={styles.sectionTitle}>Keeper Costs</div>
            {players.map((player) => {
                return <PlayerRow {...player} />;
            })}
        </div>
    );
};

export default MobileApp;
