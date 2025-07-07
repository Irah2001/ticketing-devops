const validate = require('../../src/validation');

describe('Form Validation', () => {
    test('should return false if name is empty', () => {
        expect(validate('', 'test@test.com')).toBe(false);
    });

    test('should return false if email is empty', () => {
        expect(validate('test', '')).toBe(false);
    });

    test('should return false if email is invalid', () => {
        expect(validate('test', 'test')).toBe(false);
    });

    test('should return true if name and email are valid', () => {
        expect(validate('test', 'test@test.com')).toBe(true);
    });
});