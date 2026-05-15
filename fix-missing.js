const fs = require('fs');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), { encoding: 'utf8' });
}

function ensureRankingKeys(data, locale) {
  if (!data.ranking) data.ranking = {};
  if (!data.ranking.season) data.ranking.season = {};
  if (!data.ranking.rewardPreview) data.ranking.rewardPreview = {};
  if (!data.ranking.hallOfFame) data.ranking.hallOfFame = {};

  if (locale === 'vi') {
    data.ranking.season.endLabel = '\u004B\u1EBF\u0074\u0020\u0054\u0068\u00FA\u0063\u0020\u0053\u0061\u0075';
    data.ranking.season.days = '\u004E\u0067\u00E0\u0079';
    data.ranking.season.hours = '\u0047\u0069\u1EDD';
    data.ranking.season.minutes = '\u0050\u0068\u00FA\u0074';
    data.ranking.season.seconds = '\u0047\u0069\u00E2\u0079';
    data.ranking.rewardPreview.viewAll = '[-] \u0058\u0065\u006D\u0020\u0054\u1EA5\u0074\u0020\u0043\u1EA3\u0020\u0050\u0068\u1EA7\u006E\u0020\u0054\u0068\u01B0\u1EDF\u006E\u0067';
    data.ranking.hallOfFame.viewAll = '\u0058\u0065\u006D\u0020\u0054\u1EA5\u0074\u0020\u0043\u1EA3';
  } else if (locale === 'en') {
    data.ranking.season.endLabel = '\u0045\u006E\u0064\u0073\u0020\u0049\u006E';
    data.ranking.season.days = '\u0044\u0061\u0079\u0073';
    data.ranking.season.hours = '\u0048\u006F\u0075\u0072\u0073';
    data.ranking.season.minutes = '\u004D\u0069\u006E\u0075\u0074\u0065\u0073';
    data.ranking.season.seconds = '\u0053\u0065\u0063\u006F\u006E\u0064\u0073';
    data.ranking.rewardPreview.viewAll = '[-] \u0056\u0069\u0065\u0077\u0020\u0041\u006C\u006C\u0020\u0052\u0065\u0077\u0061\u0072\u0064\u0073';
    data.ranking.hallOfFame.viewAll = '\u0056\u0069\u0065\u0077\u0020\u0041\u006C\u006C';
  } else if (locale === 'zh') {
    data.ranking.season.endLabel = '\u5269\u4F59\u65F6\u95F4';
    data.ranking.season.days = '\u5929';
    data.ranking.season.hours = '\u5C0F\u65F6';
    data.ranking.season.minutes = '\u5206\u949F';
    data.ranking.season.seconds = '\u79D2';
    data.ranking.rewardPreview.viewAll = '[-] \u67E5\u770B\u6240\u6709\u5956\u52B1';
    data.ranking.hallOfFame.viewAll = '\u67E5\u770B\u5168\u90E8';
  }
}

function ensureOrdersKeys(data, locale) {
  if (!data.orders) data.orders = {};
  if (!data.orders.table) data.orders.table = {};

  if (!data.orders.empty) {
    if (locale === 'vi') data.orders.empty = '\u004B\u0068\u00F4\u006E\u0067\u0020\u0063\u00F3\u0020\u0111\u01A1\u006E\u0020\u0068\u00E0\u006E\u0067';
    if (locale === 'en') data.orders.empty = '\u004E\u006F\u0020\u006F\u0072\u0064\u0065\u0072\u0073\u0020\u0066\u006F\u0075\u006E\u0064';
    if (locale === 'zh') data.orders.empty = '\u6682\u65E0\u8BA2\u5355';
  }

  if (!data.orders.table.gems) {
    if (locale === 'vi') data.orders.table.gems = '\u0047\u0065\u006D\u0073';
    if (locale === 'en') data.orders.table.gems = '\u0047\u0065\u006D\u0073';
    if (locale === 'zh') data.orders.table.gems = '\u5B9D\u77F3';
  }
}

const files = [
  { file: 'messages/vi.json', locale: 'vi' },
  { file: 'messages/en.json', locale: 'en' },
  { file: 'messages/zh.json', locale: 'zh' }
];

for (const { file, locale } of files) {
  const data = readJson(file);
  ensureRankingKeys(data, locale);
  ensureOrdersKeys(data, locale);
  writeJson(file, data);
  console.log('updated:', file);
}

