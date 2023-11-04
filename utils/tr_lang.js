// https://gist.github.com/sthobis/c52644d079051bc6456c4b20668db813#file-google-translate-language-codes

const languages = {
    af: "Afrikaans",
    sq: "Albanian",
    ar: "Arabic",
    az: "Azerbaijani",
    eu: "Basque",
    bn: "Bengali",
    be: "Belarusian",
    bg: "Bulgarian",
    ca: "Catalan",
    "zh-CN": "Chinese Simplified",
    "zh-TW": "Chinese Traditional",
    hr: "Croatian",
    cs: "Czech",
    da: "Danish",
    nl: "Dutch",
    en: "English",
    eo: "Esperanto",
    et: "Estonian",
    tl: "Filipino",
    fi: "Finnish",
    fr: "French",
    gl: "Galician",
    ka: "Georgian",
    de: "German",
    el: "Greek",
    gu: "Gujarati",
    ht: "Haitian Creole",
    iw: "Hebrew",
    hi: "Hindi",
    hu: "Hungarian",
    is: "Icelandic",
    id: "Indonesian",
    ga: "Irish",
    it: "Italian",
    ja: "Japanese",
    kn: "Kannada",
    ko: "Korean",
    la: "Latin",
    lv: "Latvian",
    lt: "Lithuanian",
    mk: "Macedonian",
    ms: "Malay",
    mt: "Maltese",
    no: "Norwegian",
    fa: "Persian",
    pl: "Polish",
    pt: "Portuguese",
    ro: "Romanian",
    ru: "Russian",
    sr: "Serbian",
    sk: "Slovak ",
    sl: "Slovenian",
    es: "Spanish",
    sw: "Swahili",
    sv: "Swedish",
    ta: "Tamil",
    te: "Telugu ",
    th: "Thai",
    tr: "Turkish",
    uk: "Ukrainian",
    ur: "Urdu",
    vi: "Vietnamese",
    cy: "Welsh",
    yi: "Yiddish",
  };
  
  const languageCodesToLowerCase = Object.keys(languages).reduce((acc, key) => {
    acc[key] = languages[key].toLowerCase();
    return acc;
  }, {});
  
  module.exports = () => {
    return Object.keys(languages).map((key) => {
      return {
        code: key,
        name: languages[key],
        matchName: languages[key].toLowerCase(),
      };
    });
  };
  
  function findLangName(languageCode) {
    return languageCodesToLowerCase[languageCode] || 'Language not found';
  }
  
  module.exports.findLangName = findLangName;
  