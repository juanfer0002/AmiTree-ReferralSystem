require('../shared/setup-env');

import { Mongoose } from "mongoose";
import TestMongoStart from "../../src/common/start-scripts/mongo-start";
import User from "../../src/model/user.model";
import AuthService from '../../src/services/auth.service';


describe('Customer ', () => {

    let mongoose: Mongoose;
    beforeAll(async () => {
        mongoose = await TestMongoStart();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
    });

    afterEach(async () => {
        await User.deleteMany({}).exec();
    })

    // it("should sign up with new account", async () => {
    //     const account = {
    //         email: "new.email@testing.com",
    //         companyName: "Test company"
    //     } as IAccount;

    //     const result = await AuthService.signUp(account);

    //     expect(result._id).toBeTruthy();
    //     expect(mailMock.mock.calls.length).toEqual(1);

    //     const foundAccount = await Account.findOne({ email: account.email }).exec()
    //     expect(foundAccount).toBeTruthy();
    // });

    // it("should sign up with existing account with no master user already", async () => {
    //     const account = {
    //         email: "test.email@testing.com",
    //         companyName: "Test company",
    //     } as IAccount;

    //     const savingAccount = new Account(account);
    //     await savingAccount.save();

    //     const result = await AuthService.signUp(account);

    //     expect(result._id).toEqual(savingAccount._id);
    //     expect(mailMock.mock.calls.length).toEqual(1);
    // });

});