const auth2FA = (req, res, next) => {
    if (req.session.is2FACompleted) {
        next();
    } else {
        res.status(401).send({ message: '2FA is required to access this route.' });
    }
};

module.exports = auth2FA;
