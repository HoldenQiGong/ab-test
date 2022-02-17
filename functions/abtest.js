const NAME = "myExampleWorkersABTest";

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
  // Set cookie to enable persistent A/B sessions.
  // res.headers.append("Set-Cookie", `${NAME}=${group}; path=/`);
}

// addEventListener("fetch", (e) => {
//   e.respondWith(onRequest({ request: e.request }));
// });
