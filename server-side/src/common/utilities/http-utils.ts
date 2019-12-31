import { Request } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../auth/auth-errors';
import { CustomValidationError } from './error';
import { LoggerUtils } from './logger-utils';

const JWT_SECRET_PASS: string = process.env.TOKEN_PASS;
const TOKEN_PREFIX = 'Bearer ';

const SERVER_ERROR = 500;
const SERVER_ERROR_MESSAGE = 'An internal error has occurred. Try later.';

interface IHttErrorResponse {
    code: number;
    message: string;
}

const logger = LoggerUtils.getLogger('http-utils');

export class HttpUtils {

    public static handleUncaughtError(e: Error): IHttErrorResponse {
        let errorResponse: IHttErrorResponse;

        logger.error('Handling error during request resolution: ', e);
        if (e instanceof CustomValidationError) {

            errorResponse = {
                code: e.code,
                message: e.message
            };

        } else {
            errorResponse = {
                code: SERVER_ERROR,
                message: SERVER_ERROR_MESSAGE
            };
        }

        return errorResponse;

    }

    public static extractTokenPayloadFromRequest(req: Request) {
        try {
            const authToken = HttpUtils.separateTokenFromPrefix(req.headers.authorization);
            const payload: any = jwt.decode(authToken);
            return payload;
        } catch (e) {
            throw new ForbiddenError();
        }
    }

    public static verifyAndExtractTokenPayloadFromRequest(req: Request) {
        try {
            const authToken = HttpUtils.separateTokenFromPrefix(req.headers.authorization);
            const payload: any = jwt.verify(authToken, JWT_SECRET_PASS);
            return payload;
        } catch (e) {
            throw new ForbiddenError();
        }
    }

    private static separateTokenFromPrefix(authorization: string) {
        return authorization.startsWith(TOKEN_PREFIX)
            ? authorization.substring(TOKEN_PREFIX.length)
            : ''; // If not prefix present, empty returned
    }
}
