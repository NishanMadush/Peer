const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        // const locale = req.locale.language
        if (err?.code === 11000) {
            err['message'] = 'Duplicate entry';
        }
        return next(err);
    });
};
export default catchAsync;
//# sourceMappingURL=catchAsync.js.map