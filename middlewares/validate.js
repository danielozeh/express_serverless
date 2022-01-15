const validate =  (joi, body = 'body') => {
    return async (req, res, next) => {
        try {
            const {error} = await joi.validateAsync(req[body], {abortEarly: false, allowUnknown: true})
            const valid = error == null
            if (valid) {
                next()
            } else {
                const {details} = error
                const message = details.map(i => i.message && i.message.replace(/['"]/g, '').replace(/mongo/g, '')).join(' and ')
                return res.status(400).send({
                    status: 'failed',
                    message: message
                });
            }
        }catch (e) {
            return res.status(400).send(e.message)
        }
    }
}

module.exports = validate;
