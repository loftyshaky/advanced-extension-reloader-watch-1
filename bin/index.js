#!/usr/bin/env node
const fs = require('fs-extra');
const { isNil } = require('lodash');
const yargs = require('yargs');
const { greenBright, redBright, blueBright } = require('colorette');

const Reloader = require('advanced-extension-reloader-watch-2/umd/reloader');

const error_msg = {
    config_json_is_not_valid: 'Config is not valid JSON.',
    no_watch_dir_property: "Config json doesn't contain watch_dir property.",
    watch_dir_doesnt_exists: "Directory provided in the watch_dir property doesn't exist.",
};

const show_error = (error_msg_key) => {
    // eslint-disable-next-line no-console
    console.log(redBright(error_msg[error_msg_key]));
};

const options = yargs.usage('Usage: -c <config>').option('c', {
    alias: 'config',
    describe: 'Absolute path to json config file.',
    type: 'string',
    demandOption: true,
}).argv;

let config;

try {
    config = fs.readJSONSync(options.config);
} catch (error_object) {
    show_error('config_json_is_not_valid');

    process.exit(1);
}

const config_pre = {};

const resolve_property = (config_key) => {
    if (!isNil(config) && !isNil(config[config_key])) {
        config_pre[config_key] = config[config_key];
    }
};

resolve_property('port');
resolve_property('watch_dir');

if (isNil(config_pre.watch_dir)) {
    show_error('no_watch_dir_property');

    process.exit(1);
} else {
    const reloader = new Reloader(config_pre);

    try {
        reloader.watch({
            callback: () => {
                if (isNil(config_pre.watch_dir)) {
                    show_error('no_watch_dir_property');

                    process.exit(1);
                } else {
                    let config_after;

                    try {
                        config_after = fs.readJSONSync(options.config);
                    } catch (error_object) {
                        show_error('config_json_is_not_valid');

                        process.exit(1);
                    }

                    delete config_after.port;
                    delete config_after.watch_dir;
                    reloader.reload(config_after);

                    // eslint-disable-next-line no-console
                    console.log(
                        blueBright(`Reloaded extension on ${new Date().toLocaleTimeString()}`),
                    );
                }
            },
        });

        // eslint-disable-next-line no-console
        console.log(greenBright('Watching...'));
    } catch (error_object) {
        show_error('watch_dir_doesnt_exists');

        process.exit(1);
    }
}
