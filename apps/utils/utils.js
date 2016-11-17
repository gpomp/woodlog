/**
 * Simple is object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return target;
}

export function compareArrays(a1, a2) {
  if(a1.length !== a2.length) return false;
  for (var i = 0; i < a1.length; i++) {
    if(a1[i] !== a2[i]) return false;
  }
  return true;
}

export function findIDInList (list, id, isOutside = false) {
  if(isNaN(id)) console.error('ID should be an integer', id);
  let aId = -1;
  for (var i = 0; i < list.length; i++) {
    if (parseInt(isOutside ? list[i] : list[i].id, 10) === parseInt(id, 10)) {
      aId = i;
      break;
    }
  }

  return aId;
} 

export function getMaxID(ids) {
  let maxID = -1;
  for (var i = 0; i < ids.length; i++) {
    maxID = Math.max(maxID, ids[i]);
  }

  return maxID;
}