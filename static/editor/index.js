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
    id('logs-pre').innerHTML += `${source}> ${args.map(x => (x || '').toString()).join('\t')}\n`;
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
(async () => {
    // const registration = await navigator.serviceWorker.register("../worker.js", {scope: '/'});
    // console.log('Registering worker.js:', registration);

    // navigator.serviceWorker.onmessage = async event => {
    //     log('Worker', event.data);
    //     if (event.data?.url) {
    //         if (serverModule) {
    //             const response = await serverModule.handle(event.data);
    //             registration.active.postMessage(response);
    //         } else {
    //             console.error('Request received via worker, but no serverModule loaded.');
    //         }
    //     }
    // };

    // id('editor-worker-button').onclick = () => {
    //     if (!registration.active) {
    //         console.error('No active worker registration.');
    //         return;
    //     }

    //     registration.active.postMessage([/.*\/worker\/hello/]);
    //     const encodedJs = encodeURIComponent(cm.getValue());
    //     const dataUri = `data:text/javascript;charset=utf-8,${encodedJs}`;
    //     import(dataUri).then(m => serverModule = m);
    // };
})();

id('editor-worker-button').onclick = async () => {
    let registration = await navigator.serviceWorker.getRegistration();
    if (registration) await registration.unregister();
    registration = await navigator.serviceWorker.register("../worker.js", {scope: '/'});
    console.log('installing?', registration.installing);
    console.log('active?', registration.active);

    (registration.installing || registration.active).postMessage([/.*\/worker\/hello/]);
    const encodedJs = encodeURIComponent(cm.getValue());
    const dataUri = `data:text/javascript;charset=utf-8,${encodedJs}`;
    import(dataUri).then(m => serverModule = m);
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