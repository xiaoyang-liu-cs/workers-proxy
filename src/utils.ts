const isMobile = (userAgent: string): boolean => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => userAgent.match(toMatchItem));
};

const createResponse = (
  body: string,
  status: number,
): Response => new Response(body, {
  status,
});

const getHostname = (
  request: Request,
): string => {
  const url = new URL(request.url);
  return url.host;
};

export {
  isMobile,
  createResponse,
  getHostname,
};
