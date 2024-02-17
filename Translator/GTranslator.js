var axios = require('axios');

var tokenUrl = "https://translate.google.com";
var newGoogleUrl =
    "https://translate.google.com/_/TranslateWebserverUi/data/batchexecute";
var token;
var tokenTTL = 60 * 60 * 1000; //1hour

async function getToken() {
    if (token && token.time + tokenTTL > Date.now()) {
        return token;
    }
    var res = (await axios.get(tokenUrl)).data;
    var sid = res.match(/"FdrFJe":"(.*?)"/)[1];
    let bl = res.match(/"cfb2h":"(.*?)"/)[1];
    let at = res.match(/"SNlM0e":"(.*?)"/)?.[1] || "";
    var time = Date.now();
    token = { sid, bl, at, time };
    return token;
}

async function Translate(source, target, text) {
    var { sid, bl, at } = await getToken();

    let req = JSON.stringify([
        [
            [
                "MkEWBc",
                JSON.stringify([[text, source, target, true], [null]]),
                null,
                "generic",
            ],
        ],
    ]);
    const response = await axios.post(newGoogleUrl, new URLSearchParams({
        "f.req": req,
        at,
      }), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        params: {
          rpcids: "MkEWBc",
          "source-path": "/",
          "f.sid": sid,
          bl,
          hl: "ko",
          "soc-app": 1,
          "soc-platform": 1,
          "soc-device": 1,
          _reqid: Math.floor(10000 + 10000 * Math.random()),
          rt: "c",
        },
      });
    
    
    if (response.status === 200) {
        var json = JSON.parse(JSON.parse(/\[.*\]/.exec(response.data))[0][2]);
        var translatedText = json[1][0][0][5]
        .map((text) => text?.[0])
        .filter((text) => text)
        .join(" ");
        return translatedText;
    } else {
        throw new Error(`Request failed with status ${response.status}`);
    }
}

module.exports = Translate;