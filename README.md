# FIN Household Expense API

NestJS + PostgreSQL service for household expense tracking. Supports wallets (per month/year), income/expense transactions, monthly planning, and a dashboard that summarizes performance overall and per wallet.

## Highlights
- **Wallets**: Track balances by currency with month/year context and default wallet flag.
- **Transactions**: Income/expense flows with planned links to planning items; deleting planned transactions re-opens planning.
- **Planning**: Monthly targets per wallet/category with status transitions (`open`, `closed`, `done`).
- **Dashboard**: Aggregated totals and balances overall and per wallet, filterable by date range.
- **Security defaults**: JWT bearer auth, Helmet, CORS, versioned routes, and soft-delete audit fields (`created_by`, `updated_by`, `deleted_by`).
- **Tooling**: Jest, ESLint, Prettier, and Docker helper script.

## Prerequisites
- Node.js ≥ 18 and npm ≥ 9 (or Yarn if preferred).
- PostgreSQL database (defaults to port `5432`).
- Optional: MinIO server for object storage integration.
- Optional: Docker engine if you intend to use `deploy.sh`.

## Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/kikiginanjar16/fin-household-expense.git
   cd fin-household-expense
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an environment file:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database, MinIO, JWT, and documentation credentials.
5. Start the development server (defaults to `PORT` in `.env`, fallback `3000`):
   ```bash
   npm run start:dev
   ```
6. Visit `http://localhost:<PORT>/docs` for interactive API docs (credentials required—see `SWAGGER_USER`/`SWAGGER_PASSWORD`).

## Environment Variables
| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment flag | `development` |
| `PORT` | HTTP port for NestJS application | `3000` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL connection settings | `localhost`, `5432`, `user`, `password`, `database` |
| `JWT_SECRET` | Secret for signing access tokens | `secret` |
| `SWAGGER_USER`, `SWAGGER_PASSWORD` | Basic auth credentials to access `/docs` | – |

## Project Layout
```
src/
├── app.module.ts            # Connects modules and configures TypeORM
├── main.ts                  # Bootstrap with security middlewares and Rapidoc
├── common/                  # Constants, messages, utilities
├── entities/                # TypeORM entities extending BaseEntity
├── libraries/common/        # Reusable DTOs and helpers
├── middlewares/             # JWT validation middleware
└── modules/
    ├── public/              # Registration & login flows
    ├── users/               # User CRUD & profile management
    ├── roles/, permissions/ # RBAC management endpoints
    ├── categories/, menus/  # Domain catalog examples
    ├── notifications/       # Notification persistence + pagination
    ├── wallets/             # Wallet CRUD with month/year context
    ├── planning/            # Monthly planning per wallet/category
    ├── transactions/        # Income/expense + planned transaction handling
    └── dashboard/           # Aggregated performance endpoints
```

Each module follows a layered approach:
* **Controller**: Request/response mapping and routing.
* **Use case**: Encapsulated domain logic.
* **Repository/Entity**: Persistence via TypeORM repositories.

## Core Flows
- **Wallets**: Create wallets with `name`, `currency`, optional `initial_balance`, `is_default`, `month`, and `year`. List/filter by these fields.
- **Planning**: Define targets with `planned_type`, `planned_amount`, `status` (`open`/`closed`/`done`), per wallet/category. Soft-delete aware.
- **Transactions**: Create income/expense. When `is_planned=true`, `planning_id` is mandatory and the linked planning moves to `done`. Updating honors the same rule; deleting a planned transaction rolls the planning status back to `open`.
- **Dashboard**: `GET /v1/dashboard?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` returns `overall` and `per_wallet` aggregates (income, expense, balance, transaction counts).

## Development Workflow
- Start development server: `npm run start:dev`
- Build for production: `npm run build` (output to `dist`)
- Start compiled build: `npm run start:prod`
- Run linting: `npm run lint`
- Auto-format: `npm run format`
- Run unit tests once / watch / coverage:
  ```bash
  npm run test
  npm run test:watch
  npm run test:cov
  ```
- Debug tests with inspector: `npm run test:debug`
- (Placeholder) e2e command: `npm run test:e2e`

## CRUD Generator Scaffolding
- **Install**: Add the CLI globally (`npm install -g crud-generator-nestjs`) or as a dev dependency (`npm install -D crud-generator-nestjs`). Using `npx crud-generator-nestjs` works too.
- **Describe your model**: Create a JSON file (e.g., `tools/generators/todo.json`) that lists the entity name, pluralized route, primary key type, and fields with metadata.
- **Generate resources**:
  ```bash
  crud-generator-nestjs tools/generators/todo.json --output src/modules
  ```
  Replace the output path or additional flags as needed—the generator creates NestJS entities, DTOs, modules, controllers, and use cases aligned with this project's layering.
- **Refine**: Wire generated files into `AppModule`, adjust relationships, add business logic, and update tests/documentation. Sensitive fields should continue to use the encryption utilities provided in `src/common`.
- Refer to the tool's repository for advanced options and examples: [github.com/kikiginanjar16/crud-generator-nestjs](https://github.com/kikiginanjar16/crud-generator-nestjs).

## API Documentation
- Rapidoc served at `/docs` with credentials from `SWAGGER_USER` and `SWAGGER_PASSWORD`.
- JWT bearer scheme (`x-access-token`) preconfigured in the doc to test protected endpoints.
- Adjust metadata (`title`, `description`, version) inside `src/main.ts` if needed.

## Database & Data Integrity
- PostgreSQL connection configured in `AppModule` with auto entity loading and schema synchronization enabled by default.
- Shared `BaseEntity` adds UUID primary keys, timestamps, soft delete, and auditing columns.
- Passwords hashed with `bcrypt`.

## Security Defaults
- Helmet middleware for HTTP header hardening.
- CORS enabled for cross-origin clients—customize as required.
- Global JWT middleware (`JwtValidate`) to protect downstream handlers.

## Docker Deployment
- `deploy.sh` builds and runs the application as a Docker container:
  ```bash
  ./deploy.sh
  ```
  Update `IMAGE_NAME`, `CONTAINER_NAME`, and `PORT_MAPPING` to suit your environment.
- Ensure your `.env` values are supplied to the container (e.g., via Docker secrets or environment file).

## Troubleshooting
- **Cannot access `/docs`**: Confirm `SWAGGER_USER`/`SWAGGER_PASSWORD` are set and restart the server.
- **Database connection errors**: Verify PostgreSQL credentials and that the database is reachable from the running container/service.
- **Encrypted fields look unreadable**: Use application services to decrypt—plaintext is intentionally not stored.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes with context.
4. Push to your fork and open a pull request describing the update.
5. Include tests or updates to documentation where applicable.

## License
MIT © Kiki Ginanjar
