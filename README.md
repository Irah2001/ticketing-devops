# TP #2 – CI/CD Pipeline with Database

![Node CI](https://github.com/Irah2001/tp-devops-2/actions/workflows/ci.yml/badge.svg)

## Classe

RASAMIARIMANANA Irina Andrianarijaona
ESGI M1 - IW

---

This project is a Node.js/Express application designed to demonstrate a complete CI/CD pipeline using GitHub Actions. It includes a web form for data submission, a MariaDB database for storage, unit tests, end-to-end (E2E) tests, and a containerized setup with Docker.

## Features

-   **Web Form**: A simple HTML form at `GET /` to submit a name and email.
-   **Data Submission**: A `POST /submit` endpoint to process the form and save the data to the database.
-   **Submissions List**: A `GET /submissions` endpoint to display all entries from the database.
-   **Database Integration**: Uses a MariaDB database to persist data.
-   **Testing**: Includes both unit tests (Jest) and E2E tests (Cypress).
-   **CI/CD**: An automated GitHub Actions workflow for continuous integration and deployment.
-   **Containerization**: Docker and Docker Compose setup for easy local development.

## Project Architecture

```
tp-devops-2/
│
├── .github/workflows/  # GitHub Actions CI/CD workflow
│   └── ci.yml
├── fixtures/           # Database seeding scripts
│   └── seed.js
├── public/             # Static assets (HTML form, CSS)
│   ├── index.html
│   ├── style.css
│   └── submissions.html
├── src/                # Application source code
│   ├── db/             # Database connection setup
│   │   └── database.js
│   ├── routes/         # Express routes
│   ├── app.js          # Main Express application
│   └── validation.js   # Form validation logic
├── tests/
│   ├── e2e/            # End-to-end tests with Cypress
│   │   └── submission.cy.js
│   └── unit/           # Unit tests with Jest
│       ├── database.test.js
│       └── validation.test.js
├── .gitignore          # Specifies intentionally untracked files to ignore
├── cypress.config.js   # Cypress configuration file
├── .eslintrc.js        # ESLint configuration
├── docker-compose.yml  # Docker Compose setup
├── Dockerfile          # Dockerfile for the application
├── init.sql            # Database initialization script
├── package.json        # Project dependencies and scripts
├── package-lock.json   # Records the exact dependency tree
└── README.md           # This README file
```

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

### Local Development (Recommended)

The easiest way to run the application locally is with Docker Compose. This will build the application container and run a separate container for the database, mirroring the CI environment.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Build and run the containers:**
    ```bash
    docker-compose up --build
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Manual Local Setup

If you prefer to run the application without Docker, you will need to have a local MariaDB instance running.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure environment variables:**
    Create a `.env` file in the root of the project and add your database connection details:
    ```env
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    ```

3.  **Seed the database:**
    Run the fixtures script to create the necessary tables.
    ```bash
    node fixtures/seed.js
    ```

4.  **Start the application:**
    ```bash
    npm start
    ```

## Running Tests

### Unit Tests

To run the unit tests with Jest:

```bash
npm test
```

*Note: The database integration tests require a running database connection.*

### End-to-End Tests

To run the E2E tests with Cypress:

1.  Make sure the application is running (`npm start` or `docker-compose up`).
2.  Open the Cypress test runner:
    ```bash
    npx cypress open
    ```

## CI/CD Pipeline

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and is triggered on every `push` and `pull_request` to the `main` branch.

The workflow performs the following steps:

1.  **Checkout Code**: Checks out the repository code.
2.  **Setup Node.js**: Installs the specified Node.js version.
3.  **Install Dependencies**: Runs `npm install`.
4.  **Start Database Service**: Launches a MariaDB container to be used for testing.
5.  **Lint Code**: Runs `npm run lint` to check for code style issues.
6.  **Seed Database**: Executes the `fixtures/seed.js` script to prepare the test database.
7.  **Run Unit Tests**: Runs `npm test`.
8.  **Run E2E Tests**: Runs the Cypress tests against the running application.

The pipeline will fail if any of these steps encounter an error, ensuring code quality and stability.
