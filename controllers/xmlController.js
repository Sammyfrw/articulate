//Module setup
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({explicitArray: false});

//Controller function definition
var parseXml = (xml) => {
  return new Promise(function (resolve, reject) {
    xmlParser.parseString(xml, function(err, result){
      if (err) {
        console.dir("XML parsing Error: %s", err);
      } else {
        console.dir("Returning resolved result: " + result );
        return resolve (result);
      }
    });
  });
}

module.exports = {
  parseXml
};
