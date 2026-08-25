const BACKEND_ORIGIN = (
  process.env.BACKEND_API_ORIGIN ||
  process.env.PRODUC_URI ||
  process.env.NEXT_PUBLIC_BACKEND_API ||
  ""
).replace(/\/+$/, "");

const STORE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://organicheritage.store";
const TOKEN_HEADER = "X-API-Access-Token";

const hopByHopHeaders = [
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

const proxiedRequestHeaders = (request) => {
  const headers = new Headers();

  for (const name of ["accept", "authorization", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  headers.set("Origin", STORE_ORIGIN);

  if (process.env.API_ACCESS_TOKEN) {
    headers.set(TOKEN_HEADER, process.env.API_ACCESS_TOKEN);
  }

  return headers;
};

const proxiedResponseHeaders = (response) => {
  const headers = new Headers(response.headers);
  for (const name of hopByHopHeaders) headers.delete(name);
  return headers;
};

const targetUrl = async (request, params) => {
  if (!BACKEND_ORIGIN) {
    throw new Error("BACKEND_API_ORIGIN or PRODUC_URI is not configured");
  }

  const { path = [] } = await params;
  const sourceUrl = new URL(request.url);
  const apiPath = path.map((part) => encodeURIComponent(part)).join("/");
  return `${BACKEND_ORIGIN}/api/${apiPath}${sourceUrl.search}`;
};

const proxy = async (request, context) => {
  try {
    const method = request.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);
    const response = await fetch(await targetUrl(request, context.params), {
      method,
      headers: proxiedRequestHeaders(request),
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: proxiedResponseHeaders(response),
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return Response.json(
      { status: "error", message: "API proxy unavailable" },
      { status: 502 }
    );
  }
};

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

export const OPTIONS = () => new Response(null, { status: 204 });
