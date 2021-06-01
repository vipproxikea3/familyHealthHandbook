const axios = require('axios').default;

const newsController = {
    getAll: async (req, res) => {
        try {
            var result = {
                data: [],
            };
            for (var i = 1; i < 7; i++) {
                const response = await axios.get(
                    'https://vietnamnet.vn/jsx/loadmore/?domain=desktop&c=suc-khoe&p=' +
                        i +
                        '&s=15&a=2'
                );
                data = response.data;
                data = data.slice(data.search('=') + 1, -1);
                data = '{ "data":' + data + '}';
                dataJson = JSON.parse(data);
                result.data = result.data.concat(dataJson.data);
            }

            res.json(result);
        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = newsController;
