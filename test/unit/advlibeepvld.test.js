/**
 * Copyright reelyActive 2022-2025
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
const INPUT_DATA_T_RH_PM_CO2_HCHO_TVOC_EEP_TYPE = 'D2-14-59';
const INPUT_DATA_SD_ENO_CO2_SENSOR = 'd28a3ebfffffffffffff0a680414006980';
const INPUT_DATA_T_RH_PM_CO2_HCHO_TVOC = 'd28a3e95555554d230390a680414006980';
const INPUT_DATA_SINGLE_AC_CURRENT_CLAMP_EEP_TYPE = 'D2-32-00';
const INPUT_DATA_SINGLE_AC_CURRENT_CLAMP = 'd2004d200414006980';
const INPUT_DATA_DUAL_AC_CURRENT_CLAMP_EEP_TYPE = 'D2-32-01';
const INPUT_DATA_DUAL_AC_CURRENT_CLAMP = 'd2404d21410414006980';
const INPUT_DATA_TRIPLE_AC_CURRENT_CLAMP_EEP_TYPE = 'D2-32-02';
const INPUT_DATA_TRIPLE_AC_CURRENT_CLAMP = 'd2004d214100100414006980';

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
    isMotionDetected: [ true ],
    passageCounts: [ 12345 ]
};
const EXPECTED_DATA_SD_ENO_CO2_SENSOR = {
    relativeHumidity: 69,
    temperature: 25,
    carbonDioxideConcentration: 666
};
const EXPECTED_DATA_T_RH_PM_CO2_HCHO_TVOC = {
    relativeHumidity: 69,
    temperature: 25,
    "pm10": 170,
    "pm2.5": 341,
    "pm1.0": 170,
    formaldehydeConcentration: 0.666,
    volatileOrganicCompoundsConcentration: 12.345,
    carbonDioxideConcentration: 666
};
const EXPECTED_DATA_SINGLE_AC_CURRENT_CLAMP = { amperages: [ 1234 ] };
const EXPECTED_DATA_DUAL_AC_CURRENT_CLAMP = { amperages: [ 123.4, 32.1 ] };
const EXPECTED_DATA_TRIPLE_AC_CURRENT_CLAMP = { amperages: [ 1234, 321, 1 ] };


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

  // Test the process function with valid SD-ENO-C02 sensor data
  it('should handle valid SD-ENO-CO2 sensor data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                     INPUT_DATA_T_RH_PM_CO2_HCHO_TVOC_EEP_TYPE,
                                     INPUT_DATA_SD_ENO_CO2_SENSOR),
                                     EXPECTED_DATA_SD_ENO_CO2_SENSOR);
  });

  // Test the process function with valid T_RH_PM_CO2_HCHO_TVOC data
  it('should handle valid T_RH_PM_CO2_HCHO_TVOC data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                     INPUT_DATA_T_RH_PM_CO2_HCHO_TVOC_EEP_TYPE,
                                     INPUT_DATA_T_RH_PM_CO2_HCHO_TVOC),
                                     EXPECTED_DATA_T_RH_PM_CO2_HCHO_TVOC);
  });

  // Test the process function with valid Single AC Current Clamp data
  it('should handle valid single AC current clamp data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                   INPUT_DATA_SINGLE_AC_CURRENT_CLAMP_EEP_TYPE,
                                   INPUT_DATA_SINGLE_AC_CURRENT_CLAMP),
                                   EXPECTED_DATA_SINGLE_AC_CURRENT_CLAMP);
  });

  // Test the process function with valid Dual AC Current Clamp data
  it('should handle valid dual AC current clamp data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                   INPUT_DATA_DUAL_AC_CURRENT_CLAMP_EEP_TYPE,
                                   INPUT_DATA_DUAL_AC_CURRENT_CLAMP),
                                   EXPECTED_DATA_DUAL_AC_CURRENT_CLAMP);
  });

  // Test the process function with valid Triple AC Current Clamp data
  it('should handle valid triple AC current clamp data as input', function() {
    assert.deepEqual(advlib.processVLDTelegram(
                                   INPUT_DATA_TRIPLE_AC_CURRENT_CLAMP_EEP_TYPE,
                                   INPUT_DATA_TRIPLE_AC_CURRENT_CLAMP),
                                   EXPECTED_DATA_TRIPLE_AC_CURRENT_CLAMP);
  });

});
