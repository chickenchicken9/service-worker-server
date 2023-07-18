let client;
let handledPaths = [];
let fetchResolves = [];

function log(...args) {
    if (!client) return;

    client.postMessage(args.map(a => a.toString()));
}

const l = console.log;
console.log = (...args) => {
    log(...args);
    l.apply(console, args);
}
const e = console.error;
console.error = (...args) => {
    log(['Error!', ...args]);
    e.apply(console, args);
}

self.oninstall = event => {
    console.log('ServiceWorker oninstall:', event);
    self.skipWaiting();
    event.waitUntil(Promise.resolve());
};

self.onmessage = event => {
    console.log('ServiceWorker onmessage data:', event.data);

    if (event.data?.[0] instanceof RegExp) {
        // Update client & handled paths.
        client = event.source;
        handledPaths = event.data;
    } else if (fetchResolves[0]) {
        fetchResolves.shift()(new Response(event.data.body, event.data));
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

    client.postMessage({url: event.request.url});
    event.respondWith(new Promise(r => fetchResolves.push(r)));
};
