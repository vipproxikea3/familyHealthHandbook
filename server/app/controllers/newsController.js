var request = require('request');
var cheerio = require('cheerio');

const newsController = {
    getBySlug: async (req, res) => {
        const slug = req.params.slug;

        request(
            'https://vnexpress.net/suc-khoe/' + slug,
            function (err, response, body) {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                } else {
                    let listNews = [];
                    var $ = cheerio.load(body);
                    $('.item-news').each((index, el) => {
                        const itemTitle = $(el).find(
                            '.item-news .title-news a'
                        );
                        const itemDescription = $(el).find(
                            '.item-news .description a'
                        );
                        let news = {
                            title: itemTitle.text(),
                            url: itemTitle.attr('href'),
                            description: itemDescription.text(),
                        };

                        if (news.url != undefined) listNews.push(news);
                    });

                    res.json(listNews);
                }
            }
        );
    },
    getAll: async (req, res) => {
        request(
            'https://vnexpress.net/suc-khoe',
            function (err, response, body) {
                if (err) {
                    return res.status(500).json({ msg: err.message });
                } else {
                    let listNews = [];
                    var $ = cheerio.load(body);
                    $('.item-news').each((index, el) => {
                        const itemTitle = $(el).find(
                            '.item-news .title-news a'
                        );
                        const itemDescription = $(el).find(
                            '.item-news .description a'
                        );
                        let news = {
                            title: itemTitle.text(),
                            url: itemTitle.attr('href'),
                            description: itemDescription.text(),
                        };

                        if (news.url != undefined) listNews.push(news);
                    });

                    res.json(listNews);
                }
            }
        );
    },
};

module.exports = newsController;
