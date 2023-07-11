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

let serverModule;
(async () => {
    const registration = await navigator.serviceWorker.register("../worker.js", {scope: '/'});
    console.log('Registering worker.js:', registration);

    navigator.serviceWorker.onmessage = event => {
        id('logs-pre').innerHTML += `Worker> ${event.data}\n`;
        if (serverModule) {
            registration.active.postMessage(serverModule.handle(event.data));
        } else {
            console.error('No serverModule loaded.');
        }
    };

    id('editor-worker-button').onclick = () => {
        registration.active.postMessage([/.*\/worker\/hello/]);
        const encodedJs = encodeURIComponent(cm.getValue());
        const dataUri = `data:text/javascript;charset=utf-8,${encodedJs}`;
        import(dataUri).then(m => serverModule = m);
    };
})();
