const request = require('request');
const cheerio = require('cheerio');

// modelová funkce pro parsování html pomocí cheerio a request,
// zdroj https://www.tomas-dvorak.cz/posts/nacitani-dat-z-obchodniho-rejstriku-justicecz/ , autor Tomáš Dvořák

function getData(icoNumber, callback) {
    request("https://or.justice.cz/ias/ui/rejstrik-$firma?ico=" + encodeURIComponent(icoNumber), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var results = [];
            $ = cheerio.load(body);
            $(".search-results li.result").each(function (i, elem) {
                var company = {};
                $(elem).find("th").each(function (j, cell) {
                    var key = $(cell).text().trim();
                    company[key] = $(cell).next().text().trim();
                });
                results.push(company);
            });
            callback(results);
        } 
    });
}

getData("4932331", (data) => {
    console.log(data);
})