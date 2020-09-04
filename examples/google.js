let config = {
    basic: {
        upstream: 'https://www.google.com/',
        mobileRedirect: 'https://www.google.com/'
    },

    firewall: {
        blockedRegion: ['CN', 'KP', 'SY', 'PK', 'CU'],
        blockedIPAddress: [],
        scrapeShield: true
    },

    routes: {
        CA: 'https://www.google.ca/',
        FR: 'https://www.google.fr/'
    },

    optimization: {
        cacheEverything: false,
        cacheTtl: 5,
        mirage: true,
        polish: 'off',
        minify: {
            javascript: true,
            css: true,
            html: true
        }
    }
}