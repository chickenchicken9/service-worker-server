self.oninstall = event => {
    console.log('ServiceWorker oninstall:', event);
    self.skipWaiting();
    event.waitUntil(Promise.resolve());
};

let clientSource;
let handledPaths = [];
let fetchPromiseResolve;
self.onmessage = event => {
    console.log('ServiceWorker onmessage:', event);

    if (Array.isArray(event.data)) {
        // Update client & handled paths.
        clientSource = event.source;
        handledPaths = event.data;
    } else if (fetchPromiseResolve && typeof event.data === 'string') {
        fetchPromiseResolve(
            new Response(event.data, {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'text/html'
                }
            }));
        fetchPromiseResolve = undefined;
    } else {
        console.error('No way to handle message.');
    }
};

function pathHandled(path) {
    for (const pathRegex of handledPaths) {
        if (path.match(pathRegex)) return true;
    }
    return false;
}

self.onfetch = async event => {
    console.log('ServiceWorker onfetch:', event);

    if (!clientSource) return;

    const url = new URL(event.request.url);
    if (!pathHandled(url.pathname)) return;

    clientSource.postMessage(url.pathname);
    event.respondWith(new Promise(r => fetchPromiseResolve = r));
};
