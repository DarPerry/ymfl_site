import classNames from "classnames";
import styles from "./Card.module.scss";
import _ from "lodash";
import { useState } from "react";
import { getPlayerRoundSuffix } from "../../util/playerUtil";

const MockPlayerRow = ({ name, position, value, image }) => (
    <div className={styles.player}>
        <div className={styles.left}>
            <div className={styles.imageContainer}>
                <img className={styles.playerImage} src={image} />
            </div>
            <div className={styles.playerInfo}>
                <div className={styles.playerName}>{name}</div>
                <div
                    className={classNames(
                        styles.keeperValue,
                        !value && styles.cantKeep
                    )}
                >
                    {!value
                        ? "Can't Be Kept"
                        : `${value}${getPlayerRoundSuffix(value)} Round`}
                </div>
            </div>
        </div>
        <div className={styles.right}></div>
    </div>
);

const Card = ({ keeperData }) => {
    const teams = Object.keys(keeperData).sort();

    const [selectedTeam, setSelectedTeam] = useState(teams.at(0));
    const selectedTeamRosterByPosition = _.groupBy(
        keeperData[selectedTeam],
        ({ position }) => position
    );

    console.log("keeperData", keeperData);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                {teams.map((teamName) => (
                    <div
                        className={classNames(
                            styles.teamOption,
                            teamName === selectedTeam && styles.active
                        )}
                        onClick={() => setSelectedTeam(teamName)}
                    >
                        {teamName}
                    </div>
                ))}
            </div>
            <div className={styles.body}>
                {_.orderBy(
                    Object.entries(selectedTeamRosterByPosition),
                    ([position]) => {
                        const positionMap = {
                            QB: 1,
                            RB: 2,
                            WR: 3,
                            TE: 4,
                            K: 5,
                            DST: 6,
                        };

                        return positionMap[position];
                    }
                ).map(([position, players]) => {
                    return (
                        <div className={styles.playerContainer}>
                            <div
                                className={classNames(
                                    styles.positionBadge,
                                    styles[position]
                                )}
                            >
                                {position}
                            </div>
                            <div className={styles.positionGroup}>
                                {_.orderBy(players, ({ value }) => value).map(
                                    (player) => (
                                        <MockPlayerRow {...player} />
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Card;
