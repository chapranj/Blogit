const requireRole = (role) => {
    return async (req, res, next) => {
        try {
            console.log(req.user.role)
            if (req.user.role !== 'admin' && req.user.role !== role) {
                console.log('error!')
                return res.status(403).json({ error: 'Unauthorized' });
            }
            next();
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' })
        }
    }
}

module.exports = requireRole;