const NAME = "myExampleWorkersABTest";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  return fetch(request);
}
