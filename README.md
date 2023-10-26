# Potato CRM

![](/readme-images/Logo-purple-background.PNG)

## Table of Contents

- [Potato CRM](#potato-crm)
  - [Table of Contents](#table-of-contents)
  - [Team](#team)
  - [Features](#features)
    - [Account Management](#account-management)
    - [Dashboard](#dashboard)
    - [Connections](#connections)
    - [Chat](#chat)
    - [Trello Board](#trello-board)
    - [Calendar](#calendar)
  - [Tech Stack](#tech-stack)
  - [Development Setup](#development-setup)
    - [Generating your own environment variables](#generating-your-own-environment-variables)
      - [`DATABASE_URL` (required for `npm run dev`)](#database_url-required-for-npm-run-dev)
      - [`NEXTAUTH_SECRET` (required for `npm run dev`)](#nextauth_secret-required-for-npm-run-dev)
      - [`NEXTAUTH_URL` (required for `npm run dev`)](#nextauth_url-required-for-npm-run-dev)
      - [Discord, Github, Google, Email and Pusher (not required for `npm run dev`)](#discord-github-google-email-and-pusher-not-required-for-npm-run-dev)
    - [Setting up a local database](#setting-up-a-local-database)

## Team

- [Ashley Teoh](https://github.com/ashleyteoh)
- [Aurelia Iskandar](https://github.com/aiskd)
- [Chuah Xin Yu](https://github.com/chuahxinyu)
- [Daniel Chin Weng Jae](https://github.com/Jaee-C)
- [Gan Yu Pin](https://github.com/Gyp1127)

## Features

### [Account Management](/docs/auth.md)

[![](/readme-images/auth.png)](/docs/auth.md)

### [Dashboard](/docs/dashboard.md)

[![image](/readme-images/dashboard.png)](/docs/dashboard.md)

### [Connections](/docs/connections.md)

[![image](/readme-images/connections.png)](/docs/connections.md)

### [Chat](/docs/connections.md)

[![chat123](/readme-images/chat.png)](/docs/connections.md)

### [Trello Board](/docs/trello.md)

[![image](/readme-images/trello.png)](/docs/trello.md)

### [Calendar](/docs/calendar.md)

[![image](/readme-images/calendar.png)](/docs/calendar.md)

## Tech Stack

![](readme-images/techstack.png)

|Tool|Description|
|--|--|
|[Next.js](https://nextjs.org/)|NextJS is a framework built on top of [React](https://reactjs.org/) and leverages [Node.js](https://nodejs.org/en/) on the Backend.|
|[Prisma](https://www.prisma.io/)|ORM (Object-Relational Mapping) tool that makes it easier to work with databases in Typescript|
|[MySQL](https://www.mysql.com/)|Relational DBMS (Database Management System)|
|[DaisyUI](https://daisyui.com/) and [Tailwind CSS](https://tailwindcss.com/)|Provides a set of low-level utility classes to easily style web components.|
|[NextAuth.js](https://next-auth.js.org/)|Simplifies and unifies authentication methods.|
|[Pusher](https://pusher.com/)|Enables instant, bidirectional communication between clients and the server via websockets. Required for real-time chat feature.|
|[git](https://git-scm.com/)|version control|
|[npm](https://www.npmjs.com/)|package manager|

## Development Setup

1. Make sure you have [node](https://nodejs.org/en/download), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) and [git](https://git-scm.com/downloads) installed before proceeding.
   - We also recommend using VSCode as your IDE. You can download it [here](https://code.visualstudio.com/download).
   - We also recommend the following VSCode Extensions:
     - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
     - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
     - [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
     - [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
     - [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
     - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
2. Clone the repository
   - You can use the following command to clone the repository
     ```shell
     git clone https://github.com/chuahxinyu/comp30022.git
     ```
   - Alternatively, you can download the repository as a zip file and extract it.
   - If you are using VSCode, you can clone the repository using `Ctrl+Shift+P` and then typing `Git: Clone` and then pasting the repository URL.
3. Install packages
   ```shell
   npm install
   ```
   - Make sure you are in the correct directory when doing this, you might have to `cd comp30022` depending on how you've cloned the repository
     ```shell
     cd comp30022
     ```
4. Set up environment variables. Copy the [`.env.example`](/.env.example) file to `.env` and fill in the values. Please contact Xin Yu ([chuahx@student.unimelb.edu.au](mailto:chuahx@student.unimelb.edu.au)) for the dev/production environment variable values.
   ```shell
   cp .env.example .env
   ```
   - If you are a supervisor/tutor/lecturer running the app, we recommend contacting the team for the environment variables to be shared.
   - If you are not developing for this application and would like to clone and create a new database and have full control over the third-party services, please refer to the [Generating your own environment variables](#generating-your-own-environment-variables) section.
   - If you are developing on the backend and would like to set up a local database, please refer to the [Setting up a local database](#setting-up-a-local-database) section. Note that this only gives you instructions for the `DATABASE_URL`.
   - The following environment variables are required to be able to do `npm run dev` (step 6):
     - `DATABASE_URL`, `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
   - The other environment variables are not required to `npm run dev` but are required if you would like to use:
     - third-party authentication (`DISCORD_...`, `GITHUB_...` and `GOOGLE_...`)
     - forgot password feature (`EMAIL_...`)
     - chatting with connections (`PUSHER_...`)
5. Push the prisma schema to the MySQL database
   ```shell
   npx prisma db push
   ```
6. Run the dev server
   ```shell
   npm run dev
   ```
7. The dev server should be up on [http://localhost:3000](http://localhost:3000)

### Generating your own environment variables

#### `DATABASE_URL` (required for `npm run dev`)

![](/readme-images/planetscale-setup.gif)

> gif of creating a database on PlanetScale and obtaining the DATABASE_URL. Note: passwords in this gif have now been changed.

1. Go to [https://planetscale.com/](https://planetscale.com/), create an account or log in.
2. Create a new database and select the desired AWS region for your database and your plan.
   ![image](/readme-images/planetscale.png)
   - we named our's `ps-database` and are using the Hobby plan with our region in `ap-southeast-2`
   - note: you might have to create a organisation before you are able to create a new database.
3. Once your database has been initialized, click on `Connect`. Generate a new password with whatever name you'd like, the branch as `main` and role as `Admin`.
   - ![image](/readme-images/planetscale-create-password.PNG)
   - ![image](/readme-images/planetscale-connect.PNG)
   - select `Prisma` for the "Connect with" option and copy the `.env` given and paste it into your .env file. Make sure to remove any existing empty value for that variable (ie. delete `DATABASE_URL=""` if it is there so it doesn't read the wrong value).

#### `NEXTAUTH_SECRET` (required for `npm run dev`)

- Feel free to just replace this value with any non-empty string (eg. "a-super-long-secret").
- You can also generate a secret using the following command in the terminal:
  ```shell
  openssl rand -base64 32
  ```
  - this will generate a string that you can copy and use as your NEXTAUTH_SECRET
  - If you are getting an error: you might have to use the Bash termninal. [Here](https://stackoverflow.com/questions/75000633/where-to-generate-next-auth-secret-for-next-auth) is a resource that might help.

#### `NEXTAUTH_URL` (required for `npm run dev`)

- For development, you can use `NEXTAUTH_URL="http://localhost:3000"`

#### Discord, Github, Google, Email and Pusher (not required for `npm run dev`)

Here are some links to guides on how to generated the secrets for each of the following

- Discord: [HOW TO GET DISCORD CLIENT ID AND SECRET?](https://support.heateor.com/discord-client-id-discord-client-secret/)
- GitHub: [How to get GitHub Client ID and Client Secret API details?](https://www.knowband.com/blog/user-manual/get-github-client-id-client-secret-api-details/)
- Google: [Get your Google API client ID (Go to the Google Cloud Platform Configurations section)](https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid)
- Email: [How to Use Nodemailer to Send Emails from Your Node.js Server](https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/)
- Pusher: [Pusher JavaScript quick start](https://pusher.com/docs/channels/getting_started/javascript/#get-your-free-api-keys)

Feel free to contact the development team if you are running into any issues with the above. I will note again that if you are a supervisor/tutor/lecturer running the app, we recommend contacting the team for the environment variables to be shared.

### Setting up a local database

> This application uses a MySQL data base to store information. You can either set up a local database or use the production database. If you would like to set up a local database, please follow the steps below. Otherwise, request for the production database URL from the team and skip this section.

1. Install [MySQL](https://dev.mysql.com/downloads/mysql/) and [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) if you have not already done so.
   - ❗ Make sure that you have actually downloaded a MySQL server and not just MySQL Workbench.
   - You can check if you have a MySQL server installed by running the following command in your terminal:
     ```shell
     mysql --version
     ```
     If you do not have a MySQL server installed, you can download it [here](https://dev.mysql.com/downloads/mysql/).
2. Create a new database using the following command or using MySQL Workbench.
   ```sql
   CREATE DATABASE <database_name>;
   ```
3. Add the `DATABASE_URL` value to your `.env` file. The value should be in the following format:
   ```
   mysql://<username>:<password>@<host>:<port>/<database_name>
   ```
   - The default username is `root` and the default password is `password`.
   - The default host is `localhost` and the default port is `3306`.
   - The database name should be the same as the one you created in step 2.
   - An example of a `DATABASE_URL` value is:
     ```
     mysql://root:password@localhost:3306/potato_crm
     ```
4. If you run into any issues while setting this up, please contact Daniel Chin (wengjaec@student.unimelb.edu.au).
