var fs = require('fs');

const nico_dict = JSON.parse(fs.readFileSync('niconico_dictionary.json', 'utf-8'));
function Translate(text) {
    if(text in nico_dict) return nico_dict[text];
    else return text;
}
module.exports = Translate;