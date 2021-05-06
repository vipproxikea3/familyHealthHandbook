const axios = require('axios').default;

const ncovController = {
    getAll: async (req, res) => {
        axios
            .get('https://corona.lmao.ninja/v2/countries/vn')
            .then(function (response) {
                return res.json(response.data);
            })
            .catch((err) => {
                return res.status(500).json({ msg: err.message });
            });
    },
};

module.exports = ncovController;
