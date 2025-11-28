/**
 * Copyright reelyActive 2025
 * We believe in an open Internet of Things
 */


const utils = require('./utils');


const MIN_DATA_LENGTH_BYTES = 3;


/**
 * Process an AC Current Clamp VLD telegram.
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
      return processSingleChannelClamp(buf);
    case '01':
      return processDualChannelClamp(buf);
    case '02':
      return processTripleChannelClamp(buf);
  }

  return null;
}


/**
 * Process single-channel clamp data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processSingleChannelClamp(data) {
  let isPowerFail = ((data.readUInt8(0) & 0x80) === 0x80);
  let divisor = ((data.readUInt8(0) & 0x40) === 0x40) ? 10 : 1;
  let amperages = [ (data.readUInt16BE(1) >> 4) / divisor ];

  return { amperages: amperages };
}


/**
 * Process dual-channel clamp data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processDualChannelClamp(data) {
  let isPowerFail = ((data.readUInt8(0) & 0x80) === 0x80);
  let divisor = ((data.readUInt8(0) & 0x40) === 0x40) ? 10 : 1;
  let amperages = [ (data.readUInt16BE(1) >> 4) / divisor,
                    (data.readUInt16BE(2) & 0x7ff) / divisor ];

  return { amperages: amperages };
}


/**
 * Process triple-channel clamp data.
 * @param {Object} data The raw telegram as a Buffer.
 * @return {Object} The processed telegram as JSON.
 */
function processTripleChannelClamp(data) {
  let isPowerFail = ((data.readUInt8(0) & 0x80) === 0x80);
  let divisor = ((data.readUInt8(0) & 0x40) === 0x40) ? 10 : 1;
  let amperages = [ (data.readUInt16BE(1) >> 4) / divisor,
                    (data.readUInt16BE(2) & 0x7ff) / divisor,
                    (data.readUInt16BE(4) >> 4) / divisor ];

  return { amperages: amperages };
}


module.exports.process = process;
