import { parseKeys } from "./parse-key";

export function getRawResultFromSouceData(text: string) {
  let result: any = {};
  // ; 代表一个大项
  const items = text.split('；');
  for (const item of items) {
    let mainKey = item.split("：")[0].trim();
    // bad case.
    if (mainKey === "\"" || mainKey === "") continue;
    // eslint-disable-next-line
    mainKey = mainKey.replace(/\"/g, "")

    if (!result[mainKey]) {
      result[mainKey] = {};
    }

    try {
      const keyValues = item.split("：")[1].trim();
      const subItems = keyValues.split('，');
      for (let i = 0; i < subItems.length; i += 2) {
        let subKey = subItems[i].trim();
        subKey = subKey.replace(/#/g, "");
        result[mainKey][subKey] = subItems[i + 1].trim();
      }
    } catch (e) {
      console.error(e);
      throw new Error(e);
    }
  }
  return result;
}

/**
 * 把提取到的 object 按默认的 keys 排序
 * 没有 keys 的顺序，通通按空处理；
 */
export function handleResultOrder(result: any) {
  const keys = Object.keys(result);
  const newResult: any = {};

  const fatternResult: any = {};
  // 结果拍平
  for (const key of keys) {
    const mainItem = result[key] || {};
    Object.assign(fatternResult, mainItem);
  }

  // 重新设置排序
  for (const item of parseKeys) {
    newResult[item] = fatternResult[item] || "空";
  }

  // for (const key of keys) {
  //   const mainItem = result[key] || {};
  //   const order = parseKeys[key];
  //   if (!order) continue;
  //   newResult[key] = {};

  //   // 重新设置排序
  //   for (const item of order) {
  //     newResult[key][item] = mainItem[item] || "空";
  //   }
  // }
  return newResult;
}