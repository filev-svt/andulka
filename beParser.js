const request = require('request');
const cheerio = require('cheerio');
const xlsx = require('node-xlsx');
const fs = require('fs');
const Excel = require('exceljs');



//zpracování 
const icoListParsed = xlsx.parse(fs.readFileSync('./icoList.xlsx'));

const icoListElements = icoListParsed[0].data;



// modelová funkce pro parsování html pomocí cheerio a request

async function getData(icoNumber, callback) {

    if (icoNumber.length < 8) {
        var missingZeroes = 8 - icoNumber.length;
        switch (missingZeroes) {
            case 1:
                icoNumber = "0" + icoNumber;
                break;
            case 2:
                icoNumber = "00" + icoNumber;

                break;
            case 3:
                icoNumber = "000" + icoNumber;

                break;
            case 4:
                icoNumber = "0000" + icoNumber;
                break;
            default:
                break;
        }
        console.log(icoNumber);
    }

    request("https://or.justice.cz/ias/ui/rejstrik-$firma?ico="+ encodeURIComponent(icoNumber), function (error, response, body) {
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
            return(results);
        }
    });
}

const sampleData = ({
    nazev: 'Andulka services s.r.o.',
    ico: '28136659',
    spisovaZnacka: 'C 19537 vedená u Krajského soudu v Českých Budějovicích',
    denZapisu: '8. dubna 2011',
    sidlo: 'České Budějovice - České Budějovice 6, Žižkova tř. 309/12, PSČ 37001',
})


//mock funkce, kvůli limitům dotazů na IČO!!!

icoListElements.forEach(order => {


    var workbook = new Excel.Workbook();

        workbook.xlsx.readFile('./faktura.xlsx')
            .then(async function() {
    
                // mock data, kvůli limitu požadavků při testování
                var worksheet = workbook.getWorksheet('Faktura plátce DPH - text');
                
                worksheet.getCell('C6').value = getData["Název subjektu:"];
                worksheet.getCell('I6').value = await data["Název subjektu:"];
    
    
                var adresaDodavatel = await data["Sídlo:"].split(',');
                var adresaOdberatel = await data["Sídlo:"].split(',');
    
                worksheet.getCell('C8').value = adresaOdberatel[0];
                worksheet.getCell('C9').value = adresaOdberatel[1];
                worksheet.getCell('C10').value = adresaOdberatel[2];
    
                worksheet.getCell('I8').value = adresaDodavatel[0];
                worksheet.getCell('I9').value = adresaDodavatel[1];
                worksheet.getCell('I10').value = adresaDodavatel[2];
    
                //reálná data
                //odběratel
                worksheet.getCell('C12').value = order[1];
                //dodavatel
                worksheet.getCell('I12').value = order[0];
                //vložení ceny
                worksheet.getCell('I25').value = order[2];
    
                //vložení detailů o vystavení
                worksheet.getCell('I25').value = order[2];
                worksheet.getCell('I25').value = order[2];
                worksheet.getCell('I25').value = order[2];
    
    
                //opět mock data
                worksheet.getCell('C44').value = await data["Sídlo:"];
                worksheet.getCell('C45').value = '123 456 789';
                worksheet.getCell('C46').value = 'andulka@gmail.com';
                worksheet.getCell('C47').value = 'www.andulka.cz';
    
                worksheet.getRow(6).commit();
                worksheet.getRow(8).commit();
                worksheet.getRow(9).commit();
                worksheet.getRow(10).commit();
                worksheet.getRow(12).commit();
                worksheet.getRow(25).commit();
                worksheet.getRow(44).commit();
                worksheet.getRow(45).commit();
                worksheet.getRow(46).commit();
                worksheet.getRow(47).commit();
    
                //vygenerování unikátní faktury
                return workbook.xlsx.writeFile('./faktury/fakturaCislo' + order[0] + '.xlsx');
            })


    
});

