export function handle(req) {
  return {
    body:
      `<h3>
      This came from example.js!
    </h3>`,
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'text/html' }
  };
}