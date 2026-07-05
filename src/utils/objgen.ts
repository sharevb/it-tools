// ! objgen.js
// ! version : 4.0.4
// ! authors : Jim Winfield, js contributors, typescripted by ShareVB
// ! license : AGPL-3.0

const rawLineRegx = /^.*$|\n|$/g;
const newLineRegx = /\n/;
const spacesRegx = /\s/;
const arrayRegx = /\[\s*?([0-9]{1,100})?\s*?\]/;
const typesRegx = /^(\w+)(\s+)(\w+).*?$/;

function isNotUndefined(variable: any) {
  return typeof (variable) !== 'undefined' && variable !== null;
}

export function parseLines(
  val: string,
  options?: { numSpaces?: number },
  callback?: (line: string, depth: number) => void) {
  if (callback === null) {
    return;
  }

  let lastOffset = 0;
  let currentLevel = 1;
  let lines = 0;

  // parse the raw inbound lines, to find individual input lines
  val.replace(rawLineRegx, (match, curOffset) => {
    if (curOffset > lastOffset) {
      // get the current "raw" line
      const raw = val.substring(lastOffset, curOffset).replace(newLineRegx, '');

      if (lines > 0) {
        // glean current level from leading whitespace (tabs or spaces)
        let spaces = 0;
        let level = 1;

        for (let i = 0; i < raw.length; i++) {
          const c = raw.charAt(i);
          if (c === '\t') {
            level++;
            spaces = 0;
          }
          else if (c === ' ') {
            spaces++;
          }
          else {
            break;
          }

          if (spaces === options!.numSpaces) {
            level++;
            spaces = 0;
          }
        }
        currentLevel = level;
      }
      else {
        currentLevel = 1;
      }

      // count and process lines with real values
      const lineText = raw.replace(spacesRegx, '');
      if (lineText.length > 0) {
        lines++;
      }

      if (lineText.length > 0) {
        callback!(raw.trim(), currentLevel);
      }

      // update progress parsing the inbound value
      lastOffset = curOffset;
    }
    return match;
  });
};

function newValueOfType(dataType: string, initialVal: any) {
  if (initialVal === null) {
    initialVal = {};
  }

  let val = initialVal;
  const t = dataType.charAt(0);

  if (t === 's') {
    if (typeof val !== 'string') {
      val = '';
    }
  }
  else if (t === 'b') {
    val = initialVal === 'true';
  }
  else if (t === 'd') {
    const dt = new Date();
    if (initialVal.length > 0) {
      dt.setTime(Date.parse(initialVal));
    }
    val = dt;
  }
  else if (t === 'n') {
    let num;
    if (initialVal.length > 0) {
      num = Number.parseFloat(initialVal);
      if (Number.isNaN(num)) {
        num = Number.parseInt(initialVal);
        if (!Number.isNaN(num)) {
          num = 0;
        }
      }
    }
    else {
      num = 0;
    }
    val = num;
  }
  else {
    val = {};
  }

  return val;
};

function newArrayOfType(dataType: string, initialVal: any) {
  const a: any[] = [];
  if (typeof initialVal === 'string') {
    const vals = initialVal.split(',');
    for (const i in vals) {
      const val = vals[i].trim();
      a[i] = newValueOfType(dataType, val);
    }
  }

  return a;
};

