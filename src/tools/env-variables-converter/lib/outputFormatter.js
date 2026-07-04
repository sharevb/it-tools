import YAML from 'yaml';
import _ from 'lodash';
import { Formats } from './formats';

function outputFormatter(outputType, properties) {
  if (outputType === Formats.SIMPLE) {
    return simpleFormatter(properties);
  }
  else if (outputType === Formats.TERMINAL) {
    return terminalFormatter(properties);
  }
  else if (outputType === Formats.KUBERNETES) {
    return kubernetesFormatter(properties);
  }
  else if (outputType === Formats.PROPERTIES) {
    return propertiesFormatter(properties);
  }
  else if (outputType === Formats.YAML) {
    return yamlFormatter(properties);
  }
  else {
    throw new Error(`outputType ${outputType}not supported`);
  }
}

// see https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-external-config-relaxed-binding-from-environment-variables
function getName(property) {
  return property
    .split('=')[0]
    .toUpperCase()
    .replaceAll('-', '')
    .replaceAll('].', '_') // don't do double underscore after list element
    .replaceAll('.', '_')
    .replaceAll('[', '_')
    .replaceAll(']', '_');
}

function getValue(property) {
  return (property.split('=')[1])
    .replace(/^["'](.+(?=["']$))["']$/, '$1');
}

function simpleFormatter(properties) {
  let result = '';
  properties.forEach((property) => {
    result = result
      .concat(getName(property))
      .concat('=')
      .concat(getValue(property))
      .concat('\n');
  });
  return result;
}

function terminalFormatter(properties) {
  let result = '';
  properties.forEach((property) => {
    result = result
      .concat(getName(property))
      .concat('=')
      .concat(getValue(property))
      .concat(' ');
  });
  return result;
}

function kubernetesFormatter(properties) {
  let result = '';
  properties.forEach((property) => {
    result = result
      .concat('- name: ')
      .concat(getName(property))
    // .concat('\n  value: \'')
      .concat('\n  value: ')
      .concat(`'${getValue(property)}'`)
    // .concat('\'\n')
      .concat('\n');
  });
  return result;
}

function propertiesFormatter(properties) {
  let result = '';
  properties.forEach((property) => {
    result = result
      .concat(property.split('=')[0])
      .concat('=')
      .concat(property.split('=')[1])
      .concat('\n');
  });
  return result;
}

function yamlFormatter(properties) {
  const result = properties
    .filter(Boolean) // removes empty lines
    .reduce((acc, line) => {
      const pair = line.split('=');
      if (pair[1]) {
        if (pair[1] === 'true') {
          pair[1] = true;
        }
        else if (pair[1] === 'false') {
          pair[1] = false;
        }
      }
      _.set(acc, ...pair);
      return acc;
    }, {});
  return YAML.stringify(result);
}

export default outputFormatter;
