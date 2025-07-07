# CI/CD for an Express.js Ticketing Application

![Node CI](https://github.com/Irah2001/ticketing-devops/actions/workflows/ci.yml/badge.svg)

## Classe

RASAMIARIMANANA Irina Andrianarijaona
ESGI M1 - IW

---

This project implements a ticketing application using Express.js with a complete CI/CD pipeline using GitHub Actions.

## Project Structure

```
ticketing/
│
├── src/                    # Express.js Application
│   ├── app.js              # Main application file
│   ├── routes/             # (Currently not used, but can be for more complex routing)
│   ├── db/                 # Database connection
│   └── validation.js       # Input validation logic
│
├── public/                 # Static files (HTML, CSS)
│   ├── index.html          # Ticket submission form
│   └── tickets.html        # Template for displaying tickets
│   └── style.css           # Basic styling
│
├── tests/
│   ├── unit/               # Unit tests (Jest)
│   └── e2e/                # E2E tests (Cypress)
│
├── fixtures/               # Data for tests
│   └── seed.js             # Script to seed the database
│
├── Dockerfile              # Dockerfile for building the application image
├── .dockerignore           # Files to ignore when building Docker image
├── .eslintrc.js            # ESLint configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked dependencies
├── init.sql                # SQL script for initial database setup
├── docker-compose.yml      # Docker Compose for local development
├── .env.test               # Environment variables for testing
│
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI/CD pipeline

```

## Application Functionality

### Public Form (route `/`)

Accessible without authentication, allows submitting a ticket with:
- **Type of request** (bug, question, suggestion) - fetched from the `types` table.
- **Requester's email address**.
- **Message** (ticket content).

### Ticket List (route `/tickets`)

Requires **HTTP Basic authentication**. The username and password are provided via environment variables:
- `ADMIN_USER`
- `ADMIN_PASSWORD`

## Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tp-devops-2
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory with the following:
    ```
    ADMIN_USER=your_admin_username
    ADMIN_PASSWORD=your_admin_password
    DB_HOST=db
    DB_USER=root
    DB_PASSWORD=root
    DB_NAME=test_db
    ```

3.  **Start with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This will build the Docker image, start the MariaDB container, and the Express.js application.

4.  **Access the application:**
    - Form: `http://localhost:3000`
    - Tickets List: `http://localhost:3000/tickets` (requires basic auth)

## Testing

-   **Unit Tests:**
    ```bash
    npm test
    ```
-   **E2E Tests:**
    ```bash
    npm run test:e2e
    ```

## CI/CD with GitHub Actions

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and performs the following steps on `push` to `main` branch and `pull_request`:

1.  **Install dependencies** (`npm ci`)
2.  **Run linter** (`eslint`)
3.  **Start MariaDB container** for tests
4.  **Wait for DB** to be ready
5.  **Create tables and insert fixtures** (`node fixtures/seed.js`)
6.  **Execute unit tests**
7.  **Execute E2E tests**
8.  **Build Docker image**
9.  **Push Docker image** to Docker Hub
10. **Deploy via SSH** (only on `main` branch pushes)

### GitHub Secrets Configuration

To enable the CI/CD pipeline, you need to configure the following secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions > New repository secret`):

-   `DOCKER_USERNAME`: Your Docker Hub username.
-   `DOCKER_TOKEN`: Your Docker Hub Access Token (generate one from Docker Hub settings).
-   `ADMIN_USER`: Username for HTTP Basic authentication.
-   `ADMIN_PASSWORD`: Password for HTTP Basic authentication.
-   `SSH_HOST`: IP address or hostname of your remote deployment server.
-   `SSH_USERNAME`: SSH username for your remote server.
-   `SSH_KEY`: Private SSH key to connect to your remote server (ensure it's base64 encoded if needed, or just paste the raw private key).
-   `DB_HOST`: Hostname of the database on your deployment server (e.g., `localhost` or the service name if using Docker Compose on the server).
-   `DB_USER`: Database username for the deployed application.
-   `DB_PASSWORD`: Database password for the deployed application.
-   `DB_NAME`: Database name for the deployed application.

### Deployment

The deployment step in the CI/CD pipeline connects to your remote server via SSH and performs the following:

1.  Pulls the latest Docker image from Docker Hub.
2.  Stops and removes any existing running container of the application.
3.  Starts a new Docker container with the latest image, exposing port 3000 and passing necessary environment variables for the application and database connection.

**Note:** Ensure your remote server has Docker installed and configured. You might also need to set up a MariaDB instance on your remote server and configure its access for the deployed application.