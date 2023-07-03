import { fetchFromSleeperEndpoint } from "../util/api.util.js";

const getUser = async (userNameOrId) =>
    await fetchFromSleeperEndpoint(`/user/${userNameOrId}`);
