var execSync = require('child_process').execSync,
    argv = require('yargs').argv,
    targets = require('./targets');

var buildVersion = argv.buildVersion;
if(typeof buildVersion === 'undefined' || buildVersion === null || buildVersion === "") {
    buildVersion = require('../package.json').version;
}

targets.forEach(target => {
    execSync('npm run build -- --target=' + target + ' --build-version=' + buildVersion, {stdio: [0, 1, 2]});
});
