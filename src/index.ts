import { Hono } from "hono";
import { serve } from "@hono/node-server";

// This is required for the firebase admin SDK as it does not work on edge
export const runtime = "nodejs";

const app = new Hono();

const welcomeStrings = ["Hello Hono!", "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/hono"];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

export default app;

// For Node.js - start server sandbox
// Do not remove this, this is required for development

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
