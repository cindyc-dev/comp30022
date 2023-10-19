# Potato CRM

![](/readme-images/Logo-purple-background.PNG)

## Team

- [Ashley Teoh](https://github.com/ashleyteoh)
- [Aurelia Iskandar](https://github.com/aiskd)
- [Chuah Xin Yu](https://github.com/chuahxinyu)
- [Daniel Chin Weng Jae](https://github.com/Jaee-C)
- [Gan Yu Pin](https://github.com/Gyp1127)

## Features

### Sign Up/Sign In

### Dashboard

### Connections

### Chat

### Trello Board

### Calendar

### Settings

## Documentation

## Tech Stack

![](readme-images/techstack.png)

- [Next.js](https://nextjs.org/)
- [git](https://git-scm.com/)
- [npm](https://www.npmjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MySQL](https://www.mysql.com/)
- [Prisma](https://www.prisma.io/)
- [React](https://reactjs.org/)
- [DaisyUI](https://daisyui.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Pusher](https://pusher.com/)
- [Node.js](https://nodejs.org/en/)

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
   - > ❗ **Do not commit the `.env` file to git.** ❗
   - If you would like to set up a local database, please refer to the [Setting up a local database](#setting-up-a-local-database) section.
5. Push the prisma schema to the MySQL database
   ```shell
   npx prisma db push
   ```
6. Run the dev server
   ```shell
   npm run dev
   ```
7. The dev server should be up on [http://localhost:3000](http://localhost:3000)

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
