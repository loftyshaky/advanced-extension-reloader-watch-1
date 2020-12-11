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

let config = fs.readJSONSync(options.config);
const config_obj = {
    0: {},
    1: {},
};

const resolve_property = (obj_no, config_key) => {
    if (
        !isNil(config)
        && !isNil(config[config_key])
    ) {
        config_obj[obj_no][config_key] = config[config_key];
    }
};

resolve_property(
    0,
    'port',
);
resolve_property(
    0,
    'watch_paths',
);

const reload = new Reload(config_obj[0]);

reload.watch(
    {
        callback: () => {
            if (isNil(config_obj[0].watch_paths)) {
                // eslint-disable-next-line no-console
                console.log(redBright('Config json doesn\'t contain watch_paths property.'));
            } else {
                config = fs.readJSONSync(options.config);
                config_obj[1] = {};

                resolve_property(
                    1,
                    'hard',
                );
                resolve_property(
                    1,
                    'all_tabs',
                );
                resolve_property(
                    1,
                    'hard_paths',
                );
                resolve_property(
                    1,
                    'soft_paths',
                );
                resolve_property(
                    1,
                    'all_tabs_paths',
                );
                resolve_property(
                    1,
                    'one_tab_paths',
                );

                reload.reload(config_obj[1]);

                // eslint-disable-next-line no-console
                console.log(blueBright(`Reloaded extension on ${new Date().toLocaleTimeString()}`));
            }
        },
    },
);

// eslint-disable-next-line no-console
console.log(greenBright('Watching...'));
