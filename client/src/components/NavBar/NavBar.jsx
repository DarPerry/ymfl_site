import styles from "./NavBar.module.scss";

const NavBar = () => {
    return (
        <div className={styles.navBar}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.navOptions}>
                <div className={styles.option}>Rules</div>
                <div className={styles.option}>Keeper Values</div>
            </div>
        </div>
    );
};

export default NavBar;
