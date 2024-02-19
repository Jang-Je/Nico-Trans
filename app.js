"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns = require('dns');
var https = require('https');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
var EasyTranslator = require('./Translator/EasyTranslator.js');
var PTranslator = require('./Translator/PTranslator.js');
var DTranslator = require('./Translator/DTranslator.js');
var GTranslator = require('./Translator/GTranslator.js');
var version = '2.0';
var ip = '255.255.255.255';
function isEmpty(text) {
    return text == null || text.match(/^\s*$/) !== null;
} //https://www.nicovideo.jp/watch/sm26561659
exports.isEmpty = isEmpty;
app.use(bodyParser.text());
console.log('');
console.log('NicoNicoTranslator (' + version + '-nodejs)');
console.log('오류 제보 : https://github.com/Jang-Je/Nico-Trans/issues');
console.log('제작자 블로그 : http://sshbrain.tistory.com');
console.log('');
dns.resolve('nv-comment.nicovideo.jp', (err, result) => {
    if (err) {
        console.log('nv-comment.nicovideo.jp의 IP주소를 가져오는데 실패하였습니다.');
        console.error(`에러: ${err}`);
    }
    else {
        console.log('nv-comment.nicovideo.jp : ' + result);
        ip = result;
    }
});
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
if (!(fs.existsSync("./cert/private.key") && fs.existsSync("./cert/cert.crt"))) {
    console.error('인증서가 존재하지 않습니다.');
}
else {
    https.createServer({ key: fs.readFileSync("./cert/private.key"), cert: fs.readFileSync("./cert/cert.crt") }, app).listen(443, function () {
        console.log("HTTPS 서버가 작동 중입니다.");
    });
    app.options('/v1/threads', (req, res) => {

        res.writeHead(200,
            {
                'Access-Control-Allow-Origin': 'https://www.nicovideo.jp',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'x-client-os-type, x-frontend-id, x-frontend-version'
            }).end();
    });
    app.post('/v1/threads', (req, res) => {

        res.writeHead(200,
            {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,HEAD',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'text/json; charset=UTF-8'
            });
        request.post({
            headers: {
                "X-Frontend-Id": "6",
                "X-Frontend-Version": "0",
                "Content-Type": "application/json"
            },
            url: 'http://' + ip + '/v1/threads',
            body: req.body
        }, function (error, response, nmsgbody) {
            return __awaiter(this, void 0, void 0, function* () {
                var jsonbody = JSON.parse(nmsgbody);
                var data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
                var usedTranslator = data.translator;
                var isStudy = data.isStudy;

                if (usedTranslator != 0) {
                    var chats = [];
                    var page = [[]];
                    var mainthread = jsonbody['data']['threads'][1];
                    var easythread = jsonbody['data']['threads'][2];
                    for (var i in mainthread['comments']) {
                        var str = mainthread['comments'][i]['body'].replace(/\n/g, "\u21B5");;
                        if (!isEmpty(str))
                            chats.push(str);
                    }
                    var count = 0;
                    var pagecount = 0;

                    while (true) {
                        for (var strlength = 0; strlength < 4000 && count != chats.length;) {
                            strlength += (chats[count] + "\r\n").length;
                            page[pagecount].push(chats[count++]);
                        }
                        if (count == chats.length) {
                            break;
                        }
                        else {
                            page.push([]);
                            page[pagecount + 1].push(page[pagecount].pop());
                            pagecount++;
                        }
                    }
                    var result = "";
                    count = 0;
                    for (var c = 0; c < page.length; c++) {
                        var temp = "";

                        for (var k = 0; k < page[c].length; k++) {
                            temp += page[c][k] += "\r\n";
                            count++;
                        }
                        if (temp == "") {
                            console.log("번역할 코멘트가 없습니다.");
                            break;
                        }
                        if (c != 0) yield sleep(2000);
                        if (usedTranslator == 1) result += (yield PTranslator('ja', 'ko', temp)) + "\r\n";
                        else if (usedTranslator == 2) result += (yield DTranslator('ja', 'ko', temp)) + "\r\n";
                        else if (usedTranslator == 3) result += (yield GTranslator('ja', 'ko', temp)) + "\r\n";
                        console.log(count + "/" + chats.length + "완료");
                    }
                    var results = result.split(/\r?\n/);
                    c = 0;
                    var sortedchat = []

                    for (var i in mainthread['comments']) {
                        if (!isEmpty(mainthread['comments'][i]['body'])) {
                            sortedchat.push({
                                time: mainthread['comments'][i]['vposMs'],
                                jpchat: mainthread['comments'][i]['body'],
                                krchat: results[c]
                            });
                            jsonbody['data']['threads'][1]['comments'][i]['body'] = results[c++].replace(/\u21B5/gi, "\n");
                        }
                    }
                    if (isStudy == 1) {
                        console.log("-".repeat(100));
                        sortedchat.sort((a, b) => a.time - b.time);
                        for (var i in sortedchat) {
                            var time = Math.floor(sortedchat[i].time / 1000);
                            var minute = Math.floor(time / 60);
                            var second = time % 60;
                            console.log(`[${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}] ${sortedchat[i].jpchat}`);
                            console.log("        " + sortedchat[i].krchat);
                            console.log("")
                        }
                    }
                    try {
                    for (var i in easythread['comments']) {
                        var commentBody = easythread['comments'][i]['body'];
                        if (!isEmpty(commentBody)) {
                            jsonbody['data']['threads'][2]['comments'][i]['body'] = EasyTranslator(commentBody);
                        }
                    }
                } catch (e) {
                    console.log("간편코멘트가 없습니다.");
                }
                }
                if (usedTranslator == 0) console.log("번역하지 않음으로 설정되어 있습니다. (translator : 0)")
                res.write(JSON.stringify(jsonbody));
                res.end();
            });
        });
    });
}