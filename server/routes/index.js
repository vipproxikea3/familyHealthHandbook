const usersRouter = require('./users');

function router(app) {
    app.use('/api/users', usersRouter);

    app.use('/', (req, res) => {
        res.json({ msg: 'API of project Family Health' });
    });
}

module.exports = router;
