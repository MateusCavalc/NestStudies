import * as libClassValidator from 'class-validator';
import { Validatable } from '../../validator';

class StubValidator extends Validatable<{ field: string }> { }

describe('Validator unit tests', () => {
    let stubValidator: StubValidator;

    beforeEach(() => {
        stubValidator = new StubValidator({ field: 'bla' });
    });

    it('Should validate props without errors', () => {
        expect(stubValidator.validate()).toBeTruthy();
        expect(stubValidator.errors).toBeNull();
    });

    it('Should validate props with errors', () => {

        // Creates a spy structure to see if the 'validateSync' method was called in the validation process
        const spyValidateSync = jest.spyOn(libClassValidator, 'validateSync');
        spyValidateSync.mockReturnValue([
            { property: 'someField', constraints: { isRequired: 'someField is required.' } }
        ]);

        expect(stubValidator.validate()).toBeFalsy();
        expect(spyValidateSync).toBeCalled();
        expect(stubValidator.errors).not.toBeNull();
        expect(stubValidator.errors).toStrictEqual({ 'someField': ['someField is required.'] });
    });

});
