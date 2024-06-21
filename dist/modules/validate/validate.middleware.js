import httpStatus from 'http-status';
import Joi from 'joi';
import ApiError from '../../services/errors/ApiError';
import pick from '../../utils/pick';
const validate = (schema) => (req, _res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    Object.assign(req, value);
    return next();
};
export default validate;
//# sourceMappingURL=validate.middleware.js.map