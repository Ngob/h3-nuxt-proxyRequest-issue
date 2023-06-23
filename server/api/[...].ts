import {
  defineEventHandler,
  H3Event,
  RequestHeaders,
  getMethod,
  getRequestHeaders,
  sendProxy as _sendProxy,
} from 'h3';

/**
 * This code override proxyRequest from h3
 */

/**
 * start - this code is not exported from h3
 */
export interface ProxyOptions {
  headers?: RequestHeaders | HeadersInit;
  fetchOptions?: RequestInit;
  fetch?: typeof fetch;
  sendStream?: boolean;
  cookieDomainRewrite?: string | Record<string, string>;
  cookiePathRewrite?: string | Record<string, string>;
  onResponse?: (event: H3Event, response: Response) => void;
}

const ignoredHeaders = new Set([
  'transfer-encoding',
  'connection',
  'keep-alive',
  'upgrade',
  'expect',
  'host',
]);

export function getProxyRequestHeaders(event: H3Event) {
  const headers = Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  // eslint-disable-next-line no-restricted-syntax
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name)) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}

/**
 * end - this code is not exported from h3
 */

/**
 * This code override h3 default behavior:
 * Instead of reading the body we send the body as the stream, allowing better memory usage + prevent utf8 decoding
 * */
async function proxyRequest(
  event: H3Event,
  target: string,
  opts: ProxyOptions = {}
) {
  const method = getMethod(event);

  // Headers
  const headers = getProxyRequestHeaders(event);
  if (opts.fetchOptions?.headers) {
    Object.assign(headers, opts.fetchOptions.headers);
  }
  if (opts.headers) {
    Object.assign(headers, opts.headers);
  }
  return _sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      headers,
      method,
      body: method !== 'GET' && method !== 'HEAD' ? event.node.req : undefined,
      ...opts.fetchOptions,
    } as RequestInit,
  });
}
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
