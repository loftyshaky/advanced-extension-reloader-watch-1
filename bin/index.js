#!/usr/bin/env node
const fs = require('fs-extra');
const { isNil } = require('lodash');
const yargs = require('yargs');
const { greenBright, redBright } = require('colorette');

const { Reload } = require('extension-reloader-watch-2');

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
const obj = {
    1: {},
    2: {},
};

const resolve_property = (obj_no, config_key) => {
    if (
        !isNil(config)
        && !isNil(config[config_key])
    ) {
        obj[obj_no][config_key] = config[config_key];
    }
};

resolve_property(
    1,
    'port',
);
resolve_property(
    1,
    'watch_dirs',
);

if (isNil(obj[1].watch_dirs)) {
    // eslint-disable-next-line no-console
    console.log(redBright('Config json doesn\'t contain watch_dirs property.'));
} else {
    resolve_property(
        1,
        'hard_dirs',
    );
    resolve_property(
        2,
        'hard',
    );
    resolve_property(
        2,
        'all_tabs',
    );

    const reload = new Reload(obj[1]);

    reload.watch(
        {
            callback: () => reload.reload(obj[2]),
        },
    );

    // eslint-disable-next-line no-console
    console.log(greenBright('Watching...'));
}
