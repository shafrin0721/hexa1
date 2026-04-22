// Email validation
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

// Phone validation
const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

// Price validation
const validatePrice = (price) => {
    return !isNaN(price) && price > 0;
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,
    validatePrice,
};
