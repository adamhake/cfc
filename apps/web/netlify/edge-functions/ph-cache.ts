import type { Config, Context } from "@netlify/edge-functions";

export default async (_request: Request, context: Context) => {
  const response = await context.next();
  response.headers.set(
    "Cache-Control",
    "public, max-age=31536000, immutable",
  );
  return response;
};

export const config: Config = {
  path: "/ph/static/*",
};
