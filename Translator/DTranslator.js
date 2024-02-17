var axios = require('axios');
var deeplBaseUrl = "https://www2.deepl.com/jsonrpc";

function initData(source, target, text) {
  return {
    jsonrpc: "2.0",
    method: "LMT_handle_texts",
    params: {
      splitting: "newlines",
      lang: {
        source_lang_user_selected: source,
        target_lang: target,
      },
      texts: [
        {
          text,
          requestAlternatives: 3,
        },
      ],
    },
  };
}

function getRandomNumber() {
  const rand = Math.floor(Math.random() * 99999) + 100000;
  return rand * 1000;
}

function getICount(translate_text) {
  return translate_text.split("i").length - 1;
}

function getTimeStamp(iCount) {
  const ts = Date.now();
  if (iCount !== 0) {
    iCount = iCount + 1;
    return ts - (ts % iCount) + iCount;
  } else {
    return ts;
  }
}

function getDeeplJsonText(post_data) {
  var id = post_data.id;
  let post_str = JSON.stringify(post_data);
  if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
    post_str = post_str.replace('"method":"', '"method" : "');
  } else {
    post_str = post_str.replace('"method":"', '"method": "');
  }
  return post_str;
}

async function Translate(source, target, text) {

  const post_data = initData(source, target, text);
  post_data.id = getRandomNumber();
  post_data.params.timestamp = getTimeStamp(getICount(text));
  let post_str = getDeeplJsonText(post_data);

  try {
    const response = await axios.post(deeplBaseUrl, post_str, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        anonymous: true,
        nocache: true,
      },
    });

    if (response.status === 200) {
      return response.data.result.texts[0].text;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    throw new Error(`Request failed: ${error}`);
  }
}

module.exports = Translate;