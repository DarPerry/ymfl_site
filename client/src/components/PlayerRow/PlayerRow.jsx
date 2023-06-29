import classNames from "classnames";
import styles from "./PlayerRow.module.scss";

const getPlayerImage = (name) =>
    `../../../public/images/${name
        ?.replaceAll(".", "")
        ?.replaceAll("'", "")
        ?.split(" ")
        .join("-")}.png`;

const PlayerRow = ({
    keeperValueForCurrentTeam: keeperCost,
    name,
    position,
    rosteredBy,
    adr,
}) => {
    return (
        <div className={styles.playerRow}>
            <div className={styles.left2}>
                <div className={styles.imageContainer}>
                    <img
                        className={classNames(
                            styles.playerImage,
                            position === "DEF" && styles.defense
                        )}
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
                        <span className={styles.playerOwner}>{rosteredBy}</span>
                    </div>
                </div>
            </div>
            <div className={styles.keeperCost}>
                {keeperCost ? (
                    <div className={styles.keeperValue}>
                        {keeperCost}
                        <span className={styles.valueSuffix}>th</span>
                    </div>
                ) : (
                    <div>x</div>
                )}
                <div className={styles.keeperLabel}>
                    {!keeperCost ? "Can't Be Kept" : " Round Pick"}
                </div>
                <div className={styles.keeperLabel}>
                    {!adr ? "N/A" : keeperCost - adr}
                </div>
            </div>
        </div>
    );
};

export default PlayerRow;
