let config = {
    basic: {
        upstream: 'https://www.google.com/',
        mobileRedirect: 'https://www.google.com/'
    },

    firewall: {
        blockedRegion: ['CN', 'KP', 'SY', 'PK', 'CU'],
        blockedIPAddress: ['0.0.0.0', '127.0.0.1'],
        scrapeShield: true
    },

    routes: {
        'CA': 'https://www.google.ca/',
        'HK': 'https://www.google.com.hk/'
    },

    optimization: {
        mirage: true,
        polish: 'off',
        minify: {
            'javascript': true,
            'css': true,
            'html': true
        },
        cacheEverything: false
    }
}

addEventListener('fetch', event => {
    event.respondWith(fetchAndApply(event.request));
})

async function fetchAndApply(request) {
    const region = request.headers.get('cf-ipcountry');
    const ipAddress = request.headers.get('cf-connecting-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    if (config.firewall.blockedRegion.includes(region)) {
        return new Response('Access denied: booster.js is not available in your region.', {
            status: 403
        });
    } else if (config.firewall.blockedRegion.includes(ipAddress)) {
        return new Response('Access denied: Your IP address is blocked by booster.js.', {
            status: 403
        });
    }

    let requestUrl = new Url(request.url);
    let upstream;

    if (isMobile(userAgent)) {
        upstream = new Url(config.basic.mobileRedirect);
    } else {
        upstream = new Url(config.basic.upstream);
    }

    if (requestUrl.pathname !== '/') {
        upstream.pathname += requestUrl.pathname;
    }

    let requestMethod = request.method;
    
    //     let method = request.method;
    //     let request_headers = request.headers;
    //     let new_request_headers = new Headers(request_headers);

    //     new_request_headers.set('Host', upstream_domain);
    //     new_request_headers.set('Referer', url.protocol + '//' + url_hostname);

    //     let original_response = await fetch(url.href, {
    //         method: method,
    //         headers: new_request_headers,
    //         body: request.body
    //     })

    //     connection_upgrade = new_request_headers.get("Upgrade");
    //     if (connection_upgrade && connection_upgrade.toLowerCase() == "websocket") {
    //         return original_response;
    //     }

    //     let original_response_clone = original_response.clone();
    //     let original_text = null;
    //     let response_headers = original_response.headers;
    //     let new_response_headers = new Headers(response_headers);
    //     let status = original_response.status;
		
	// 	if (disable_cache) {
	// 		new_response_headers.set('Cache-Control', 'no-store');
	//     }

    //     new_response_headers.set('access-control-allow-origin', '*');
    //     new_response_headers.set('access-control-allow-credentials', true);
    //     new_response_headers.delete('content-security-policy');
    //     new_response_headers.delete('content-security-policy-report-only');
    //     new_response_headers.delete('clear-site-data');
		
	// 	if (new_response_headers.get("x-pjax-url")) {
    //         new_response_headers.set("x-pjax-url", response_headers.get("x-pjax-url").replace("//" + upstream_domain, "//" + url_hostname));
    //     }
		
    //     const content_type = new_response_headers.get('content-type');
    //     if (content_type != null && content_type.includes('text/html') && content_type.includes('UTF-8')) {
    //         original_text = await replace_response_text(original_response_clone, upstream_domain, url_hostname);
    //     } else {
    //         original_text = original_response_clone.body
    //     }
		
    //     response = new Response(original_text, {
    //         status,
    //         headers: new_response_headers
    //     })
    // }
    // return response;
}

async function replace_response_text(response, upstream_domain, host_name) {
    let text = await response.text()

    var i, j;
    for (i in replace_dict) {
        j = replace_dict[i]
        if (i == '$upstream') {
            i = upstream_domain
        } else if (i == '$custom_domain') {
            i = host_name
        }

        if (j == '$upstream') {
            j = upstream_domain
        } else if (j == '$custom_domain') {
            j = host_name
        }

        let re = new RegExp(i, 'g')
        text = text.replace(re, j);
    }
    return text;
}


async function isMobile(userAgent) {
    var agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    for (let agent of agents) {
        if (userAgent.indexOf(agent) > 0) {
            return true;
        }
    }
    return false;
}
