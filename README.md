# Building APIs with Hono

You are building an API with Hono and Firebase.

You can import auth and db from `src/integrations/firebase.server.ts`

You will always validate data using zod: you will create them here `src/schemas/index.ts`

```
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
```

## How to build routes

You will create one file per route in `src/routes/`

```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.post("/users", zValidator("json", createUserSchema), (c) => {
  const data = c.req.valid("json");
  return c.json({ success: true, user: data });
});

export default app;
```

You will connect routes in `src/index.ts`:

```ts
import { Hono } from "hono";
import userRoutes from "./routes/users";

const app = new Hono();
app.route("/users", userRoutes);
export default app;
```

## Error handling

You will use the custom Error class: `src/errors/APIError.js`

```ts
import APIError from "@/src/errors/APIError.js";

// Throw errors like this:
throw new APIError("User not found", 404);

// Handle errors like this:
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Something went wrong" }, 500);
});
```

## Security

You will add these middlewares:

```ts
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";

app.use("*", logger());
app.use("*", cors({ origin: "*" }));
app.use("*", secureHeaders());
```

## Importing firebase

```ts
import { db, admin, auth } from "@/src/integrations/firebase.server.ts";
```

You can import anything in the src dir by using `@`

```
"paths": {
    "@/*": ["./src/*"]
}
```

## Simple rules:

- Always validate data with zod
- Always use the APIError class
- Create one file per route
- Always handle errors
- Always add security headers
- Keep it simple
