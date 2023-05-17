import axios from "axios";

import { DOMAIN } from "../config/sleeperAPI.config.js";

export const getUser = async (userNameOrId) => {};

export const fetchFromSleeperEndpoint = async (endpoint) => {
    const { data } = await axios.get(`${DOMAIN}${endpoint}`);

    return data;
};
