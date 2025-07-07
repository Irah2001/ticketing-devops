const validate = (name, email) => {
    if (!name || !email) {
        return false;
    }
    if (!email.includes('@')) {
        return false;
    }
    return true;
};

module.exports = validate;