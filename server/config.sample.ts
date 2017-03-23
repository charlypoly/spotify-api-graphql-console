const config = {
    server: {
        sessionSecret: '',
        port: 4000
    },
    spotify: {
        clientId: '',
        clientSecret: '',
        scopes: ['user-library-read','playlist-read-private','playlist-read-collaborative','user-read-private','user-read-email','user-follow-read','user-top-read'],
        redirectUri: ''
    }
};

export { config };