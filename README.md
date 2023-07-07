# service-worker-server

## Run Locally

To run (using Python 3):

```sh
echo 'Launching server at http://worker-server.localhost:8000/.'
python3 -m http.server 8000 --directory static
```

And then visit http://worker-server.localhost:8000/. The subdomain avoids any interactions between other workers you run on localhost - you can use any.

## Usage

