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

function log(source, ...args) {
    const text = `<b>${source}</b> > ${args.map(x => (x || '').toString()).join('\t')}<br>`;
    id('logs-div').innerHTML += text;
}

const l = console.log;
console.log = (...args) => {
    log('Page', ...args);
    l.apply(console, args);
}

const e = console.error;
console.error = (...args) => {
    log('Page', 'Error!', ...args);
    e.apply(console, args);
}

let serverModule;
id('editor-worker-button').onclick = async () => {
    let registration = await navigator.serviceWorker.getRegistration();
    if (registration) await registration.unregister();
    registration = await navigator.serviceWorker.register("../worker.js");
    console.log('installing?', registration.installing);
    console.log('active?', registration.active);

    const encodedJs = encodeURIComponent(cm.getValue());
    const dataUri = `data:text/javascript;charset=utf-8,${encodedJs}`;
    serverModule = await import(dataUri);

    (registration.installing || registration.active).postMessage(serverModule.paths);
};

navigator.serviceWorker.onmessage = async event => {
    log('Worker', event.data);
    if (event.data?.url) {
        if (serverModule) {
            const response = await serverModule.handle(event.data);
            event.source.postMessage(response);
        } else {
            console.error('Request received via worker, but no serverModule loaded.');
        }
    }
};

id('editor-example-button').onclick = async () => {
    const res = await fetch('example.js');
    cm.setValue(await res.text());
};