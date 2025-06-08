# CTT Exercise - Frontend Typescript!

This project is a single-page application (SPA) developed as part of the CTT Frontend Exercise. It features a product listing with CRUD (Create, Read, Update, Delete) functionalities, built using TypeScript, React, and vanilla Redux for state management. The development environment is containerized using Docker and Docker Compose.

## Features

- Display a list of products fetched from an API.
- Allow Create, Read, Update, and Delete (CRUD) operations on products.
- Manage application state efficiently using Redux to minimize API requests.
- Local development environment powered by Docker.

## Core Technologies

- TypeScript
- React
- Redux (vanilla, without Redux Toolkit)
- Webpack
- Jest & React Testing Library (for TDD)
- Docker & Docker Compose
- JSON Server (for mock API)
- ESLint (for code linting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later recommended, though Docker manages this for the app runtime)
- [npm](https://www.npmjs.com/) (typically comes bundled with Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine and Docker Compose CLI separately)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/patriciocordeiro/ctt-frontend-react-code-challenge.git
cd ctt-frontend-react-code-challenge
```

### 2. Environment Configuration

This project relies on an `.env` file for environment-specific configurations, primarily for Docker Compose.

Create an `.env` file in the root of the project directory with the following content:

```env
APP_DEV_PORT=3002
JSON_SERVER_PORT=3001
API_BASE_URL=http://json-server:${JSON_SERVER_PORT}
REACT_APP_API_URL=${API_BASE_URL}
```

You will also need a `db.json` file in the project root for `json-server` to use as its database. You can start with an empty products array:

```json
{
  "products": []
}
```

### 3. Running the Application (Docker)

The recommended way to run the application for development is using Docker Compose. This orchestrates the React application container and the mock API (`json-server`) container.

Execute the following command from the project root:

```bash
npm run docker:up
```

This command will:

1. Build the Docker images if they don't exist or if `Dockerfile` has changed.
2. Start all services defined in `docker-compose.yml`.

Once the services are up and running:

- The React Application will be accessible at: `http://localhost:3002` (or the port specified by `APP_DEV_PORT` in your `.env` file).
- The Mock API Server (`json-server`) will be accessible at: `http://localhost:3001` (or the port specified by `JSON_SERVER_PORT` in your `.env` file). This server uses `db.json` in the project root as its data source.

To stop all Docker services:

```bash
npm run docker:down
```

### 4. Testing

This project uses [Jest](https://jestjs.io/) as the test runner and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for testing React components.

- To run all tests: `npm test`
- To run tests in watch mode: `npm run test:watch`

## Available npm Scripts

- `npm start`: Runs the React app in development mode using Webpack Dev Server.
- `npm run build`: Builds the app for production to the `dist` folder. This script includes pre-build steps for linting and type-checking.
- `npm run type-check`: Executes TypeScript compiler to check for type errors without emitting JavaScript files.
- `npm run lint`: Lints the codebase using ESLint.
- `npm test`: Runs the test suite using Jest.
- `npm run test:watch`: Runs tests in interactive watch mode.
- `npm run json-server`: Starts the `json-server` mock API natively on the host machine.
- `npm run docker:up`: Builds (if necessary) and starts all services defined in `docker-compose.yml`.
- `npm run docker:down`: Stops and removes the containers, networks, and volumes created by `docker-compose up`.
- `npm run docker:rebuild`: Rebuilds and starts all Docker Compose services.
- `prebuild`: (Automatically run before `npm run build`) Executes `npm run lint && npm run type-check`.

## Development Workflow

- Test Driven Development (TDD): Features and components are developed by first writing tests.
- Trunk Based Development (TBD): All development happens directly on the main branch, with frequent, small, tested commits.

## Code Quality

- ESLint: Configured for enforcing code style and best practices for TypeScript and React.
- TypeScript: Static typing is used throughout the project to enhance code quality and maintainability. Type checking is enforced as a pre-build step.

## Docker Configuration

- `Dockerfile`: Defines the image for the React application, setting up the Node.js environment, installing dependencies, and running the development server.
- `docker-compose.yml`: Orchestrates the multi-container setup, including the application (`app`) and the mock API (`json-server`). It handles port mapping, volume mounts for hot-reloading, and environment variable injection from the `.env` file.
- `.dockerignore`: Specifies files and directories to exclude from the Docker build context, optimizing image size and build times.
