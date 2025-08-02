You are building an API with the Admin Firebase SDK

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

When adding more routes, you will create a single file per route url.

You will use a custom Error class like a pro developer would: `src/errors/APIError.js`

## Importing firebase

import { db, admin } from "@/src/integrations/firebase.server.ts"

You can import anything in the src dir by using `@`

```
"paths": {
    "@/*": ["./src/*"]
}

```
