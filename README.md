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
REACT_APP_API_URL="http://localhost:3001"
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

## Test-Driven Development (TDD)

This project was developed using Test-Driven Development (TDD).

For each feature:

- I wrote a test first that described the expected behavior
- Then I wrote the minimal code to make the test pass
- Finally, I refactored the implementation while keeping tests green

To maintain a clean Git history and stable CI pipeline, I chose **not to commit failing test states**, but the red-green-refactor cycle was followed locally during development.

## Assumptions Made

In building this application, a few key assumptions guided the development:

- **Backend Simulation:** I've used `json-server` to act as our backend API. This allowed me to focus on the frontend logic while still having a working API for product data and CRUD operations.
- **Following the API Blueprint:** The provided product schema was my source of truth for how product data is structured. I made sure `json-server` worked with this schema for creating, reading, updating, and deleting products.
- **Server-Generated IDs:** For new products, I assumed the backend (our `json-server`) would be responsible for generating unique IDs (UUIDs), so the frontend doesn't create them.
- **Simplified Category Input:** To keep the product form straightforward for this exercise, I opted for a simple comma-separated text input for category IDs. In a real-world app, I'd definitely go for something more user-friendly like a multi-select dropdown.
- **Core Error Display:** Basic error messages from API calls are shown to the user. More elaborate error recovery, like retry buttons, felt beyond the scope of this particular exercise.
- **Functional UI Focus:** Since no specific designs were provided, my main goal for the UI was to make it clean, functional, and easy to demonstrate all the required features.
- **Basic Form Checks:** I've included some basic client-side validation (like ensuring fields aren't empty). I'm assuming the API would handle more robust, definitive validation.

- **Efficient Data Handling with Redux:** To meet the goal of minimizing API calls, my Redux setup fetches the main product list initially. After that, CRUD operations update the local Redux state directly, avoiding unnecessary re-fetches of the entire list unless absolutely needed.
- **API Confirmation Before UI Update:** For clarity and simplicity in this exercise, UI updates for creating, updating, or deleting products happen after the API confirms the operation was successful. I didn't implement optimistic updates at this stage.

- A detail page for each product could be implemented by adding a route (e.g., `/products/:id`) and a corresponding component to fetch and display the full product details. This would involve using React Router and possibly reusing the product API logic already present in the project.
- Alternatively, the product detail could be shown using conditional rendering within the main page, for example by displaying a detail panel or modal when a product is selected, without changing the route.
