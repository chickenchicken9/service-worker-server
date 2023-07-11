self.oninstall = event => {
    console.log('ServiceWorker oninstall:', event);
    self.skipWaiting();
    event.waitUntil(Promise.resolve());
};

let client;
let handledPaths = [];
let fetchResolves = [];
self.onmessage = event => {
    console.log('ServiceWorker onmessage data:', event.data);

    if (event.data?.[0] instanceof RegExp) {
        // Update client & handled paths.
        client = event.source;
        handledPaths = event.data;
    } else if (fetchResolves[0] && typeof event.data === 'string') {
        fetchResolves.shift()(
            new Response(event.data, {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'text/html'
                }
            }));
    } else {
        console.error('No way to handle message.');
    }
};

const IGNORE_REGEX = /.*\/editor\/.*/;
function pathHandled(path) {
    if (path.match(IGNORE_REGEX)) return false;

    for (const pathRegex of handledPaths) {
        if (path.match(pathRegex)) return true;
    }
    return false;
}

self.onfetch = async event => {
    console.log('ServiceWorker onfetch:', event);

    if (!client) return;

    const url = new URL(event.request.url);
    if (!pathHandled(url.pathname)) return;

    client.postMessage(url.pathname);
    event.respondWith(new Promise(r => fetchResolves.push(r)));
};
