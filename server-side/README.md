# Server Side

# Installation process

## Install Node JS version 10 or later

Using nvm, run in the command line

```
nvm install 10
```

or download from Node JS website https://nodejs.org

## Check node version and npm version

Run in the command line

```
node -v
npm -v
```

## Install Typescript and TS lint version 10 or later

Using npm, run in the command line

```
npm install -g typescript
npm install -g tslint
```

## Install dependencies

Inside the project server-side folder run:

```
npm install
```

## Configure environment

You must set up the following environment variables:

- SERVER_PORT: port number where server is going to be exposed
- TOKEN_PASS: secret password to generate jwt tokens
- MONGO_URL: MongoDB url where server will connect
- ENABLE_CONSOLE_LOG: (optional) if in production mode you need to see logs in console set this environment variable to true. It's true in dev mode
- LOG_LEVEL: (default: debug) available options: emerg, alert, crit, error, warning, notice, info, debug (from Highest to lowest priority)
- LOG_PATH: (default: logs/) disk path location where logs should be put, this is a folder path.

You can use `.env` file where you set up those variables, located directly in server-side folder.
The following example can work for development evironment

/.env
```
SERVER_PORT=8080
TOKEN_PASS=secrete_pass

ENABLE_CONSOLE_LOG=true
LOG_LEVEL=info
LOG_PATH=logs/
```
You must now be ready to start developing

# Development server

Run in the command line

```
npm start
```

You will need to run this command every time you change a file.
If some file doesn't compile or linter can't fix problems server won't start 

# IMPORTANT INFORMATION:

Here you can find some considerations for understanding the server implementation:

Here you can find what each library is for:
cors: Implements cors with express
dotenv: Used to load environment variables through .env file
express: Loads a server for implements restful services
jsonwebtoken: Creates and validates JWT
lodash: Utilities, mainly used for rounding numbers in this project
mongoose: Conencts to MongoDB
winston: Tool used for logging errors and messages
