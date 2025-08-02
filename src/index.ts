import { Hono } from "hono";
import { serve } from "@hono/node-server";

export const runtime = "nodejs";

const app = new Hono();

const welcomeStrings = ["Hello Hono!", "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/hono"];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

export default app;

// For Node.js - start server sandbox
// Do not remove this, this is required for development
if (process.env.NODE_ENV === "production") {
  const port = 3000;
  console.log(`Server is running on http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
}
