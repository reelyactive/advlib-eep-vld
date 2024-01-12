/**
 * Copyright reelyActive 2022-2023
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
const INPUT_DATA_PH_EEP_TYPE = 'D2-14-50';
const INPUT_DATA_PH = 'd27522800414006980';
const INPUT_DATA_DISSOLVED_OXYGEN_EEP_TYPE = 'D2-14-51';
const INPUT_DATA_DISSOLVED_OXYGEN = 'd2751c200414006980';
const INPUT_DATA_PEOPLE_ACTIVITY_COUNTER_EEP_TYPE = 'D2-15-00';
const INPUT_DATA_PEOPLE_ACTIVITY_COUNTER = 'd20a30390414006980';

// Expected outputs for the scenario
const EXPECTED_DATA_INVALID_INPUT = null;
const EXPECTED_DATA_MULTISENSOR = {
    acceleration: [ -0.01, -0.045, 1.02 ],
    illuminance: 331,
    isContactDetected: [ false ],
    isMotionDetected: [ false ],
    relativeHumidity: 75.5,
    temperature: 18.1
};
const EXPECTED_DATA_PH = {
    temperature: 23.4,
    pH: 6.9
};
const EXPECTED_DATA_DISSOLVED_OXYGEN = {
    temperature: 23.4,
    dissolvedOxygen: 45
};
const EXPECTED_DATA_PEOPLE_ACTIVITY_COUNTER = {
    isMotionDetected: true,
    passageCounts: [ 12345 ]
};


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

  // Test the process function with valid pH data
  it('should handle valid pH data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(INPUT_DATA_PH_EEP_TYPE,
                     INPUT_DATA_PH), EXPECTED_DATA_PH);
  });

  // Test the process function with valid Dissolved Oxygen data
  it('should handle valid dissolved oxygen data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                          INPUT_DATA_DISSOLVED_OXYGEN_EEP_TYPE,
                                          INPUT_DATA_DISSOLVED_OXYGEN),
                                          EXPECTED_DATA_DISSOLVED_OXYGEN);
  });

  // Test the process function with valid People Activity Counter data
  it('should handle valid people activity counter data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                   INPUT_DATA_PEOPLE_ACTIVITY_COUNTER_EEP_TYPE,
                                   INPUT_DATA_PEOPLE_ACTIVITY_COUNTER),
                                   EXPECTED_DATA_PEOPLE_ACTIVITY_COUNTER);
  });

});
