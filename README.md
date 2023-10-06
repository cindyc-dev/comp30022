# comp30022

## Development Setup
1. Clone the Repository
2. Install packages
    ```
    npm install
    ```
3. Set up environment variables. Create a `.env` file at the root of the project with the following contents:
    ```
    NEXTAUTH_URL=http://localhost:3000
    DISCORD_CLIENT_ID=""
    DISCORD_CLIENT_SECRET=""
    DATABASE_URL=...
    ```
    For `DATABASE_URL`, create a local _mysql_ database and enter the connection string there..

5. Run the dev server
    ```
    npm run dev
    ```
6. The dev server should be up on [http://localhost:3000](http://localhost:3000)
