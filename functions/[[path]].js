const NAME = "myExampleWorkersABTest";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  return fetch(url);
}

addEventListener("fetch", (e) => {
  e.respondWith(onRequest({ request: e.request }));
});
