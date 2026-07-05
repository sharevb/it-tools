// https://github.com/jusufazer/yaml2properties/blob/master/src/scripts/parser.js
function deflate(json, prefix) {
  let result = [];
  const keys = Object.keys(json);
  keys.forEach((key) => {
    let _prefix;

    let _currPrefix = key;
    if (isNumeric(key)) {
      _currPrefix = `[${_currPrefix}]`;
    }

    if (typeof json[key] === 'object') {
      if (!Array.isArray(json[key])) {
        _currPrefix = _currPrefix.concat('.');
      }
      _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
      result = result.concat(deflate(json[key], _prefix));
    }
    else {
      _prefix = prefix ? prefix.concat(_currPrefix) : _currPrefix;
      result.push(_prefix.concat('=').concat(json[key]));
    }
  });

  return result;
}

function isNumeric(str) {
  if (typeof str != 'string') {
    return false;
  } // we only process strings!
  return !Number.isNaN(Number(str)) // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        && !Number.isNaN(Number.parseFloat(str)); // ...and ensure strings of whitespace fail
};

export default deflate;
