import _ from "lodash";

export const getPlayersFromApiResponse = (
    apiResponse,
    sortMetadata,
    filters
) => {
    const { key: sortProp, direction: sortDirection } = sortMetadata;
    const {
        position: positionFilter,
        roster: rosterFilter,
        ineligible: ineligibleFilter,
        value: valueFilter,
    } = filters;

    return _.orderBy(
        _.flattenDeep(Object.values(apiResponse || {})),
        [
            sortProp,
            // "diff",
            "adp",
        ],
        sortDirection
    ).filter(
        ({
            adp,
            keeperValueForCurrentTeam,
            position,
            rosteredBy,
            adr,
            ...r
        }) => {
            const isFilteredPosition =
                positionFilter === position ||
                (positionFilter === "FLEX" &&
                    ["RB", "WR", "TE"].includes(position));
            const value = keeperValueForCurrentTeam - adr;

            return (
                (positionFilter === "ALL" || isFilteredPosition) &&
                (rosterFilter === "All" || rosteredBy === rosterFilter) &&
                (!ineligibleFilter || keeperValueForCurrentTeam) &&
                (!valueFilter || (value >= 0 && adp))
            );
        }
    );
};
