import styles from "./PositionBadge.module.scss";

import classNames from "classnames";

const PositionBadge = ({ filled, onClick, position, sortBadge }) => {
    return (
        <div
            className={classNames(
                styles.playerPosition,
                styles[position],
                filled && styles.filled,
                sortBadge && styles.sortBadge
            )}
            onClick={onClick}
        >
            {position}
        </div>
    );
};

export default PositionBadge;
