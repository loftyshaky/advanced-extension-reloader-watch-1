#!/usr/bin/env node
const fs = require('fs-extra');
const { isNil } = require('lodash');
const yargs = require('yargs');
const {
    greenBright,
    redBright,
    blueBright,
} = require('colorette');

const { Reload } = require('advanced-extension-reloader-watch-2');

const options = yargs
    .usage('Usage: -c <config>')
    .option('c',
        {
            alias: 'config',
            describe: 'Absolute path to json config file.',
            type: 'string',
            demandOption: true,
        })
    .argv;

const config = fs.readJSONSync(options.config);
const config_pre = {};

const resolve_property = (config_key) => {
    if (
        !isNil(config)
        && !isNil(config[config_key])
    ) {
        config_pre[config_key] = config[config_key];
    }
};

resolve_property('port');
resolve_property('watch_path');

const reload = new Reload(config_pre);

reload.watch(
    {
        callback: () => {
            if (isNil(config_pre.watch_path)) {
                // eslint-disable-next-line no-console
                console.log(redBright('Config json doesn\'t contain watch_path property.'));
            } else {
                const config_after = fs.readJSONSync(options.config);
                delete config_after.port;
                delete config_after.watch_path;
                reload.reload(config_after);

                // eslint-disable-next-line no-console
                console.log(blueBright(`Reloaded extension on ${new Date().toLocaleTimeString()}`));
            }
        },
    },
);

// eslint-disable-next-line no-console
console.log(greenBright('Watching...'));
