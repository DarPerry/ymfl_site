import Page from "../../components/Page/Page";

import styles from "./RulesPage.module.scss";

const RulesPage = () => {
    return (
        <Page>
            <div className={styles.rule}>
                <div className={styles.title}>Entry Fee & Payouts</div>
                <div className={styles.body}>
                    <ul className={styles.list}>
                        <li>
                            Entry Cost: <b>$50</b>
                        </li>
                        <li>
                            Champion: <b>$400</b>
                        </li>
                        <li>
                            Runner-Up: <b>$125</b>
                        </li>
                        <li>
                            Season Points Leader: <b>$75</b>
                        </li>
                    </ul>
                </div>
            </div>
        </Page>
    );
};

export default RulesPage;
