# service-worker-server

## Warning

This project uses [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval). Do not use it for anything real.

## Run Locally

To run (using Python 3):

```sh
echo 'Launching server at http://worker-server.localhost:8000/.'
python3 -m http.server 8000 --directory static
```

And then visit http://worker-server.localhost:8000/. The subdomain avoids any interactions between other workers you run on localhost - you can use any.

## Usage

Enter some JS in the editor and hit a button to run it (with `eval()`) either locally or in the installed service worker. 

TODO: Introduce a more standard server API.

To serve pages via the service worker:

1. Create functions in the global context starting with `onPathXyz`, e.g.:
  
   ```js
    var onPathXyz = () => {
        console.log('hello from worker! open your dev console to see this message.')
        return '<html><h1>whatup?</h1></html>';
    };
   ```

2. Hit `Put in DB`.
3. Visit `/worker/xyz` (http://worker-server.localhost:8000/worker/xyz).

TIP: The path just needs to end with `.../worker/xyz`, so this works on subdirectories like GitHub Pages.