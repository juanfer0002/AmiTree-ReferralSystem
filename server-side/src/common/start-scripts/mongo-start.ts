import mongoose from 'mongoose';
import { LoggerUtils } from '../utilities/logger-utils';
import { DeploymentCheckList } from './deployment-check-list';

const logger = LoggerUtils.getLogger('mongo-start');

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const URL: string = process.env.MONGO_URL;
logger.info('MONGO URL ' + URL);

export default async () => {
    try {
        const mongo = await mongoose.connect(URL);

        logger.info('MongoDB successfully connected!');
        DeploymentCheckList.checkService('mongo');
        
        return mongo;
    } catch (error) {
        throw new Error('Unable to connect to Mongo DB: ' + error.message);
    }
};
