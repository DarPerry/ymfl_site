import classNames from "classnames";

import styles from "./Header.module.scss";

const Header = () => {
    return (
        <header>
            <div className={styles.header}>
                <div className={styles.middle}>
                    <img
                        className={styles.leagueImage}
                        src="/images/league-picture.jpg"
                    />
                    <div>
                        <div className={styles.leagueInfo}>
                            <div className={styles.leagueName}>
                                The Usubi Boys
                            </div>
                        </div>
                        <div className={styles.champ}>
                            <i
                                className={classNames(
                                    "fa-solid fa-user-crown",
                                    styles.crownIcon
                                )}
                            />
                            <span>Reigning Champion:</span>
                            <span className={styles.champName}>Brayden</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.pages}>
                {/* <div className={styles.page}>Rules</div> */}
                <div className={styles.page}>Keepers Prices</div>
            </div>
        </header>
    );
};

export default Header;
