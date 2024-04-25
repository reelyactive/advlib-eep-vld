/**
 * Copyright reelyActive 2024
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


const MIN_DATA_LENGTH_BYTES = 3;


/**
 * Process a Single Sensor VLD telegram.
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
    case '00':
      return processPeopleActivityCounter(buf);
  }

  return null;
}


/**
 * Process people activity counter data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processPeopleActivityCounter(data) {
  let isMotionDetected = [ (data.readUInt8(0) & 0xc0) === 0 ];
  let passageCounts = [ data.readUInt16BE(1) ];

  return { isMotionDetected: isMotionDetected,
           passageCounts: passageCounts };
}


module.exports.process = process;
