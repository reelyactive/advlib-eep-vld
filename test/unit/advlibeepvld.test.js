/**
 * Copyright reelyActive 2022
 * We believe in an open Internet of Things
 */


const advlib = require('../../lib/advlibeepvld.js');
const assert = require ('assert');


// Input data for the scenario
const INPUT_DATA_INVALID_EEP_TYPE = 'fail';
const INPUT_DATA_INVALID_HEX_STRING = 'xyz';
const INPUT_DATA_TOO_SHORT_BUFFER = Buffer.from('', 'hex');
const INPUT_DATA_MULTISENSOR_EEP_TYPE = 'D2-14-41';
const INPUT_DATA_MULTISENSOR = 'd29165c02963e4f5d8000414006980';


// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_MULTISENSOR = {
    acceleration: [ -0.01, -0.045, 1.02 ],
    illuminance: 331,
    isContactDetected: [ false ],
    isMotionDetected: [ false ],
    relativeHumidity: 75.5,
    temperature: 18.1
}


// Describe the scenario
describe('advlib-eep-vld', function() {

  // Test the process function with no input data
  it('should handle no input data', function() {
    assert.deepEqual(advlib.processVLDTelegram(), EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with an invalid EEP type
  it('should handle an invalid EEP type as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(INPUT_DATA_INVALID_EEP_TYPE),
                     EXPECTED_DATA_INVALID_INPUT);
  });

  // Test the process function with valid Multisensor data
  it('should handle valid multisensor data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(INPUT_DATA_MULTISENSOR_EEP_TYPE,
                     INPUT_DATA_MULTISENSOR), EXPECTED_DATA_MULTISENSOR);
  });

});
