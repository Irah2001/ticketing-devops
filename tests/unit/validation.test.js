const validate = require('../../src/validation');

describe('Form Validation', () => {
    test('should return false if type_id is empty', () => {
        expect(validate('', 'test@test.com', 'message')).toBe(false);
    });

    test('should return false if email is empty', () => {
        expect(validate(1, '', 'message')).toBe(false);
    });

    test('should return false if message is empty', () => {
        expect(validate(1, 'test@test.com', '')).toBe(false);
    });

    test('should return false if email is invalid', () => {
        expect(validate(1, 'test', 'message')).toBe(false);
    });

    test('should return true if type_id, email and message are valid', () => {
        expect(validate(1, 'test@test.com', 'message')).toBe(true);
    });
});