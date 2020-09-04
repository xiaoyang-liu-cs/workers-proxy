let config = {
    basic: {
        upstream: 'https://en.wikipedia.org/',
        mobileRedirect: 'https://en.m.wikipedia.org/'
    },

    firewall: {
        blockedRegion: ['CN', 'KP', 'SY', 'PK', 'CU'],
        blockedIPAddress: [],
        scrapeShield: true
    },

    routes: {
        TW: 'https://zh.wikipedia.org/',
        HK: 'https://zh.wikipedia.org/',
        FR: 'https://fr.wikipedia.org/'
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