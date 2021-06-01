const usersRouter = require('./users');
const newsRouter = require('./news');
const ncovRouter = require('./ncov');
const sicknessRouter = require('./sickness');

function router(app) {
    app.use('/api/users', usersRouter);
    app.use('/api/news', newsRouter);
    app.use('/api/ncov', ncovRouter);
    app.use('/api/sicknesses', sicknessRouter);

    app.use('/', (req, res) => {
        res.json({ msg: 'API of project Family Health' });
    });
}

module.exports = router;
