(require('dotenv').config()); // To avoid it gets moved by organized imports

import cors from 'cors';
import express, { Response } from 'express';
import { Request } from 'express-serve-static-core';
import { DeploymentCheckList } from './common/start-scripts/deployment-check-list';
import mongoStart from './common/start-scripts/mongo-start';
import { HttpUtils } from './common/utilities/http-utils';
import { LoggerUtils } from './common/utilities/logger-utils';
import auth from './routes/auth.route';
import user from './routes/user.route';

mongoStart();

const logger = LoggerUtils.getLogger('index');

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.json());

app.use('/auth', auth);

// Security
app.use((req: Request, res: Response, next) => {
    try {
        HttpUtils.verifyAndExtractTokenPayloadFromRequest(req);
        next();
    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

// Secured routes
app.use('/user', user);


// start the Express server
app.listen(port, () => {
    logger.info(`Server started at http://localhost:${port}`);
    DeploymentCheckList.checkService('express');
});

logger.info('System is almost ready... waiting confirmation message...');
DeploymentCheckList.onEverythingSetup = () => {
    logger.info('CONFIRMED!! SERVER IS UP');
};


// Unhandled promises's rejections
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Rejection at:', reason);
});
