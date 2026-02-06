Extending the Loader with Middleware

**What:**

- A way to register functions that run after the loader parses HTML but before it returns
- Each function receives context (url, parsed document, target selector)
- Functions can observe, modify, or trigger side effects based on the fetched content

**Why:**

- Keeps the loader focused on one job: fetch and parse
- Avoids importing feature-specific code (like hungry elements) into the loader
- New behaviors can be added from separate modules without touching loader.ts
- All fetched content flows through one place — a natural extension point
- Enables patterns like `pe-hungry` without the layer system needing to know about refreshing

**The pattern:**

- Interceptor/middleware chain — common in HTTP clients, build tools, and frameworks
- Register once, runs on every load
- Decoupled: the loader doesn't know what the middleware does, middleware doesn't know about each other
