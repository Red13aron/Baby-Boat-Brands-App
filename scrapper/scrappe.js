const request = require("request");
const cheerio = require("cheerio");

const Scrapper = function() {
  this.scrapper = function(meaning, gender) {
    return new Promise(function(res, rej) {
      request(
        `https://www.babycenter.com/babyNamerSearch.htm?gender=${gender}&includeExclude=ALL&includeLimit=100&excludeLimit=100&meaning=${meaning}&origin=&theme=&startsWith=&endsWith=&containing=&numberOfSyllables=&sort=&batchSize=10000`,
        (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const resultsHeading = $(".resultsHeading")
              .text()
              .trim();

            const oIndex = resultsHeading.indexOf("o");
            //   console.log(oIndex);
            const rIndex = resultsHeading.indexOf("r");
            //   console.log(rIndex);

            const resultsLength = resultsHeading
              .slice(oIndex + 2, rIndex)
              .trim();
            //console.log(resultsLength);

            const bnArray = [];
            //console.log(resultsHeading);
            for (let i = 1; i <= parseInt(resultsLength); i++) {
              const bnResults = $(".babyNameSearchResultsTable")
                .find(`#name_${i}`)
                .text();
              const genderResults = $(".babyNameSearchResultsTable")
                .find(`#name_${i}`)
                .parent()
                .next()
                .children()
                .attr("class")
                .slice(-1);
              let genderBool = null;
              if (genderResults === `M`) {
                genderBool = 0;
              } else {
                genderBool = 1;
              }
              bnArray.push({ bnResults, genderBool });
            }
            return res(bnArray);
          } else {
            rej(error);
          }
        }
      );
    }).catch(error => console.log(error));
  };
};
module.exports = Scrapper;
