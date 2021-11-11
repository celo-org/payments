import BigNumber from "bignumber.js";

export function sortObject(object): any {
  //Thanks > https://whitfin.io/sorting-object-recursively-node-jsjavascript/
  if (!object) {
    return object;
  }

  const isArray = object instanceof Array;
  var sortedObj = {};
  if (isArray) {
    sortedObj = object.map((item) => sortObject(item));
  } else if (object instanceof BigNumber) {
    return object;
  } else {
    var keys = Object.keys(object);
    keys.sort((key1, key2) => {
      (key1 = key1.toLowerCase()), (key2 = key2.toLowerCase());
      if (key1 < key2) return -1;
      if (key1 > key2) return 1;
      return 0;
    });

    for (var index in keys) {
      var key = keys[index];
      if (typeof object[key] == "object") {
        sortedObj[key] = sortObject(object[key]);
      } else {
        sortedObj[key] = object[key];
      }
    }
  }

  return sortedObj;
}

export function sortTypes(types): any {
  const result = {};
  for (const type of Object.keys(types).sort()) {
    const typeProperties = types[type].sort((a, b) => {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
    result[type] = typeProperties;
  }
  return result;
}

export function sortTypedData(typedData): any {
  const domain = sortObject(typedData.domain);
  const message = sortObject(typedData.message);
  const types = sortTypes(typedData.types);
  const primaryType = typedData.primaryType;

  const result = {
    domain,
    message,
    primaryType,
    types,
  };

  return result;
}
