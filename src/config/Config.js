import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
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
            console.error(`Eloquent JS: unable to parse ${CONFIG_FILENAME} file, please ensure file is a valid object.\n ${error.message}`);
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
     * @returns ?String
     */
    get(key){
    }
}

export const config = new Config();