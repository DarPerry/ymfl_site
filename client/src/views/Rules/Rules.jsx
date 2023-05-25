import styles from "./Rules.module.scss";

const copies = [
    {
        header: "Payouts & Rewards",
        children: [
            {
                title: "1st Place",
                body: "PI * 5",
            },
            {
                title: "2nd Place",
                body: "PI x 3",
            },
            {
                title: "Highest Regular Season",
                body: "PI * 2",
            },
            {
                title: "Last Place",
                body: "TODO: Punishment",
            },
            {
                title: "Pooper Bowl Winner",
                body: "Gets 1st round pick next year",
            },
        ],
    },
    {
        header: "Schedule",
        children: [
            {
                title: "Playoffs",
                body: "Playoffs will start Week 15",
            },
        ],
    },
    {
        header: "Voting",
        children: [
            {
                title: "Changing Rules",
                body: "Any league rule change needs a majority vote to pass. Anyone can propose any rule change.",
            },
            {
                title: "Vetoing Trades",
                body: "Majority vote is still needed, but excludes managers involved in trade are exclude from the counting.",
            },
        ],
    },
    {
        header: "Keeping Players",
        children: [
            {
                title: "Keeper Lottery",
                body: "Majority vote is still needed, but excludes managers involved in trade are exclude from the counting.",
            },
            {
                title: "High Picks Lottery",
                body: "A player picked in the 1st 2 rounds of the previous year can not be kept                ",
            },
            {
                title: "Max Amount Lottery",
                body: "You can keep up to 3 players on your team every year",
            },
            {
                title: "Calulcating",
                body: "All keeper price calculations will go off of most recent ‘Player History’ transaction",
            },
            {
                title: "ADP Calculations",
                body: "All ADP values used for calculations can be found here.",
            },
            {
                title: "Deadline",
                body: "Keepers lock in 24 Hours before draft start",
            },
            {
                title: "Paying for Keepers",
                body: "Values are minimum round picks that need to be given up. A higher pick can be opted if owner wished",
            },
            {
                title: "Keeper Prices",
                body: "Majority vote is still needed, but excludes managers involved in trade are exclude from the counting.",
            },
        ],
    },
    {
        header: "New Rule Proposals",
        children: [
            {
                title: "2 Week Championship",
                body: "Any league rule change needs a majority vote to pass. Anyone can propose any rule change.",
            },
            {
                title: "-2 For Pick Sixes",
                body: "Majority vote is still needed, but excludes managers involved in trade are exclude from the counting.",
            },
            {
                title: ".1 Point for each yard of field goals",
                body: "Majority vote is still needed, but excludes managers involved in trade are exclude from the counting.",
            },
            {
                title: "Incorporate Win bonus ( ie. each win, loser pays you $10)",
                body: "Weekly rewards for highest scoring team or reward team with highest scoring player",
            },
            {
                title: "More TEs",
                body: "Make 2 starting TEs in roster",
            },
        ],
    },
];

const Section = ({ header, children }) => {
    return (
        <div className={styles.section}>
            <div className={styles.title}>{header}</div>
            {children.map(({ title, body }) => (
                <>
                    <div className={styles.header}>{title}</div>
                    <div className={styles.body}>{body}</div>
                </>
            ))}
        </div>
    );
};

const Rules = () => {
    return <div className={styles.rules}>{copies.map(Section)}</div>;
};

export default Rules;
