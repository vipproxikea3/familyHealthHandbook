const usersRouter = require('./users');
const newsRouter = require('./news');
const ncovRouter = require('./ncov');
const sicknessRouter = require('./sickness');
const healthRecordsRouter = require('./healthRecord');
const groupsRouter = require('./group');
const postsRouter = require('./post');

function router(app) {
    app.use('/api/users', usersRouter);
    app.use('/api/news', newsRouter);
    app.use('/api/ncov', ncovRouter);
    app.use('/api/sicknesses', sicknessRouter);
    app.use('/api/health-records', healthRecordsRouter);
    app.use('/api/groups', groupsRouter);
    app.use('/api/posts', postsRouter);

    app.use('/', (req, res) => {
        res.json({ msg: 'API of project Family Health' });
    });
}

module.exports = router;
