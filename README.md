advlib-eep-vld
==============

Wireless advertising packet decoding library for EnOcean Equipment Profiles of variable-length data (VLD).  __advlib-eep-vld__ is typically used as a library for [advlib-esp](https://github.com/reelyactive/advlib-esp) which itself is commonly a processor module of the protocol-agnostic [advlib](https://github.com/reelyactive/advlib).

__advlib-eep-vld__ is a lightweight [Node.js package](https://www.npmjs.com/package/advlib-eep-vld) with no dependencies.  See also its sister libraries [advlib-eep-4bs](https://github.com/reelyactive/advlib-eep-4bs) and [advlib-eep-rps](https://github.com/reelyactive/advlib-eep-rps).


Installation
------------

    npm install advlib-eep-vld


Hello advlib-eep-vld!
---------------------

```javascript
const advlib = require('advlib-eep-vld');

let eepType = 'D2-14-41';
let telegram = 'd29165c02963e4f5d8000414006980';

let processedData = advlib.processVLDTelegram(eepType, telegram);

console.log(processedData);
```

Which should yield the following console output:

    {
        acceleration: [ -0.01, -0.045, 1.02 ],
        illuminance: 331,
        isContactDetected: [ false ],
        isMotionDetected: [ false ],
        relativeHumidity: 75.5,
        temperature: 18.1
    }


Supported EnOcean Equipment Profiles
------------------------------------

The following EEPs are currently supported by __advlib-eep-vld__.

| EEP      | Profile Name                           | /lib file               |
|:---------|:---------------------------------------|:------------------------|
| D2-14-41 | Temperature, Humidity XYZ Acceleration, Illumination Sensor | multifunctionsensors.js |
| D2-14-50 | Basic Water Properties Sensor (pH)     | multifunctionsensors.js |
| D2-14-51 | Basic Water Properties Sensor (Dissolved Oxygen) | multifunctionsensors.js |
| D2-15-00 | Single Sensor | singlesensor.js |


Contributing
------------

Discover [how to contribute](CONTRIBUTING.md) to this open source project which upholds a standard [code of conduct](CODE_OF_CONDUCT.md).


Security
--------

Consult our [security policy](SECURITY.md) for best practices using this open source software and to report vulnerabilities.


License
-------

MIT License

Copyright (c) 2022-2024 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
