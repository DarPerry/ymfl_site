import axios from "axios";

//TODO: Fix Up

const getAvatar = async (avatarId, returnThumbnail) => {
    const thumbnailPath = returnThumbnail ? "thumbs/" : "";
    const { data } = await axios.get(
        `https://sleepercdn.com/${thumbnailPath}avatars/${avatarId}`
    );

    return data;
};
