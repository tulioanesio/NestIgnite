Markdown
# NestIgnite

A robust, production-ready backend template built with NestJS and Prisma ORM. NestIgnite is designed to accelerate API development by embedding industry best practices, strict typing, security, and a scalable architecture directly from the start.

## Key Features

* **Built-in Security:** Global protection against brute-force attacks with Rate Limiting (`@nestjs/throttler` configured for 100 requests/minute). Hardened HTTP headers via `Helmet` with a custom Content Security Policy, plus strict `CORS` configuration.
* **Fail-Fast Environment Validation:** Uses `Zod` to validate environment variables upon startup, preventing the server from running with invalid or missing configurations.
* **Modern Interactive Documentation:** Replaces the standard Swagger UI with the `@scalar/nestjs-api-reference`, available out-of-the-box at the `/docs` route.
* **Global Error Handling:** Custom exception filters (`AllExceptionsFilter` and `PrismaClientExceptionFilter`) ensure that application crashes and database conflicts do not leak sensitive internal information to the client.
* **Automatic DTO Validation:** A global `ValidationPipe` is enabled with strict rules (`whitelist`, `forbidNonWhitelisted`), securing the API against unwanted payloads.
* **API Versioning:** Routes are structured and versioned by default using URI versioning (e.g., `/api/v1/...`).
* **Health Checks & Monitoring:** A centralized health module using `@nestjs/terminus` makes it easy to monitor the database and application state for Docker and Kubernetes deployments.
* **Database Integration:** Pre-configured Prisma ORM ready for PostgreSQL.

## Prerequisites

Ensure you have the following installed before proceeding:
* Node.js (v18 or higher recommended)
* Package manager (`pnpm` is the default in this project, but `npm` or `yarn` work as well)
* Docker and Docker Compose (Required for running the local PostgreSQL database)

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/tulioanesio/NestIgnite.git my-new-project

cd my-new-project
```
### 2. Configure Environment Variables

Create a .env file in the root of your project containing the variables required by the Zod validation schema:

```
NODE_ENV="development"
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/api_db?schema=public"
```
### 3. Install Dependencies

```
pnpm install
```
### 4. Start the Database

Spin up the PostgreSQL container using Docker Compose:

```
docker-compose up -d
```

### 5. Run Migrations & Generate Prisma Client

Apply the database schema and generate the strongly-typed Prisma client:

```
pnpm dlx prisma migrate dev
```
### 6. Run the Application

Start the local development server with hot-reload enabled:

```
pnpm run start:dev
```

## API Documentation
Once the server is running, you can view the interactive Scalar API documentation at:
```http://localhost:3000/docs```

## License
This project is licensed under the terms included in the [LICENSE](LICENSE) file.