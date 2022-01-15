module.exports = app => {
    const auth = require("../fauna");

    var router = require("express").Router();

    const { register, login } = require("../validations/auths");
    const validate = require("../middlewares/validate");

    router.post('/sign-up', validate(register), auth.createUser);
    router.post('/login', validate(login), auth.loginUser);

    app.use('/api/auth', router)
}