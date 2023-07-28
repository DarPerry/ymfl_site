import { useState } from "react";
import Select from "react-select";
import _ from "lodash";
import styles from "./KeeperPrices.module.scss";

import Page from "../components/Page/Page";
import PlayerRow from "../components/PlayerRow/PlayerRow";
import { getPlayersFromApiResponse } from "../helpers/players.helper";
import classNames from "classnames";
import PositionBadge from "../components/PositionBadge/PositionBadge";

const SelectFilter = ({ title, options, width, filter, setFilter }) => {
    return (
        <div>
            <div className={styles.filterLabel}>{title}</div>
            <Select
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: "gray",
                        backgroundColor: "#eeeeee",
                        color: "rgb(102, 102, 102)",
                        fontSize: "12px",
                        fontWeight: "400",
                        width: `${width}px`,
                        height: "fit-content",
                        minHeight: "0",
                    }),
                    valueContainer: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: "0 10px",
                    }),

                    indicatorsContainer: (baseStyles, state) => ({
                        padding: "0px",
                        "> div": {
                            padding: "0px",
                        },
                    }),

                    input: (baseStyles, state) => ({
                        ...baseStyles,
                        padding: "2px",
                        margin: "0",
                    }),
                    indicatorSeparator: (baseStyles, state) => ({
                        ...baseStyles,
                        display: "none",
                    }),
                }}
                options={options}
                value={{ value: filter, label: filter }}
                defaultValue={{ value: "All", label: "All" }}
                onChange={({ value }) => {
                    setFilter(value);
                }}
            />
        </div>
    );
};

const KeeperPricesPage = ({ data }) => {
    console.log("data", data);

    const [rosterFilter, setRosterFilter] = useState("All");
    const [positionFilter, setPositionFilter] = useState("ALL");

    const [valueFilter, setValueFilter] = useState(false);
    const [ineligibleFilter, setIneligibleFilter] = useState(true);

    const [sort, setSort] = useState({
        key: "adp",
        direction: "asc",
    });

    const SortOption = ({ label }) => {
        const keyMap = {
            Cost: "keeperValueForCurrentTeam",
            Value: "diff",
            ADP: "adp",
            Name: "name",
        };

        return (
            <div
                className={styles.sortOption}
                onClick={() => {
                    if (sort.key === keyMap[label]) {
                        setSort({
                            ...sort,
                            direction:
                                sort.direction === "asc" ? "desc" : "asc",
                        });
                    } else {
                        setSort({ ...sort, key: keyMap[label] });
                    }
                }}
            >
                {sort.key === keyMap[label] ? (
                    <i
                        className={classNames(
                            `fa-solid fa-caret-${
                                sort.direction === "asc" ? "up" : "down"
                            }`
                        )}
                    />
                ) : (
                    <i
                        className={classNames("fa-solid fa-dash", styles.dash)}
                    />
                )}
                <div className={styles.optionLabel}>{label}</div>
            </div>
        );
    };

    const players = getPlayersFromApiResponse(data, sort, {
        position: positionFilter,
        roster: rosterFilter,
        ineligible: ineligibleFilter,
        value: valueFilter,
    });

    const hcThreshold = 20;

    const filtered = _.flattenDeep(Object.values(data || {})).filter(
        ({ adp, keeperValueForCurrentTeam }) => adp && keeperValueForCurrentTeam
    );

    const hotColdPlayers = _.orderBy(filtered, ["diff", "adp"]).reduce(
        (acc, { playerId }, index) => {
            if (index < hcThreshold) {
                acc[playerId] = "HOT";
            } else if (index > filtered.length - hcThreshold) {
                acc[playerId] = "COLD";
            } else {
                acc[playerId] = null;
            }

            return acc;
        },
        {}
    );

    return (
        <Page isLoading={data === null}>
            <>
                <div className={styles.toolbar}>
                    <div className={styles.filters}>
                        <div className={styles.filterTitle}>Filters</div>
                        <div className={styles.filters2}>
                            <SelectFilter
                                title="Rostered By"
                                width={115}
                                filter={rosterFilter}
                                setFilter={(x) => {
                                    console.log(x, rosterFilter);
                                    setRosterFilter(x);
                                }}
                                options={_.orderBy(
                                    [
                                        { value: "All", label: "All" },
                                        {
                                            value: "Darius",
                                            label: "Darius",
                                        },
                                        { value: "Nick", label: "Nick" },
                                        { value: "Jack", label: "Jack" },
                                        { value: "Hues", label: "Hues" },
                                        { value: "Quast", label: "Quast" },
                                        {
                                            value: "Jeremiah",
                                            label: "Jeremiah",
                                        },
                                        {
                                            value: "Brayden",
                                            label: "Brayden",
                                        },
                                        {
                                            value: "T Cool",
                                            label: "T Cool",
                                        },
                                        { value: "Bob", label: "Bob" },
                                        { value: "Zack", label: "Zack" },
                                    ],
                                    "label"
                                )}
                            />
                        </div>
                        <div className={styles.filter}>
                            <div className={styles.filterLabel}>Position</div>
                            <div className={styles.filterBadges}>
                                {[
                                    "ALL",
                                    "QB",
                                    "RB",
                                    "WR",
                                    "TE",
                                    "K",
                                    "DEF",
                                ].map((position) => (
                                    <PositionBadge
                                        position={position}
                                        filled={positionFilter === position}
                                        onClick={() =>
                                            setPositionFilter(position)
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                        <div className={styles.checkboxes}>
                            <div>
                                <input
                                    className={styles.checkbox}
                                    type="checkbox"
                                    checked={ineligibleFilter}
                                    onChange={() =>
                                        setIneligibleFilter(!ineligibleFilter)
                                    }
                                />
                                <label className={styles.checkboxLabel}>
                                    Only Show Players Who Can Be Kept
                                </label>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    value={valueFilter}
                                    onChange={(checked) => {
                                        console.log(checked);
                                        setValueFilter(!valueFilter);
                                    }}
                                />
                                <label className={styles.checkboxLabel}>
                                    Hide Players With Negative Value
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.filters}>
                        <div className={styles.filterTitle}>Sort By</div>
                        <div className={styles.sortOptions}>
                            <SortOption label="Name" />
                            <SortOption label="Cost" />
                            <SortOption label="Value" />
                            <SortOption label="ADP" />
                            {/* <SortOption label="Position" /> */}
                        </div>
                    </div>
                </div>
                <body className={styles.body}>
                    {players.map((player) => {
                        return (
                            <PlayerRow
                                {...player}
                                hotColdPlayers={hotColdPlayers}
                            />
                        );
                    })}
                </body>
            </>
        </Page>
    );
};

export default KeeperPricesPage;
