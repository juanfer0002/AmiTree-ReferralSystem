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
- MAX_REFERRALS_BY_CODE: maximum amount of users that can join by a single referral
- REFERRED_USER_CREDIT: Credit that user that is referred gets by joining in
- OWNER_REFERRED_USER_CREDIT: Credit that owner of the referred user gets by joining in

You can use `.env` file where you set up those variables, located directly in server-side folder.
The following example can work for a development environment

/.env
```
SERVER_PORT=8080
TOKEN_PASS=secrete_pass

MONGO_URL=mongodb://localhost/referral-system

ENABLE_CONSOLE_LOG=true
LOG_LEVEL=info
LOG_PATH=logs/

MAX_REFERRALS_BY_CODE=5

REFERRED_USER_CREDIT=10
OWNER_REFERRED_USER_CREDIT=10
```
You must now be ready to start developing

# Database configuration

You can install a local MongoDB instance or use an external instance:

Just set up the `MONGO_URL` env variable as explained above.

You can install MongoDB from the following link: https://www.mongodb.com/what-is-mongodb

The following link has specific instructions for linux systems: https://docs.mongodb.com/manual/administration/install-on-linux/


# Development server

Run in the command line

```
npm start
```

You will need to run this command every time you change a file.
If some file doesn't compile or the linter can't fix problems server won't start 

Wait for the message **CONFIRMED!! SERVER IS UP** to appear, after this you'll know server started correctly.

# IMPORTANT INFORMATION:

Here you can find some considerations for understanding the server implementation:

Here you can find what each library is for:
- cors: Implements cors with express
- dotenv: Used to load environment variables through .env file
- express: Loads a server for implements restful services
- jsonwebtoken: Creates and validates JWT
- mongoose: Conencts to MongoDB
- winston: Tool used for logging errors and messages
- jest: Tool for unit testing


# Unit testing

## Install jest

Execute in the command line:

```
npm install -g jest
```


And check it installed correctly by checking its version:

```
jest -v
```

## Run tests


Execute in the command line:

```
jest
```