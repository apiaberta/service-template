# API Aberta — Service Template

Starting point for a new API Aberta data service (connector). Follow the [service guidelines](https://github.com/apiaberta/apiaberta/blob/main/docs/service-guidelines.md).

## Quick start

```bash
git clone https://github.com/apiaberta/service-template.git connector-my-source
cd connector-my-source
npm install
cp .env.example .env
npm run dev
npm test
```

Requires Node.js 22+ and MongoDB 7+.

## What to change

1. `src/app.js` — set `SERVICE_NAME` (lowercase, e.g. `fuel`) and the `/meta` fields (`source`, `description`, `update_frequency`).
2. `src/connector.js` — fetch from the government source, normalise to English `snake_case`, upsert into MongoDB.
3. `src/routes/data.js` — your public data routes (replace the `/items` example).
4. `.env.example`, `Dockerfile` (`EXPOSE`), `package.json` name, and this README.

Search for `TODO` to find every spot.

## Routing convention (important)

Consumers call the gateway at `https://api.apiaberta.pt/v1/<service>/...`. The gateway **strips the leading `/v1`** and forwards `/<service>/...` to your service. So:

| Public URL (gateway) | Your service receives |
|----------------------|-----------------------|
| `/v1/<service>/items` | `/<service>/items` |
| `/v1/<service>/meta` | `/<service>/meta` |
| — (status probe) | `/health` |

Register data routes and `/meta` under `/<service>`, and `/health` at the root. Do not register routes under `/v1` in the service — they will not be reachable.

## Mandatory endpoints

- `GET /health` → `{ "status": "ok", "service": "...", "timestamp": "..." }`
- `GET /<service>/meta` → `{ service, source, description, last_updated, record_count, update_frequency }`

## Rules (short version)

- Envelope: lists `{ meta: { page, limit, total, pages }, data: [...] }`, single `{ data: {...} }`.
- Field names English `snake_case`, dates ISO 8601, prices in EUR.
- Fetch on a cron schedule, never per request. Serve stale data if the source is down. Upsert, never blind insert.
- No authentication in the service — trust the gateway headers `x-developer-id` and `x-developer-tier`.
- No secrets in the repo.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port to listen on |
| `NODE_ENV` | — | `production` disables pretty logs |
| `MONGO_URI` | `mongodb://localhost:27017/apiaberta-<service>` | MongoDB connection string |

## Register your service

Once live, open an issue in [apiaberta/apiaberta](https://github.com/apiaberta/apiaberta/issues) with the `new-connector` label: service name, source URL, internal URL and a sample `/<service>/meta` response. The gateway team adds the proxy route.

## License

MIT
