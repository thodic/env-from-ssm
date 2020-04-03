const aws = require('aws-sdk');

const identifySSMPathsInEnvironmentVariables = (regex) =>
    Object.keys(process.env)
        .map(k => {
            const match = regex.exec(k);
            if (!match) return undefined;

            const key = match[1];
            return {
                key,
                path: process.env[k],
            }
        })
        .filter(p => p);

const fetchValuesFromSSM = async (paths, awsOptions = {}) => {
    const ssm = new aws.SSM(awsOptions);

    const {Parameters: ssmValues} = await ssm.getParameters({
        Names: paths,
        WithDecryption: true,
    }).promise();

    return ssmValues;
};

const storeValuesInEnvironmentVariables = (ssmValues, parameters) => {
    ssmValues.forEach(({Value: value, Name: path}) => {
        const key = parameters.find(p => p.path === path).key;

        process.env[key] = value;
    });
};

module.exports = async ({awsOptions = {}, environmentVariableRegex = /^(.*)_SSM_PATH$/m}) => {
    const paths = identifySSMPathsInEnvironmentVariables(environmentVariableRegex);
    const ssmValues = await fetchValuesFromSSM(paths.map(p => p.path), awsOptions);
    storeValuesInEnvironmentVariables(ssmValues, paths);

    return process.env;
};

