import Page from "../../components/Page/Page";

import styles from "./RulesPage.module.scss";

const RuleCard = ({ children, title }) => {
    return (
        <div className={styles.rule}>
            <div className={styles.title}>{title}</div>
            <div className={styles.body}>{children}</div>
        </div>
    );
};

const NewBadge = () => {
    return <div className={styles.newBadge}>NEW</div>;
};

const RulesList = ({ header, children }) => {
    return (
        <>
            {header && <div className={styles.listHeader}>{header}</div>}
            <ul className={styles.list}>{children}</ul>
        </>
    );
};

const RulesListItem = ({ text, bolded, isNew }) => {
    return (
        <li className={styles.listItem}>
            {isNew && <NewBadge />}
            {text}:<b className={styles.bolded}>{bolded}</b>
        </li>
    );
};

const RulesPage = () => {
    return (
        <Page>
            <RuleCard title={"Entry Fee & Payouts"}>
                <RulesList>
                    <RulesListItem text={"Entry Cost"} bolded={"$50"} />
                    <RulesListItem text={"Champion"} bolded={"$400"} />
                    <RulesListItem text={"Runner-Up"} bolded={"$125"} />
                    <RulesListItem text={"Entry Cost"} bolded={"$75"} />
                </RulesList>
            </RuleCard>
            <RuleCard title={"Scoring"}>
                <RulesList header="Passing">
                    <RulesListItem
                        text={"Passing Yards"}
                        bolded={"0.04 per Yard / 1 per 25 Yards"}
                    />
                    <RulesListItem text={"Passing TD"} bolded={6} />
                    <RulesListItem text={"Pass Intercepted"} bolded={-2} />
                    <RulesListItem text={"2-PT Conversion"} bolded={2} />
                    <RulesListItem text={"Pass Completed"} bolded={0.1} isNew />
                    <RulesListItem
                        text={"40+ Yard TD Bonus"}
                        bolded={2}
                        isNew
                    />
                </RulesList>
            </RuleCard>
        </Page>
    );
};

export default RulesPage;
