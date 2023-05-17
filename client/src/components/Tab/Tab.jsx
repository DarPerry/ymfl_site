import styles from "./Tab.module.scss";

import classNames from "classnames";

const Tab = ({ icon, label, selected, onClick }) => {
    return (
        <div
            className={classNames(styles.tab, selected && styles.active)}
            onClick={onClick}
        >
            <div className={styles.icon}>{icon}</div>
            <div className={styles.label}>{label}</div>
        </div>
    );
};

export default Tab;
