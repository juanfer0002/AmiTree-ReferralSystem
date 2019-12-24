
import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { IAuth } from '../common/auth/auth';
import { HttpUtils } from '../common/utilities/http-utils';
import { LoggerUtils } from '../common/utilities/logger-utils';
import AuthService from '../services/auth.service';

const JWT_SECRET_PASS: string = process.env.TOKEN_PASS;

const router = express.Router();
const logger = LoggerUtils.getLogger('auth.route');

router.post('/signin', async (req: Request, res: Response) => {
    try {

        const auth: IAuth = req.body;
        const tokenResponse = await AuthService.signIn(auth);
        res.send(tokenResponse);

    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

router.post('/signup', async (req: Request, res: Response) => {
    try {

        const auth: IAuth = req.body;
        const tokenResponse = await AuthService.signIn(auth);
        res.send(tokenResponse);

    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

// router.post('/signup', async (req: Request, res: Response) => {
//     try {

//         let account: IAccount = req.body;
//         account = await AuthService.signUp(account);
//         res.send(account);

//     } catch (e) {
//         const response = HttpUtils.handleUncaughtError(e);
//         res.status(response.code).send(response.message);
//     }
// });


export default router;
