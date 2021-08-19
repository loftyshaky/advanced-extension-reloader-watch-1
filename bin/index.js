#!/usr/bin/env node
const fs = require('fs-extra');
const { isNil } = require('lodash');
const yargs = require('yargs');
const { greenBright, redBright, blueBright } = require('colorette');

const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');

const options = yargs.usage('Usage: -c <config>').option('c', {
    alias: 'config',
    describe: 'Absolute path to json config file.',
    type: 'string',
    demandOption: true,
}).argv;

const config = fs.readJSONSync(options.config);
const config_pre = {};

const resolve_property = (config_key) => {
    if (!isNil(config) && !isNil(config[config_key])) {
        config_pre[config_key] = config[config_key];
    }
};

const show_error = () => {
    // eslint-disable-next-line no-console
    console.log(redBright("Config json doesn't contain watch_dir property."));
};

resolve_property('port');
resolve_property('watch_dir');

if (isNil(config_pre.watch_dir)) {
    show_error();
} else {
    const reloader = new Reloader(config_pre);

    reloader.watch({
        callback: () => {
            if (isNil(config_pre.watch_dir)) {
                show_error();
            } else {
                const config_after = fs.readJSONSync(options.config);
                delete config_after.port;
                delete config_after.watch_dir;
                reloader.reload(config_after);

                // eslint-disable-next-line no-console
                console.log(blueBright(`Reloaded extension on ${new Date().toLocaleTimeString()}`));
            }
        },
    });

    // eslint-disable-next-line no-console
    console.log(greenBright('Watching...'));
}
