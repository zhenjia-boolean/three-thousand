const fs = require('fs');

const text = JSON.stringify(fs.readFileSync('./source.txt', 'utf-8'));
const pointKeyOrderObj = JSON.parse(fs.readFileSync('./keys.json', 'utf-8'));
const needRewriteKeys = false;
// 原生 data 的 key 结构，在需要更新 Key 结构的时候才输出；
const rawKeyResult = {};

// 1. 解析数据
let result = getRawResultFromSouceData();
// 2. 按照特定顺序排列好
result = handleResultOrder(result);
// 3. 输出
fs.writeFileSync('./result.json', JSON.stringify(result, null, 4), { encoding: 'utf-8' });
needRewriteKeys && fs.writeFileSync('./keys.json', JSON.stringify(keyResult, null, 4), { encoding: 'utf-8' });

function getRawResultFromSouceData() {
  let result = {};
  // ; 代表一个大项
  const items = text.split('；');
  for (const item of items) {
    let mainKey = item.split("：")[0].trim();
    // bad case.
    if (mainKey === "\"") continue;
    mainKey = mainKey.replace(/\"/g, "")

    if (!result[mainKey]) {
      result[mainKey] = {};
      rawKeyResult[mainKey] = [];
    }

    try {
      const keyValues = item.split("：")[1].trim();
      const subItems = keyValues.split('，');
      for (let i = 0; i < subItems.length; i += 2) {
        let subKey = subItems[i].trim();
        subKey = subKey.replace(/#/g, "");
        result[mainKey][subKey] = subItems[i + 1].trim();
        rawKeyResult[mainKey].push(subKey);
      }
    } catch (e) {
      console.error(e);
      console.log(item);
    }
  }
  return result;
}

/**
 * 把提取到的 object 按默认的 keys 排序
 * 没有 keys 的顺序，通通按空处理；
 */
function handleResultOrder(result) {
  const keys = Object.keys(pointKeyOrderObj);
  const newResult = {};

  for (const key of keys) {
    const mainItem = result[key] || {};
    const order = pointKeyOrderObj[key];
    if (!order) continue;
    newResult[key] = {};

    // 重新设置排序
    for (const item of order) {
      newResult[key][item] = mainItem[item] || "空";
    }
  }
  return newResult;
}
