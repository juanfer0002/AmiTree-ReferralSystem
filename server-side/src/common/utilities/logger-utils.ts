import winston from 'winston';

const DEPLOYMENT_TYPE = process.env.DEPLOYMENT_TYPE || 'dev';
const ENABLE_CONSOLE_LOG = !!process.env.ENABLE_CONSOLE_LOG;
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const LOG_PATH_LOCATION = process.env.LOG_PATH || 'logs/';

export class LoggerUtils {

    public static getLogger(service: string) {
        const logger = winston.createLogger({
            level: LOG_LEVEL,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            defaultMeta: { service },
            transports: [
                new winston.transports.File({ filename: LOG_PATH_LOCATION + '/error.log', level: 'error' }),
                new winston.transports.File({ filename: LOG_PATH_LOCATION + '/combined.log' })
            ]
        });

        if (DEPLOYMENT_TYPE == 'dev' || ENABLE_CONSOLE_LOG) {
            logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple(),
                ),
                level: 'debug'
            }));
        }

        return logger;
    }

}
