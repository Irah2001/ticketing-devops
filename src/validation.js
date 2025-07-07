const validate = (type_id, email, message) => {
    if (!type_id || !email || !message) {
        return false;
    }
    if (!email.includes('@')) {
        return false;
    }
    return true;
};

module.exports = validate;
