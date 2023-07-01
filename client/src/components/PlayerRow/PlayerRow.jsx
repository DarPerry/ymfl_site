import classNames from "classnames";
import styles from "./PlayerRow.module.scss";

const teamColors = {
    CLE: "#fb4f14",
    NE: "#c60c30",
    CHI: "#c83803",
    DAL: "#b0b7bc",
    NYJ: "#115740",
    LAC: "#127dc5",
    NYG: "#a71930",
    ATL: "#a6192e",
    MIA: "#008c95",
    NO: "#9f8958",
    JAX: "#9f792c",
    CAR: "#0085ca",
    SEA: "#69be29",
    PHI: "#a5acaf",
    DET: "#0069b1",
    SF: "#b3995d",
    MIN: "#ffc72c",
    IND: "#a5acaf",
    LV: "#87909a",
    HOU: "#a71930",
    CIN: "#fc4c02",
    DEN: "#0c2340",
    BAL: "#241773",
    GB: "#ffb611",
    TB: "#c91331",
    ARI: "#9b2743",
    PIT: "#ffb81c",
    KC: "#ffb611",
    TEN: "#4b92db",
    BUF: "#c60c30",
    WAS: "#ffb611",
    LAR: "#063992",
};

const getPlayerImage = (name) =>
    `../../../public/images/${name
        ?.replaceAll(".", "")
        ?.replaceAll("'", "")
        ?.split(" ")
        .join("-")}.png`;

const HotColdIcon = ({ type }) => {
    if (!type) return;

    return type === "HOT" ? (
        <div className={classNames(styles.hot, styles.hcIcon)}>
            <i class="fa-duotone fa-fire" />
        </div>
    ) : (
        <div className={classNames(styles.cold, styles.hcIcon)}>
            <i class="fa-duotone fa-snowflake" />
        </div>
    );
};

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

const PlayerRow = ({
    keeperValueForCurrentTeam: keeperCost,
    name,
    position,
    rosteredBy,
    adr,
    team,
    adp,
    hotColdPlayers,
    playerId: id,
    diff,
}) => {
    return (
        <div className={styles.playerRow}>
            <div className={styles.left2}>
                <div
                    className={styles.imageContainer}
                    style={{
                        borderColor: teamColors[team],
                    }}
                >
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
                            {team || "FA"}
                        </div>
                        <div className={classNames(styles.playerPosition)}>
                            ADP {adp || "UDFA"}
                        </div>
                        <HotColdIcon type={hotColdPlayers[id]} />
                    </div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.keeperCost}>
                    <div className={styles.inside}>
                        <div className={styles.keeperValue}>
                            {keeperCost ? (
                                <div>
                                    {keeperCost}
                                    <span className={styles.valueSuffix}>
                                        {getNumberSuffix(keeperCost)}
                                    </span>
                                </div>
                            ) : (
                                <i class="fa-solid fa-ban" />
                            )}
                        </div>
                        <div className={styles.keeperLabel}>
                            {!keeperCost ? "Can't Be Kept" : " Round Pick"}
                        </div>
                    </div>
                </div>
                <div
                    className={classNames(
                        styles.value,
                        adp && keeperCost - adr > 0 && styles.green,
                        adp && keeperCost - adr < 0 && styles.red
                    )}
                >
                    {!adr || !keeperCost ? "N/A" : keeperCost - adr} Round Value
                </div>
            </div>
        </div>
    );
};

export default PlayerRow;
