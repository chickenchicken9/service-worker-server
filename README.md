# service-worker-server

## Warning

This project uses [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval). Do not use it for anything real.

## Run Locally

To run (using Python 3):

```sh
python3 -m http.server 8000 --directory static
```

And then visit http://sws.localhost:8000/. The subdomain avoids any interactions between other workers you run on localhost - you can use any subdomain you want.

## Usage

Enter some module JS in the editor and hit a button to run it (with `eval()`) either locally or in the installed service worker. Or hit `Load example` to get a quick working example. The module must export two values:

 - `paths`: An array of regular expressions with the paths for your server to handle. If your site is being served in a subpath, like with GitHub Pages, you'll want to start with a wildcard. Example:
    ```js
    export const paths = [/.*\/worker\/hello/];
    ```
 - `handle(req)`: A function that a request object and returns a response object with a `body`, `status`, `statusText`, and/or `headers`. Example:
    ```js
    export function handle(req) {
        console.log('hello from module!', req);
        return {
            body: `<h1>what up!</h1>`,
            status: 200,
            statusText: 'OK',
            headers: { 'Content-Type': 'text/html' }
        };
    }
    ```

Then, hit `Run worker`, and visit a handled path (from the example: http://sws.localhost:8000/worker/hello).