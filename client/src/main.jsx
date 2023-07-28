import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import MobileApp from "./components/MobileApp/MobileApp.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <MobileApp />
        </BrowserRouter>
    </React.StrictMode>
);
