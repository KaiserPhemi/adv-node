// main container for all environment
const environments = {
  staging: {
    httpPort: 4000,
    httpsPort: 4001,
    envName: 'staging'
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production'
  }
};

// determine which env to export
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
const envToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export the appropriate environment
module.exports = envToExport;