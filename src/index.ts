import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
// import commentsRoute from "./routes/comments";
import APIError from "./errors/APIError.js";
import { db, admin, auth } from "./integrations/firebase.server.js";

// This is required for the firebase admin SDK as it does not work on edge
export const runtime = "nodejs";

const app = new Hono();

// Security middlewares
app.use("*", logger());
app.use("*", cors({ origin: "*" }));
app.use("*", secureHeaders());

// Error handling
app.onError((err, c) => {
  console.error(err);

  if (err instanceof APIError) {
    return c.json({ error: err.message }, err.statusCode);
  }

  return c.json({ error: "Something went wrong" }, 500);
});

const welcomeStrings = ["Hello Hono!", "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/hono"];

app.get("/", async (c) => {
  const ref = db.collection("comments");
  const snapshot = await ref.get();

  if (snapshot.empty) {
    return c.json({ message: "No comments found" }, 200);
  }

  const comments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return c.json(comments, 200);
  return c.text(welcomeStrings.join("\n\n"));
});

app.get("/config", async (c) => {
  const ref = db.collection("config").doc("config");
  const snapshot = await ref.get();

  if (!snapshot.exists) {
    return c.json({ message: "No config found" }, 200);
  }

  const config = snapshot.data();

  return c.json(config, 200);
});

// app.get("/contact", (c) => {
//   return c.text("Contact");
// });

// app.get("/shop/:productId", (c) => {
//   return c.text("Shop");
// });

// app.get("/blog", (c) => {
//   return c.text("Blog");
// });

console.log(process.env.NODE_ENV);

export default app;

// For Node.js - start server sandbox
// Do not remove this, this is required for development

if (process.env.NODE_ENV === "development") {
  const port = 3000;
  console.log(`Server is running on http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
}
