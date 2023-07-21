export const paths = [/.*\/worker\/hello/];

export function handle(request) {
  console.log('hello from module!', request);
  return {
    body:
      `
      <h1>Hello, world!</h1>
      <h3>Request:</h3>
      <pre>${JSON.stringify(request)}</pre>
		`,
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'text/html' }
  };
}