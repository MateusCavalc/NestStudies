import { IsString, IsEmail, IsAlpha, isNotEmpty, IsNotEmpty } from 'class-validator';
import { Validatable } from '../../validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

class StubRules {
    @IsAlpha()
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;

    constructor(data: any) {
        Object.assign(this, data);
    }
}

class StubValidator extends Validatable<StubRules> { }

describe('Validator integration tests', () => {
    let stubValidator: StubValidator;

    it('Should validate props without errors using rules', () => {
        stubValidator = new StubValidator(
            new StubRules({
                name: "nomeName",
                email: "someEmail@email.com",
            })
        );

        expect(() => stubValidator.validate()).not.toThrow();
        expect(stubValidator.errors).toBeNull();
    });

    it('Should validate props with errors (name empty) using rules', () => {
        stubValidator = new StubValidator(
            new StubRules({
                email: "someEmail@email.com",
            })
        );

        expect(() => stubValidator.validate()).toThrowError(EntityValidationError);
        expect(stubValidator.errors).not.toBeNull();

        expect(stubValidator.errors).toStrictEqual({
            name: [
                'name should not be empty',
                'name must be a string',
                'name must contain only letters (a-zA-Z)',
            ]
        });
    });

    it('Should validate props with errors (email not valid) using rules', () => {
        stubValidator = new StubValidator(
            new StubRules({
                name: "nomeName",
                email: "someInvalidEmail@email",
            })
        );

        expect(() => stubValidator.validate()).toThrowError(EntityValidationError);
        expect(stubValidator.errors).not.toBeNull();

        expect(stubValidator.errors).toStrictEqual({
            email: ['email must be an email']
        });
    });

});