export function ObjGen2Json(val: string, options?: { numSpaces?: number }) {
  const propStack: string[] = [];
  const arrays: Record<any, any> = {};
  const model: Record<any, any> = {};
  let genRoot: Record<any, any> = {};
  const keysep = '__keysep__';

  if (!options) {
    options = {
      numSpaces: 2,
    };
  }
  else if (!isNotUndefined(options.numSpaces)) {
    options.numSpaces = 2;
  }

  // parse the raw inbound lines, to find individual input lines
  parseLines(val, options, (line, depth) => {
    if (line.match('^\s+$/|^\/$|^\/\/|^\s.*\/$|^\s.*\/\/') !== null) {
      return '';
    }

    while (depth !== propStack.length) {
      if (depth > propStack.length) {
        propStack.push('');
      }
      else {
        propStack.pop();
      }
    }

    // Determine the data type being defined at this line level
    const level = depth - 1;
    const arrayInfo = arrayRegx.exec(line);
    const isArray = arrayInfo !== null ? arrayInfo.length > 0 : false;
    let arrayIndex = -1;
    let rootArray = false;

    if (isArray === true) {
      if (level === 0 && line.match(/^\s*?\[.*?$/)) {
        rootArray = true;
      }

      if (arrayInfo!.length > 1) {
        arrayIndex = Number.parseInt(arrayInfo![1]);
      }
    }

    let type = null;

    if (rootArray === true) {
      type = 'object';
    }
    else {
      const typeSearch = typesRegx.exec(line.replace(arrayRegx, ''));
      if (typeSearch !== null && typeSearch.length >= 4) {
        type = typeSearch[3].toLowerCase();
      }
    }

    // Determine if there is a value to assign
    let initialVal = null;

    const eqs = line.indexOf('=');
    if (eqs !== -1) {
      initialVal = line.substring(eqs + 1);
      if (initialVal.length > 0) {
        initialVal = initialVal.trim();
        if (type === null) {
          type = 's';
        }
      }
      line = line.substring(0, eqs);
    }
    else {
      // Create a default initial value
      if (isArray === true) {
        if (arrayIndex > 0) {
          initialVal = {};
        }
        else {
          initialVal = [];
        }
      }
      else {
        initialVal = {};
      }
    }

    // Find the JSON property the line is defining
    let prop = line;

    if (type !== null) {
      if (isArray === true) {
        initialVal = newArrayOfType(type, initialVal);
      }
      else {
        initialVal = newValueOfType(type, initialVal);
      }

      // remove type info from model line
      const propNameRegx = /(^[^\s]+)/;
      const rx = propNameRegx.exec(prop);
      if (rx !== null) {
        prop = rx[0];
      }
    }

    // clean up prop name
    prop = prop.replace(spacesRegx, '');
    prop = rootArray ? '[]' : prop.replace(arrayRegx, '');
    prop = prop.replace(/\[.*|]/g, '');
    propStack[level] = prop;

    // derive prop type key
    let propKey = '';
    for (let k = 0; k < propStack.length; k++) {
      if (k > 0) {
        propKey += keysep;
      }
      propKey += propStack[k];
    }

    if (isArray === true) {
      const arr = Object.hasOwnProperty.call(arrays, propKey) ? arrays[propKey] : { name: prop, length: 0 };

      if (arrayIndex < 0 || Number.isNaN(arrayIndex)) {
        arrayIndex = arr.length;
      }

      arr.length += 1;
      arrays[propKey] = arr;

      const idx = `:${arrayIndex}`;
      propKey += idx;
      propStack[level] += idx;
    }

    // represent model information
    if (!isNotUndefined(model[propKey])) {
      if (rootArray === true && arrayIndex === 0) {
        genRoot = initialVal;
      }

      const parentKey = propKey.substring(0, propKey.lastIndexOf(keysep));
      model[propKey] = {
        name: prop,
        type,
        array: isArray,
        index: arrayIndex > -1 ? arrayIndex : null,
        modelParent: parentKey.length > 0 ? model[parentKey] : null,
        genParent: genRoot,
        val: initialVal,
      };
    }

    // Add the current value into the generated object
    const curProp = model[propKey];
    const modelParent = curProp.modelParent;
    if (modelParent !== null) {
      if (modelParent.array) {
        curProp.genParent = modelParent.genParent[modelParent.name];
        if (!isNotUndefined(curProp.genParent)) {
          curProp.genParent = [];
        }
        if ((curProp.genParent.length < modelParent.index + 1)
            || (Array.isArray(curProp.genParent[modelParent.index]) && curProp.genParent[modelParent.index].length === 0)) {
          curProp.genParent[modelParent.index] = {};
        }
        curProp.genParent = curProp.genParent[modelParent.index];
      }
      else {
        curProp.genParent = modelParent.genParent[modelParent.name];
      }
    }

    if (rootArray && level === 0 && arrayIndex > 0) {
      genRoot[arrayIndex] = {};
    }

    if (curProp.array && arrayIndex > 0) {
      if (!isNotUndefined(curProp.genParent[prop])) {
        curProp.genParent[prop] = [];
        curProp.genParent[prop][0] = curProp.val;
      }
      else {
        curProp.genParent[prop][arrayIndex] = curProp.val;
      }
    }
    else {
      curProp.genParent[prop] = curProp.val;
    }
  });

  return JSON.stringify(genRoot, undefined, options.numSpaces);
};
