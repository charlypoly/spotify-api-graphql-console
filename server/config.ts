const config = {
    server: {
        sessionSecret: process.env.SESSION_SECRET,
        port: process.env.PORT,
        mountPath: process.env.MOUNT_PATH
    },
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        scopes: ['user-library-read', 'playlist-read-private', 'playlist-read-collaborative', 'user-read-private', 'user-read-email', 'user-follow-read', 'user-top-read', 'user-read-playback-state'],
        redirectUri: process.env.SPOTIFY_REDIRECT_URI
    }
};

export { config };