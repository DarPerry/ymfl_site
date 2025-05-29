import styles from "./MobileApp.module.scss";

import { useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import Header from "../Header/Header";
import KeeperPricesPage from "../../pages/KeeperPrices.page";
import RulesPage from "../../pages/RulesPage/RulesPage";

const MobileApp = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const response = await fetch("http://localhost:1739/");
            const data = await response.json();
            setData(data);
        };

        getData();
    }, []);

    console.log(1, data);

    return (
        <div className={styles.mobileApp}>
            <Header />
            <Routes>
                <Route path="/" element={<KeeperPricesPage data={data} />} />
                <Route
                    index
                    path="keeperPrices"
                    element={<KeeperPricesPage data={data} />}
                />
                <Route path="rules" element={<RulesPage />} />
            </Routes>
            <Outlet />
        </div>
    );
};

export default MobileApp;
