import { fetchFromSleeperEndpoint } from "../util/api.util.js";

export const getUser = async (userNameOrId) =>
    await fetchFromSleeperEndpoint(`/user/${userNameOrId}`);
