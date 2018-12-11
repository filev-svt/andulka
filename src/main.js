const fs = require('fs');
const xlsx = require('node-xlsx');
const Excel = require('exceljs');
const request = require('request');
const cheerio = require('cheerio');

const rp = require('request-promise');

// var options = {
//     uri: "https://rejstrik-firem.kurzy.cz/hledej/?s=" + encodeURIComponent(icoNumber) + "&r=True",
//     transform: function (body) {
//         return cheerio.load(body);
//     }
// };
 
// rp(options)
//     .then(function ($) {
//         // Process html like you would with jQuery...
//     })
//     .catch(function (err) {
//         // Crawling failed or Cheerio choked...
//     });

const icoListParsed = xlsx.parse(fs.readFileSync('../icoList.xlsx'));
const icoListElements = icoListParsed[0].data;


async function loopIcoList() {
  
  for (let ico of icoListElements) {
    
    ico[0] = await checkLength(String(ico[0]));
    ico[1] = await checkLength(String(ico[1]));
    
    if(ico[0] === "x" || ico[1] === "x") {

    } else {
        await generateXlsx(ico[0], ico[1], ico[2]);
    }
  }
}



function checkLength(string, string2) {
    if (string.length < 8) {
        while (string.length < 8) {
            string = "0"+string;
        }

        return string;

    } else if (string.length > 8) {

        string = "x"
        return string;

    } else if (string.length == 8) {

        return string;

    }
}



async function generateXlsx(odberatel, dodavatel, cena) {
    var workbook = new Excel.Workbook();

    workbook.xlsx.readFile('../faktura.xlsx')
        .then(async function() {


            const dataOdberatel = await parseEntity(odberatel);
            const dataDodavatel = await parseEntity(dodavatel);

            const adresaOdberatel = await dataOdberatel.sidlo.split(',')
            const adresaDodavatel = await dataDodavatel.sidlo.split(',');

            var worksheet = workbook.getWorksheet('Faktura plátce DPH - text');
            
            worksheet.getCell('C6').value = dataDodavatel.nazev;
            worksheet.getCell('I6').value = dataOdberatel.nazev;


            worksheet.getCell('C8').value = adresaOdberatel[0];
            worksheet.getCell('C9').value = adresaOdberatel[1];
            worksheet.getCell('C10').value = adresaOdberatel[2];

            worksheet.getCell('I8').value = adresaDodavatel[0];
            worksheet.getCell('I9').value = adresaDodavatel[1];
            worksheet.getCell('I10').value = adresaDodavatel[2];

            worksheet.getCell('I25').value = cena;

            worksheet.getCell('C44').value = 'Andulka s.r.o.';
            worksheet.getCell('C45').value = '123 456 789';
            worksheet.getCell('C46').value = 'andulka@gmail.com';
            worksheet.getCell('C47').value = 'www.andulka.cz';

            let rows = [6,8,9,10,12,25,44,45,46,47];

            rows.forEach(element => {
                worksheet.getRow(element).commit();
            });

            return workbook.xlsx.writeFile('../faktury/fakturaCislo' + dodavatel + odberatel + '.xlsx');

        })
}

async function parseEntity(icoNumber) {
    request("https://rejstrik-firem.kurzy.cz/hledej/?s=" + encodeURIComponent(icoNumber) + "&r=True", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            
            var $ = cheerio.load(body);
            var nazev = $("span[itemProp='legalName']").text();
            var sidlo = $("span[itemProp='address']").text();
            var dic = $("span[itemProp='vatID']").text();

            if(nazev==='') {
                nazev = "Kappa"
            }
            if (sidlo==='') {
                sidlo = "asdifjkldsaf, lkasjdflkasjdf, lajshdjfkasjdf, asjdl,"
            }
            if (dic==='') {
                dic = "Neni k dispozici"
            }


            const data = ({
                nazev: nazev,
                ico: icoNumber,
                sidlo: sidlo,
                dic: dic,
            })
            return data;
        }
    })
    


    const sampleData = ({
        nazev: 'Andulka services s.r.o.',
        ico: '28136659',
        spisovaZnacka: 'C 19537 vedená u Krajského soudu v Českých Budějovicích',
        denZapisu: '8. dubna 2011',
        sidlo: 'České Budějovice - České Budějovice 6, Žižkova tř. 309/12, PSČ 37001',
    })
    return sampleData;
}

loopIcoList();