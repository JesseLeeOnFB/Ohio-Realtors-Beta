addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(req){
  const url = new URL(req.url);

  if(url.pathname === '/login'){
    return Response.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://ohio-realtors-beta.pages.dev&response_type=code&scope=openid email profile`,
      302
    );
  }

  return new Response('Not found', {status:404});
}
