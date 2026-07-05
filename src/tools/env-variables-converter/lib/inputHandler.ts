import yaml from 'yaml';
import _ from 'lodash';
import { Formats } from './formats';

function setAcc(acc: any, ...args: any[]) {
  const [path, value] = args;
  _.set(acc, path, value);
}

function inputHandler(type: Formats, text: string) {
  let data;
  if (type === Formats.YAML) {
    // https://github.com/jusufazer/yaml2properties/blob/master/src/scripts/processor.js
    data = yaml.parse(text);
    if (typeof data !== 'object') {
      throw new TypeError('I could be wrong, but YAML doesn\'t seem valid.');
    }
  }
  else if (type === Formats.PROPERTIES) {
    // const flattened = deflated.join("\r\n")
    data = text
      .split('\n') // divides lines
      .filter(Boolean) // removes empty lines
      .reduce((acc: any, line: any) => {
        if (line.includes('=')) {
          // https://stackoverflow.com/a/4607799/1098564
          setAcc(acc, ...line.split(/=(.+)/));
        }
        else if (line.includes(': ')) {
          setAcc(acc, ...line.split(/: (.+)/));
        }
        else {
          throw new Error('Doesn\'t look like a valid .properties file');
        }
        return acc;
      }, {});
  }
  else if (type === Formats.SIMPLE) {
    data = text
      .split('\n') // divides lines
      .filter(Boolean) // removes empty lines
      .reduce((acc: any, line: any) => {
        setAcc(acc, ...line.split('='));
        return acc;
      }, {});
  }
  else if (type === Formats.TERMINAL) {
    data = text
      .split(' ') // divides lines
      .filter(Boolean) // removes empty lines
      .reduce((acc: any, line: any) => {
        setAcc(acc, ...line.split('='));
        return acc;
      }, {});
  }
  else if (type === Formats.KUBERNETES) {
    data = text
      .replace(/>-/gm, '')
      .replace(/(\r\n|\n|\r)/gm, '')
      .trim()
      .split('- name: ') // divides lines
      .filter(Boolean) // removes empty lines
      .reduce((acc: any, line: any) => {
        const pair = line.split('  value: ');
        if (pair[1]) {
          pair[1] = pair[1]
          // trim single quotes at beginning and end
            .replace(/^['](.+(?=[']$))[']$/, '$1') // https://stackoverflow.com/a/19156197/1098564
          // trim out double quotes (TODO: this needs improvement and is definitely bug prone...but works for most simple values I come across)
            .replace(/"([^"]+(?="))"/g, '$1');
        }
        setAcc(acc, ...pair);
        return acc;
      }, {});
  }
  else {
    throw new Error('Unsupported input type');
  }
  // https://stackoverflow.com/a/33510710/1098564
  data = JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g, '"'));
  return data;
}

export default inputHandler;
