/**
 * Copyright reelyActive 2022-2023
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


const MIN_DATA_LENGTH_BYTES = 3;


/**
 * Process a Multi Function Sensors VLD telegram.
 * @param {String} type The specific type of telegram.
 * @param {Object} data The raw telegram as a hexadecimal-string or Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function process(type, data) {
  let buf = utils.convertToBuffer(data);
  if((buf === null) || (buf.length < MIN_DATA_LENGTH_BYTES)) {
    return null;
  }

  // Reference: http://tools.enocean-alliance.org/EEPViewer/
  switch(type) {
    case '41':
      return processIndoorSmarthomeMultisensor(buf);
    case '50':
      return processBasicWaterPropertiesPH(buf);
    case '51':
      return processBasicWaterPropertiesDissolvedOxygen(buf);
  }

  return null;
}


/**
 * Process indoor smarthome multisensor data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processIndoorSmarthomeMultisensor(data) {
  let temperature = utils.processTemperature10(data.readUInt16BE(0) >> 6);
  let relativeHumidity = utils.processRelativeHumidity(
                                            (data.readUInt16BE(1) >> 6) & 0xff);
  let illuminance = (data.readUIntBE(2, 3) >> 5) & 0x1ffff;
  if(illuminance > 100000) { illuminance = null };
  let accelerationStatus = (data.readUInt8(4) >> 3) & 0x03;
  let isMotionDetected = [ (accelerationStatus !== 0) ];
  let acceleration = [
      utils.processAcceleration10((data.readUInt16BE(4) >> 1) & 0x3ff),
      utils.processAcceleration10((data.readUIntBE(5, 3) >> 7) & 0x3ff),
      utils.processAcceleration10((data.readUIntBE(6, 3) >> 5) & 0x3ff)
  ];
  let contactStatus = (data.readUInt8(8) >> 4) & 0x01;
  let isContactDetected = [ (contactStatus !== 0) ];

  return { temperature: temperature,
           relativeHumidity: relativeHumidity,
           illuminance: illuminance,
           isMotionDetected: isMotionDetected,
           acceleration: acceleration,
           isContactDetected: isContactDetected };
}


/**
 * Process basic water properties pH data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processBasicWaterPropertiesPH(data) {
  let temperature = utils.processTemperature9(data.readUInt16BE(0) >> 7);
  let pH = utils.processPH((data.readUIntBE(1, 2) >> 7) & 0xff);

  return { temperature: temperature, pH: pH };
}


/**
 * Process basic water properties dissolved oxygen data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processBasicWaterPropertiesDissolvedOxygen(data) {
  let temperature = utils.processTemperature9(data.readUInt16BE(0) >> 7);
  let dissolvedOxygen = utils.processDissolvedOxygen(
                                         (data.readUIntBE(1, 2) >> 4) & 0x7ff);

  return { temperature: temperature, dissolvedOxygen: dissolvedOxygen };
}


module.exports.process = process;
