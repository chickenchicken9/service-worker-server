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

(async () => {
    const registration = await navigator.serviceWorker.register("simple_worker.js");
    console.log('Registering simple_worker.js:', registration);

    navigator.serviceWorker.onmessage = event => {
        id('logs-pre').innerHTML += `Worker> ${event.data}\n`;
        registration.active.postMessage(`
            <html>
            <h1>This came from the browser page!</h1>
            </html>
        `);
    };

    id('editor-worker-button').onclick = () => {
        registration.active.postMessage(['/worker/hello']);
    }
})();
