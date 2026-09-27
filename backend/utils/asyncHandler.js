
export function asyncHandler(cb) {
    return (req, res, next) => {
        Promise.resolve(cb(req, res, next)).catch(next)
    }
}
