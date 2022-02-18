export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // If there is no cookie, this is a new client. Choose a group and set the cookie.
  const group = Math.random() < 0.5 ? "test" : "control"; // 50/50 split
  if (group === "control") {
    url.pathname = "/control";
  } else {
    url.pathname = "/test";
  }
  // Reconstruct response to avoid immutability
  let res = await fetch(url);
  res = new Response(res.body, res);

  return res;
}

export class ABVariantSwitch {
  constructor(state, env) {
    this.state = state;
  }

  // Handle HTTP requests from clients.
  async fetch(request) {
    // Durable Object storage is automatically cached in-memory, so reading the
    // same key every request is fast. (That said, you could also store the
    // value in a class member if you prefer.)
    let variant = (await this.state.storage.get("variant")) || 0;

    switch (variant) {
      case "control":
        variant = "test";
        break;
      case "test":
        variant = "control";
        break;
      default:
        variant = "control";
    }

    // We don't have to worry about a concurrent request having modified the
    // value in storage because "input gates" will automatically protect against
    // unwanted concurrency. So, read-modify-write is safe. For more details,
    // see: https://blog.cloudflare.com/durable-objects-easy-fast-correct-choose-three/
    await this.state.storage.put("variant", variant);

    return new Response(variant);
  }
}
