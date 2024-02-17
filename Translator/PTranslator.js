var uuid = require('uuid');
var crypto = require('crypto');
var fs = require('fs');
var axios = require('axios');

var dvId = uuid.v1();
var mainURL = 'https://papago.naver.com/';
var translateURL = mainURL + 'apis/n2mt/translate';

function GetVersion() {
    return JSON.parse(fs.readFileSync('data.json', 'utf-8')).PPGversion;
}

async function SetVersion() {
    var data = (await axios.get(mainURL)).data;
    var scriptUrl = mainURL + "main." + data.match(/"\/main.([^"]+)"/)[1];
    var data = (await axios.get(scriptUrl)).data;
    var version = "v1." + data.match(/"v1.([^"]+)"/)[1];
    var json = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    json.PPGversion = version;
    fs.writeFileSync('data.json', JSON.stringify(json));
}

function GetAuthoriziation(deviceId, url, timestamp) {
    var hmac = crypto.createHmac('md5', GetVersion());
    var data = hmac.update(deviceId + '\n' + url + '\n' + timestamp);
    var result = data.digest('base64');
    return result;
}
async function Translate(source, target, text) {
    var versionSet = false;
    while (1) {
        var timestamp = (new Date).getTime();
        try {
            const response = await axios.post(translateURL,
                {
                    'deviceId': dvId,
                    'locale': 'ko',
                    'dict': false,
                    'dictDisplay': 0,
                    'honorific': false,
                    'instant': false,
                    'paging': false,
                    'source': source,
                    'target': target,
                    'text': text
                }, {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Language': 'ko',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': mainURL,
                    'Referer': mainURL,
                    'Timestamp': timestamp,
                    'Authorization': `PPG ${dvId}:${GetAuthoriziation(dvId, translateURL, timestamp)}`,
                }
            });

            if (response.status === 200) {
                return response.data.translatedText;
            } else {
                if (!versionSet) {
                    await SetVersion();
                    versionSet = true;
                    continue;
                } else throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            if (!versionSet) {
                await SetVersion();
                versionSet = true;
                continue;
            } else throw new Error(`Request failed: ${error}`);
        }
    }
}
module.exports = Translate;