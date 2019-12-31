
import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { HttpUtils } from '../common/utilities/http-utils';
import { ReferralService } from '../services/referral.service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const payload = HttpUtils.extractTokenPayloadFromRequest(req);
        const userId = payload.user;

        const code = await ReferralService.createNewReferralForUserId(userId);
        res.send({ code });
    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const payload = HttpUtils.extractTokenPayloadFromRequest(req);
        const userId = payload.user;

        const currentReferralInfo = await ReferralService.getReferralInfoByUserId(userId);
        res.send(currentReferralInfo);
    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

export default router;
