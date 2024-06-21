import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { UserStatusEnum } from '../../shared/interfaces/user';
import { User } from './user.model';
describe('User model', () => {
    describe('User validation', () => {
        let newUser;
        beforeEach(() => {
            newUser = {
                username: 'Username_1',
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email().toLowerCase(),
                phoneNumber: '',
                password: 'password1',
                role: 'user',
                status: UserStatusEnum.Pending,
                languageId: new mongoose.Types.ObjectId('6408117eaafbd8fc9c58132d'),
            };
        });
        test('should correctly validate a valid user', async () => {
            await expect(new User(newUser).validate()).resolves.toBeUndefined();
        });
        test('should throw a validation error if email is invalid', async () => {
            newUser.email = 'invalidEmail';
            await expect(new User(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if password length is less than 8 characters', async () => {
            newUser.password = 'passwo1';
            await expect(new User(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if password does not contain numbers', async () => {
            newUser.password = 'password';
            await expect(new User(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if password does not contain letters', async () => {
            newUser.password = '11111111';
            await expect(new User(newUser).validate()).rejects.toThrow();
        });
        test('should throw a validation error if role is unknown', async () => {
            newUser.role = 'invalid';
            await expect(new User(newUser).validate()).rejects.toThrow();
        });
    });
    describe('User toJSON()', () => {
        test('should not return user password when toJSON is called', () => {
            const newUser = {
                name: faker.name.findName(),
                email: faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'user',
            };
            expect(new User(newUser).toJSON()).not.toHaveProperty('password');
        });
    });
});
//# sourceMappingURL=user.model.test.js.map