## Redcat Test Asignment

https://spiritual-store-b88.notion.site/Node-js-backend-test-assignment-bf672db7ab8a48f4a26e790e25d73229

## User Roles and Capabilities
The application has three available user roles: ADMIN, EDITOR, and VIEWER. Each role has specific capabilities as described below:

### ADMIN Role:
    Read Users: Can view user details.
    Delete Users: Can delete users from the system.
    Read Articles: Can view article details.
    Delete Articles: Can delete any article regardless of ownership.

### EDITOR Role:
    Create Articles: Can create new articles.
    Read Articles: Can view article details.
    Update Articles: Can update its own articles.
    Delete Articles: Can delete its own articles.

### VIEWER Role:
    Read Articles: Can view article details but cannot create, update, or delete articles.

------------


## Setup instructions
1. **Clone the Repository**
   `git clone <repository-url>`
2.  **Create Environment Variables File**
    Create a new file named .env in the root directory of the project.
    Copy the contents from the provided .env-example file into .env.
    Modify the values of the environment variables in the .env file according to your setup:
    **PORT**: The port number on which the server will run.
    **JWT_SECRET, JWT_EXPIRES_IN**: Secret key for JWT token generation.
    **DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME**: Database connection details.
    **SYNCHRONIZE_SCHEMA**: Set to true to synchronize entities with the database schema.
    **USER_SEED_ROUNDS, ARTICLE_SEED_ROUNDS**: Number of user and article records to pre-seed the application database (use only once for simplicity).
3. **Start the Application with Docker Compose**
   `docker-compose up`
4. **Access the GraphQL Playground:**
   Once the server is running, you can access the GraphQL Playground at `http://localhost:${PORT}/graphql`. Replace `${PORT}`  with the port number you specified in the .env file. Use this interface to interact with the GraphQL API and test different queries and mutations.

------------


## Note
Ensure that Docker and Docker Compose are installed on your system before running the application with Docker Compose.
Modify the .env file with appropriate values according to your environment setup.
The provided seed rounds variables (USER_SEED_ROUNDS, ARTICLE_SEED_ROUNDS) can be used only once for simplicity. After the initial seeding, you can remove or modify these variables as needed.
Make sure to replace `<repository-url>` with the actual URL of the Git repository when cloning the repository.
If you encounter any issues during setup, feel free to reach out for assistance.
