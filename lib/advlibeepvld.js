/**
 * Copyright reelyActive 2022-2024
 * We believe in an open Internet of Things
 */


const multiFunctionSensors = require('./multifunctionsensors');
const singleSensor = require('./singlesensor');
const acCurrentClamps = require('./accurrentclamps');
const utils = require('./utils');


const RORG_VLD = 'D2';
const MIN_DATA_LENGTH_BYTES = 8;


/**
 * Process EEP variable-length data (VLD) telegrams.
 * @param {String} eepType The EEP type as a string.
 * @param {Object} data The raw telegram data as a hexadecimal-string or Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processVLDTelegram(eepType, data) {
  let buf = utils.convertToBuffer(data);
  eepType = utils.convertToEEPType(eepType);

  if((eepType === null) || (eepType.substring(0, 2) !== RORG_VLD) ||
     (buf === null) || (buf.length < MIN_DATA_LENGTH_BYTES)) {
    return null;
  }

  let func = eepType.substring(3, 5);
  let type = eepType.substring(6, 9);
  let dataBuf = buf.subarray(1, buf.length - 5);

  switch(func) {
    case '14':
      return multiFunctionSensors.process(type, dataBuf);
    case '15':
      return singleSensor.process(type, dataBuf);
    case '32':
      return acCurrentClamps.process(type, dataBuf);
  }

  return null;
}


module.exports.processVLDTelegram = processVLDTelegram;
