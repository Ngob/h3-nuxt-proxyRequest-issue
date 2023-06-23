import {
  defineEventHandler,
  H3Event,
  RequestHeaders,
  getMethod,
  getRequestHeaders,
  sendProxy as _sendProxy,
} from 'h3';
export default defineEventHandler(async (event: H3Event) => {
  console.log('defineEventHandler');
  const API_URL = 'http://localhost:3000/';
  const target = new URL(('backend' + event.req.url) as string, API_URL);
  console.log(target.toString());

  const ret = await proxyRequest(event, target.toString(), {
    headers: {
      host: target.host,
    },
    sendStream: true,
    fetchOptions: {
      redirect: 'manual',
    },
  });
  return ret;
});
