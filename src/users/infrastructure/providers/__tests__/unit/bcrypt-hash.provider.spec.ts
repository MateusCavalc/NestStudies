import { BcryptHashProvider } from "@/users/infrastructure/providers/bcrypt-hash.provider";

describe('Bcrypt Hash Provider unit tests', () => {
    let hashProvider: BcryptHashProvider
    const payload: string = 'something confidential to hash'

    beforeAll(async () => {
        hashProvider = new BcryptHashProvider();
    });

    it('Should nicely hash some payload', async () => {
        const hashResult = await hashProvider.generateHash(payload);

        expect(hashResult).toBeDefined();
        expect(typeof hashResult).toBe('string');
    });

    it('Should nicely compare some payload with its hash', async () => {
        const hashResult = await hashProvider.generateHash(payload);

        expect(hashProvider.compareHash('some wrong payload to compare', hashResult))
            .resolves.toBeFalsy();

        expect(hashProvider.compareHash(payload, hashResult))
            .resolves.toBeTruthy();

    });

});
