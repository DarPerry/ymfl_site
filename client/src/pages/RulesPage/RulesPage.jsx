import classNames from "classnames";
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

const NewBadge = ({ isNew, isUpdated }) => {
    return <div className={styles.newBadge}>{isNew ? "NEW" : "UPDATE"}</div>;
};

const RulesList = ({ header, children, showDivider }) => {
    return (
        <div className={classNames(showDivider && styles.divided)}>
            {header && <div className={styles.listHeader}>{header}</div>}
            <ul className={styles.list}>{children}</ul>
        </div>
    );
};

const RulesDivider = () => {
    return <div className={styles.divider} />;
};

const RulesListItem = ({ text, bolded, isNew, isUpdated }) => {
    return (
        <li className={styles.listItem}>
            {(isNew || isUpdated) && <NewBadge isNew isUpdated />}
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
                <RulesList header="Passing" showDivider>
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
                <RulesList header="Rushing" showDivider>
                    <RulesListItem
                        text={"Rushing Yards"}
                        bolded={"0.1 per Yard / 1 per 10 Yards"}
                    />
                    <RulesListItem text={"Rushing TD"} bolded={6} />
                    <RulesListItem text={"2-PT Conversion"} bolded={2} />
                    <RulesListItem text={"Rush Attempts"} bolded={0.1} isNew />
                    <RulesListItem
                        text={"40+ Yard TD Bonus"}
                        bolded={2}
                        isNew
                    />
                </RulesList>
                <RulesList header="Receiving">
                    <RulesListItem
                        text={"Receiving Yards"}
                        bolded={"0.1 per Yard / 1 per 10 Yards"}
                    />
                    <RulesListItem text={"Receiving TD"} bolded={6} />
                    <RulesListItem text={"2-PT Conversion"} bolded={2} />
                    <RulesListItem text={"Reception"} bolded={0.5} isUpdated />
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
