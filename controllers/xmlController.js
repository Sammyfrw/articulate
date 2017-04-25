const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({explicitArray: false});

//Controller function definition
var parseXml = (xml) => {
  xmlParser.parseString(xml), function (err, result) {
    return result
  }
}

module.exports = {
  parseXml
};
