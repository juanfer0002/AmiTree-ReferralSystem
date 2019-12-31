
import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { IAuth, ISignUp } from '../common/auth/auth';
import { HttpUtils } from '../common/utilities/http-utils';
import AuthService from '../services/auth.service';

const router = express.Router();

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

        const signup: ISignUp = req.body;
        const tokenResponse = await AuthService.signUp(signup);
        res.send(tokenResponse);

    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

router.get('/referral-validity/:referralCode', async (req: Request, res: Response) => {
    try {

        const referralCode: string = req.params.referralCode;
        const isValid = await AuthService.validateReferralCodeIsValid(referralCode);
        res.send({ isValid });

    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

export default router;
