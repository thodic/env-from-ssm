# env-from-ssm

Easily load parameters from SSM into environment variables without adding SSM paths to your code.

## Usage

Initialise your environment with environment variables in the following format:

```
{environment variable key to load into}_SSM_PATH={parameter name in ssm}
```

And then run:

```
const populateEnvironment = require('env-from-ssm');

populateEnvironment({
    awsOptions: {region: 'us-east-1'}
});
```

The values from SSM will be loaded into `process.env` with the specified environment variable keys.

## API

`populateEnvrionment(options)`

### options.awsOptions

_default: `{}`_

The options passed to the SSM object constructor (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#constructor-property).

### options.environmentVariableRegex

_default: `= /^(.*)_SSM_PATH$/m`_

The regex used to match environment variables defining SSM parameter names. This must contain one caturing group which will match the environment variable key to load into.
