# Camelmailer with Express

This example shows how to use [Camelmailer](https://camelmailer.com) with [Express](https://expressjs.com) and TypeScript: a `POST /send` endpoint that sends an email through the [@camelmailer/sdk](https://www.npmjs.com/package/@camelmailer/sdk) SDK.

## Prerequisites

- Node.js 20+
- A Camelmailer server API key (dashboard → your server → **Credentials** → new credential of type **API**)

## Instructions

1. Install dependencies:

   ```sh
   npm install
   ```


2. Set your environment:

   ```sh
   export CAMELMAILER_API_KEY="cm_xxxx"
   # Self-hosted instance? Point the SDK at it (defaults to https://app.camelmailer.com):
   export CAMELMAILER_BASE_URL="https://mail.example.com"
   export CAMELMAILER_FROM="you@yourdomain.com"
   ```

3. Start the server:

   ```sh
   npm run dev
   ```

4. Send an email:

   ```sh
   curl -X POST http://localhost:3000/send \
     -H 'Content-Type: application/json' \
     -d '{"to": "delivered@example.com", "subject": "Hello from Express", "html": "<strong>It works!</strong>"}'
   ```

   Response: `{"message_id": 42}` — API errors come back as `{"error": "<code>", "message": "…"}` with the upstream status code.

## Tests

The endpoint is covered by a small [supertest](https://github.com/ladjs/supertest) suite with a mocked SDK — no network, no API key needed:

```sh
npm test
```

## License

MIT License
