import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "../../public/vite.svg";

import styles from "./Main.module.scss";
import Tab from "../components/Tab/Tab.jsx";
import SliderSelect from "../components/SliderSelect/SliderSelect";

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
