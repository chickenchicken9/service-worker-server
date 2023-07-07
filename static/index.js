const cm = CodeMirror(document.querySelector('#editor-codemirror'), {
    lineNumbers: true,
    tabSize: 2,
    value: localStorage.getItem("code") || '',
    mode: 'javascript',
    autofocus: true,
    theme: 'monokai'
});

function onChange(_, change) {
    localStorage.setItem("code", cm.getValue());
}

cm.on('change', onChange);

function id(i) { return document.getElementById(i); }

id('editor-run-button').onclick = () => {
    let output;
    try {
        output = eval?.(cm.getValue());
        id('logs-pre').innerHTML += `Page> ${output}\n`;
    } catch (err) {
        id('logs-pre').innerHTML += `Page> Error: ${err}\n`;
    }
};

const registerWorker = async () => {
    const registration = await navigator.serviceWorker.register("/worker.js", {
        scope: "/worker"
    });
    if (registration.installing) {
        console.log("Service worker installing");
    } else if (registration.waiting) {
        console.log("Service worker installed");
    } else if (registration.active) {
        console.log("Service worker active");
        registration.update();
    }
    console.log('worker registration:', registration);

    navigator.serviceWorker.addEventListener("message", (event) => {
        // event is a MessageEvent object
        console.log(`The service worker sent me a message: ${event.data}`);
        id('logs-pre').innerHTML += `Worker> ${event.data}\n`;
    });

    id('editor-worker-button').onclick = () => {
        registration.active.postMessage(cm.getValue());
    }
};
registerWorker();


const openDb = indexedDB.open('db', 5);
let db;
openDb.onsuccess = (event) => {
    console.log('opened db!');
    db = event.target.result;
};
openDb.onupgradeneeded = (event) => {
    console.log('creating object store');
    db = event.target.result;
    if (db.objectStoreNames.contains('store')) db.deleteObjectStore('store');
    db.createObjectStore('store', {keyPath: 'path'});
};

id('editor-db-button').onclick = () => {
    const result = run(cm.getValue());
    if (result.errors.length) throw Error(`Errors: ${result.errors}`);

    const transaction = db.transaction('store', 'readwrite');
    const store = transaction.objectStore('store');

    for (const [key, value] of Object.entries(result.globals)) {
        const path = key.match(/onPath([A-Z]\w+)/)?.[1]?.toLowerCase();
        if (path) {
            const req = store.put({path: `/worker/${path}`, fn: value.toString()});
            console.log(`Stored handler for /worker/${path}`);
        } 
    }
};
