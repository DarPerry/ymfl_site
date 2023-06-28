import classNames from "classnames";
import styles from "./PlayerRow.module.scss";

const getPlayerImage = (name) =>
    `../../../public/images/${name?.split(" ").join("-")}.png`;

const PlayerRow = ({
    keeperValueForCurrentTeam: keeperCost,
    name,
    position,
}) => {
    return (
        <div className={styles.playerRow}>
            <div className={styles.left2}>
                <div className={styles.imageContainer}>
                    <img
                        className={styles.playerImage}
                        src={getPlayerImage(name)}
                    />
                </div>
                <div className={styles.playerInfo}>
                    <div className={styles.player}>
                        <div className={styles.playerName}>{name}</div>
                        <div
                            className={classNames(
                                styles.playerPosition,
                                styles[position]
                            )}
                        >
                            {position}
                        </div>
                    </div>
                    <div className={styles.rosteredBy}>
                        Rostered By:
                        <span className={styles.playerOwner}>Jeremiah</span>
                    </div>
                </div>
            </div>
            <div className={styles.keeperCost}>
                <div className={styles.keeperValue}>
                    {keeperCost}
                    <span className={styles.valueSuffix}>th</span>
                </div>
                <div className={styles.keeperLabel}>
                    {!keeperCost ? "Can't Be Kept" : " Round Pick"}
                </div>
            </div>
        </div>
    );
};

export default PlayerRow;
