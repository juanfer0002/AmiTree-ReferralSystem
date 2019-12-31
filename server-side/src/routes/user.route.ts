
import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { HttpUtils } from '../common/utilities/http-utils';
import { UserService } from '../services/user.service';

const router = express.Router();

router.get('/current', async (req: Request, res: Response) => {
    try {
        const payload = HttpUtils.extractTokenPayloadFromRequest(req);
        const userId = payload.user;

        const users = await UserService.findUserById(userId);
        res.send(users);
    } catch (e) {
        const response = HttpUtils.handleUncaughtError(e);
        res.status(response.code).send(response.message);
    }
});

export default router;
