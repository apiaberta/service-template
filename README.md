# API Aberta — Service Template

Scaffold for building data connector services on the API Aberta platform. Each service fetches data from a government or public source, normalises it, stores it in MongoDB, and exposes it via a REST API with a consistent contract.

## Stack

- **Runtime:** Node.js 22+
- **Framework:** Fastify 5
- **Database:** MongoDB + Mongoose
- **Scheduler:** node-cron
- **Logging:** pino (with pino-pretty in dev)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/apiaberta/service-template.git my-service
cd my-service
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your service name and MongoDB URI
```

Required env vars:

| Variable   | Default                              | Description                   |
|------------|--------------------------------------|-------------------------------|
| `PORT`     | `3001`                               | HTTP port the service listens on |
| `MONGO_URI`| `mongodb://localhost:27017/...`      | MongoDB connection string     |
| `NODE_ENV` | `development`                         | Use `production` for prod    |

### 3. Run locally

```bash
npm run dev       # development (watch mode, pino-pretty logs)
npm start         # production
```

### 4. Run tests

```bash
npm test          # Node.js built-in test runner
npm run lint      # ESLint
npm run format    # Prettier check
```

## Project Structure

```
src/
  index.js       # Fastify app entry point + cron setup
  connector.js  # Fetch & normalise data from source → MongoDB
  routes/
    data.js     # Public REST API (GET /v1/items)
```

## Service Contract

Every service **must** implement these endpoints:

| Method | Path     | Description                        |
|--------|----------|------------------------------------|
| GET    | `/health`| Health check — `{ status, service, timestamp }` |
| GET    | `/meta`  | Metadata — `{ service, source, last_updated, record_count, update_frequency }` |
| GET    | `/v1/*`  | Data routes (see routes/data.js)  |

## CI / CD

GitHub Actions runs on every push and PR:

- **Lint** — ESLint + Prettier format check
- **Test** — `node --test`
- **Build** — smoke check (placeholder for bundling if needed)

## Naming & Conventions

- Service name: lowercase, hyphens allowed (e.g. `connector-fuel`)
- Collection names: plural, snake_case (e.g. `fuel_prices`)
- Route paths: `/v1/{resource}` with pagination `?page=&limit=`
- Timestamps: ISO 8601 UTC

## Adding a new connector

1. Copy `service-template` and rename it
2. Set `SERVICE_NAME` in `src/index.js`
3. Implement `fetchAndStore()` in `src/connector.js`
4. Implement data routes in `src/routes/data.js`
5. Add your source URL in `src/index.js` (`/meta` endpoint)
6. Update `src/connector.test.js` with real tests
7. Deploy — see deploy system docs

## Deploy

See the [deploy receiver](https://github.com/apiaberta/deploy-receiver) for automatic deployment via GitLab webhooks.

## License

MIT
