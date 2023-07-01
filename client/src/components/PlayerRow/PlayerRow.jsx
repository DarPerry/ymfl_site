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
    team,
    adp,
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
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "../../../public/images/missing-player.png";
                        }}
                    />
                </div>
                <div className={styles.playerInfo}>
                    <div className={styles.player}>
                        <div className={styles.playerName}>{name}</div>
                    </div>
                    <div className={styles.rosteredBy}>
                        Rostered By:
                        <span className={styles.playerOwner}>{rosteredBy}</span>
                    </div>
                    <div className={styles.badges}>
                        <div
                            className={classNames(
                                styles.playerPosition,
                                styles[position]
                            )}
                        >
                            {position}
                        </div>
                        <div className={classNames(styles.playerPosition)}>
                            {team}
                        </div>
                        <div className={classNames(styles.playerPosition)}>
                            ADP {adp}
                        </div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.keeperCost}>
                    <div className={styles.inside}>
                        <div className={styles.keeperValue}>
                            {keeperCost ? keeperCost : "X"}
                            <span className={styles.valueSuffix}>th</span>
                        </div>
                        <div className={styles.keeperLabel}>
                            {!keeperCost ? "Can't Be Kept" : " Round Pick"}
                        </div>
                    </div>
                </div>
                <div
                    className={classNames(
                        styles.value,
                        keeperCost - adr > 0 && styles.green,
                        keeperCost - adr < 0 && styles.red
                    )}
                >
                    {!adr ? "N/A" : keeperCost - adr} Round Value
                </div>
            </div>
        </div>
    );
};

export default PlayerRow;
