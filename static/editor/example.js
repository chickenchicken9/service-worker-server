export const paths = [/.*\/worker\/hello/];

export function handle(req) {
  console.log('hello from module!', req);
  return {
    body:
      `
<h3>
      This came from example.js! let's update it
</h3>
<h1>
  what up!
</h1>
		`,
    status: 200,
    statusText: 'OK',
    headers: { 'Content-Type': 'text/html' }
  };
}