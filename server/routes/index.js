function router(app) {
    app.use('/', (req, res) => {
        res.json({ msg: 'API of project Family Health' });
    });
}

module.exports = router;