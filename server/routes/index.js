const usersRouter = require('./users');
const newsRouter = require('./news');

function router(app) {
    app.use('/api/users', usersRouter);
    app.use('/api/news', newsRouter);

    app.use('/', (req, res) => {
        res.json({ msg: 'API of project Family Health' });
    });
}

module.exports = router;
