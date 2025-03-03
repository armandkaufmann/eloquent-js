import {resolve} from "path";
import {existsSync, readFileSync} from "fs";
import {defaultConfig} from "./Default.js";

export const CONFIG_FILENAME = "eloquentconfig.json";

export class Config {
    #options = null;

    constructor() {
        this.#options = this.#loadConfig();
    }

    /**
     * @returns Object
     */
    #loadConfig() {
        const configPath = resolve(process.cwd(), CONFIG_FILENAME);

        if (!existsSync(configPath)) {
            return defaultConfig;
        }

        try {
            const configFile = readFileSync(configPath, "utf-8");
            return {...defaultConfig, ...JSON.parse(configFile)};
        } catch (error) {
            console.error(`Eloquent JS: unable to parse ${CONFIG_FILENAME} file, please ensure file is a valid JSON file.\n ${error.message}`);
            return defaultConfig;
        }
    }

    /**
     * @returns Object
     */
    all() {
        return this.#options;
    }

    /**
     * @param {String} key
     * @returns {String|Array|Object|Number|null}
     */
    get(key) {
        try {
            return key.split('.')?.reduce((result, token) => result[token], this.#options) || null;
        } catch (e) {
            return null;
        }
    }

    /**
     * @param {String} key
     * @param {String|Array|Object|Number} value
     * @returns {void}
     */
    set(key, value){
        const tokens = key.split('.');

        if (tokens.length === 1) {
            this.#options[key] = value;
            return;
        }

        let result = {};

        for (let index = tokens.length - 1; index >= 0; index--) {
            const current = tokens[index];
            if (index === tokens.length - 1) {
                result = {[current]: value};
                continue;
            }

            const temp = result;
            result = {[current]: temp};
        }

        this.#options = result;
    }
}

export const config = new Config();