import styles from "./PositionBadge.module.scss";

import classNames from "classnames";

const PositionBadge = ({ filled, onClick, position }) => {
    return (
        <div
            className={classNames(
                styles.playerPosition,
                styles[position],
                filled && styles.filled
            )}
            onClick={onClick}
        >
            {position}
        </div>
    );
};

export default PositionBadge;
