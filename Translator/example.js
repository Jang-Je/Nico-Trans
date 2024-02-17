var PTranslator = require('./PTranslator.js');

(async () => {
    try {
      const translatedText = await PTranslator('ko', 'en', '안녕하세요?');
      console.log(translatedText);
    } catch (error) {
      console.error(error.message);
    }
  })();