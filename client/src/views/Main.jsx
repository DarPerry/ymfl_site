import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "../../public/vite.svg";

import styles from "./Main.module.scss";
import Tab from "../components/Tab/Tab.jsx";
import SliderSelect from "../components/SliderSelect/SliderSelect";
import classNames from "classnames";

const PlayerRow = ({ position, name, id, team, value }) => {
    return (
        <div className={styles.playerRow}>
            <div className={styles.left}>
                <div className={classNames(styles.position, styles[position])}>
                    {position}
                </div>
                <img
                    className={styles.image}
                    src="https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4362887.png&w=350&h=254"
                />
                <div className={styles.name}>{name}</div>
                <div className={styles.team}>({team || "-"})</div>
            </div>
            <div className={classNames(styles.right, !value && styles.noKeep)}>
                {value || "X"}
            </div>
        </div>
    );
};

const Main = () => {
    const [activeTab, setActiveTab] = useState("Rules");
    return (
        <>
            <div className={styles.title}>
                Your Mom's Favorite League Companion Site
            </div>
            <div className={styles.main}>
                <div className={styles.tabs}>
                    {["Rules", "Keeper Lottery"].map((label) => {
                        return (
                            <Tab
                                key={label}
                                label={label}
                                selected={activeTab === label}
                                onClick={() => setActiveTab(label)}
                            />
                        );
                    })}
                </div>
                <SliderSelect />
                <div>
                    <div className={styles.teamRow}>
                        <div className={styles.teamImage}></div>
                        <div className={styles.teamName}>FanDuel Fan Boys</div>
                    </div>
                </div>
                {[
                    {
                        name: "Keenan Allen",
                        value: 0,
                        playerId: "1479",
                        team: "LAC",
                        position: "WR",
                        id: "5f424505-f29f-433c-b3f2-1a143a04a010",
                        adr: 5,
                        adp: 44.5,
                    },
                    {
                        name: "Tom Brady",
                        value: 2,
                        playerId: "167",
                        team: null,
                        position: "QB",
                        id: "41c44740-d0f6-44ab-8347-3b5d515e5ecf",
                    },
                    {
                        name: "Dalvin Cook",
                        value: 0,
                        playerId: "4029",
                        team: "MIN",
                        position: "RB",
                        id: "8960d61e-433b-41ea-a7ad-4e76be87b582",
                        adr: 7,
                        adp: 67.5,
                    },
                    {
                        name: "Christian McCaffrey",
                        value: 0,
                        playerId: "4034",
                        team: "SF",
                        position: "RB",
                        id: "f96db0af-5e25-42d1-a07a-49b4e065b364",
                        adr: 1,
                        adp: 3,
                    },
                    {
                        name: "James Conner",
                        value: 1,
                        playerId: "4137",
                        team: "ARI",
                        position: "RB",
                        id: "28a084c0-14df-499f-bd1f-b975603626b7",
                        adr: 9,
                        adp: 83.5,
                    },
                    {
                        name: "Saquon Barkley",
                        value: 0,
                        playerId: "4866",
                        team: "NYG",
                        position: "RB",
                        id: "9811b753-347c-467a-b3cb-85937e71e2b9",
                        adr: 2,
                        adp: 15.5,
                    },
                    {
                        name: "Dallas Goedert",
                        value: 10,
                        playerId: "5022",
                        team: "PHI",
                        position: "TE",
                        id: "e8029983-87cf-49a2-bc04-04c8233a0630",
                        adr: 7,
                        adp: 65.5,
                    },
                    {
                        name: "Diontae Johnson",
                        value: 3,
                        playerId: "5937",
                        team: "PIT",
                        position: "WR",
                        id: "244c00c7-fe9a-4f4f-adff-1d5b9c8877e7",
                        adr: 8,
                        adp: 75,
                    },
                    {
                        name: "Tyler Bass",
                        value: "ADP + 1",
                        playerId: "7042",
                        team: "BUF",
                        position: "K",
                        id: "bfccbff4-bc01-41ed-aa11-be976160504c",
                    },
                    {
                        name: "Trevor Lawrence",
                        value: 8,
                        playerId: "7523",
                        team: "JAX",
                        position: "QB",
                        id: "aaa8b42c-4d87-45f6-bfd2-e31cfed9a736",
                        adr: 6,
                        adp: 59.5,
                    },
                    {
                        name: "Javonte Williams",
                        value: 2,
                        playerId: "7588",
                        team: "DEN",
                        position: "RB",
                        id: "889dcdc5-3d88-45df-9677-5ad7ff87c011",
                        adr: 10,
                        adp: 96.5,
                    },
                    {
                        name: "Rondale Moore",
                        value: "ADP + 1",
                        playerId: "7601",
                        team: "ARI",
                        position: "WR",
                        id: "975555d0-fe82-4e88-90f4-d690f5000671",
                        adr: 17,
                        adp: 167,
                    },
                    {
                        name: "Drake London",
                        value: 6,
                        playerId: "8112",
                        team: "ATL",
                        position: "WR",
                        id: "5053f9ae-15d9-4730-833d-484886b6f890",
                        adr: 5,
                        adp: 49,
                    },
                    {
                        name: "Rachaad White",
                        value: "ADP + 1",
                        playerId: "8136",
                        team: "TB",
                        position: "RB",
                        id: "4d3f2f57-215c-4cb4-bf75-a7ecdcdded70",
                        adr: 9,
                        adp: 80.5,
                    },
                    {
                        name: "Kenny Pickett",
                        value: "ADP + 1",
                        playerId: "8160",
                        team: "PIT",
                        position: "QB",
                        id: "ef7ae1f1-4ebe-4759-bbb3-32bd177ace08",
                        adr: 17,
                        adp: 168.5,
                    },
                    {
                        name: "San Francisco 49ers",
                        value: "ADP + 1",
                        playerId: "SF",
                        team: "SF",
                        position: "DEF",
                    },
                ].map((player) => (
                    <PlayerRow key={player.id} {...player} />
                ))}

                <div>
                    <a href="https://vitejs.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img
                            src={reactLogo}
                            className="logo react"
                            alt="React logo"
                        />
                    </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {1}
                    </button>
                    <p>
                        Edit <code>src/App.jsx</code> and save to test HMR
                    </p>
                </div>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
            </div>
        </>
    );
};

export default Main;
