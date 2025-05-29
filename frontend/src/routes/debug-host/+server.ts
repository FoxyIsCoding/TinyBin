// src/routes/debug-host/+server.ts
export const GET = ({ request }) => {
    return new Response(`Host: ${request.headers.get('host')}`);
  };
  