/**
 * Copyright reelyActive 2022-2025
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
    case '59':
      return processTemperatureHumidityPmCo2HchoTvoc(buf);
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


/**
 * Process temperature, humidity, PM, CO2, HCHO and TVOC data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processTemperatureHumidityPmCo2HchoTvoc(data) {
  let relativeHumidity = utils.processRelativeHumidity(data.readUInt8(0));
  let temperature = (data.readUInt16BE(1) >> 6) / 10;
  let pm = {};
  pm['10'] = (data.readUInt16BE(2) >> 5) & 0x1ff;
  pm['2.5'] = (data.readUInt16BE(3) >> 4) & 0x1ff;
  pm['1.0'] = (data.readUInt16BE(4) >> 3) & 0x1ff;
  let formaldehydeConcentration = ((data.readUInt16BE(5) >> 3) & 0x7ff) / 1000;
  let volatileOrganicCompoundsConcentration = data.readUInt16BE(7) / 1000;
  let carbonDioxideConcentration = (data.readUInt16BE(9) >> 2);

  let processedData = {};
  if(relativeHumidity) { processedData.relativeHumidity = relativeHumidity; }
  if(temperature <= 80) { processedData.temperature = temperature; }
  if(pm['10'] < 511) { processedData['pm10'] = pm['10']; }
  if(pm['2.5'] < 511) { processedData['pm2.5'] = pm['2.5']; }
  if(pm['1.0'] < 511) { processedData['pm1.0'] = pm['1.0']; }
  if(formaldehydeConcentration <= 2.000) {
    processedData.formaldehydeConcentration = formaldehydeConcentration;
  }
  if(volatileOrganicCompoundsConcentration <= 65.000) {
    processedData.volatileOrganicCompoundsConcentration =
                                         volatileOrganicCompoundsConcentration;
  }
  if(carbonDioxideConcentration <= 10000) {
    processedData.carbonDioxideConcentration = carbonDioxideConcentration;
  }

  return processedData;
}


module.exports.process = process;
