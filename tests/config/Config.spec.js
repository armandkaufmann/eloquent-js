import {afterEach, beforeEach, describe, test, vi, expect} from "vitest";
import {defaultConfig} from "../../src/config/Default.js";
import {Config, CONFIG_FILENAME} from "../../src/config/Config.js";
import * as fs from "fs";

vi.mock("fs", async () => {
    return {
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
    };
});

describe("Config Test", () => {
    const filepath = process.cwd() + "/" + CONFIG_FILENAME;

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    test("it uses the default config if one doesn't exist", () => {
        fs.existsSync.mockReturnValue(false);

        const config = new Config();
        expect(fs.existsSync).toHaveBeenCalledTimes(2); // todo: why does it get called twice in this test?
        expect(fs.existsSync).toHaveBeenCalledWith(filepath);
        expect(fs.readFileSync).not.toHaveBeenCalled();

        const result = config.all();
        expect(result).toEqual(defaultConfig);
    });

    test("it loads the config if it exists", () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify({someKey: "someValue"}));

        const config = new Config();
        expect(fs.existsSync).toHaveBeenCalledOnce();
        expect(fs.readFileSync).toHaveBeenCalledOnce();
        expect(fs.readFileSync).toHaveBeenCalledWith(filepath, "utf-8");

        const result = config.all();
        expect(result).toEqual({...defaultConfig, someKey: "someValue"});
    });

    describe('Get', () => {
        let config;

        beforeEach(() => {
            fs.existsSync.mockReturnValue(false);
            config = new Config();
        });

        afterEach(() => {
            vi.clearAllMocks();
            vi.resetModules();
        });

        const keyResults = [
            ["retrieve a single value from the config", "database.file", defaultConfig.database.file],
            ["returns null when key is not found in config", "taco", null],
            ["returns null when nested key is not found in config", "database.taco", null],
            ["returns null when all keys do not exist", "taco.taco", null],
            ["returns object when top level key is used", "database", defaultConfig.database],
            ["returns null when called with empty string", "", null],
            ["returns null when called with null", null, null],
        ]

        test.each(keyResults)('Get: %s => config.get("%s") => %s', (test, key, expectedResult) => {
            expect(config.get(key)).toEqual(expectedResult)
        });
    });

    describe('Set', () => {
        let config;

        beforeEach(() => {
            fs.existsSync.mockReturnValue(false);
            config = new Config();
        });

        afterEach(() => {
            vi.clearAllMocks();
            vi.resetModules();
        });

        test('it sets a key value pair on the module config', () => {
            const key = "beef";
            const value = "tacos";

            config.set(key, value);

            expect(config.get(key)).toEqual(value);
        });

        test('It can set a value to be null', () => {
            const key = "beef";
            const originalValue = "wellington";

            config.set(key, originalValue);

            expect(config.get(key)).toEqual(originalValue);

            config.set(key, null);

            expect(config.get(key)).toBe(null);
        })

        test('it sets a key value pair and does not overwrite the current config', () => {
            const key = "database.file";
            const value = "tacos";

            config.set(key, value);

            expect(config.get(key)).toEqual(value);
            expect(config.get('table.case')).toEqual(defaultConfig.table.case);
            expect(config.get('database.relative')).toEqual(defaultConfig.database.relative);
        });

        test('it can handle setting deep keys', () => {
            const keys = ["beef", "onion", "garlic", "tomatoes"];
            const value = "tacos";
            const expectedObject = {
                beef: {
                    onion: {
                        garlic: {
                            tomatoes: "tacos"
                        }
                    }
                }
            }

            config.set(keys.join("."), value);

            expect(config.get(keys.join("."))).toEqual(value);
            expect(config.get(keys[0])).toEqual(expectedObject[keys[0]]);
            expect(config.get([keys[0], keys[1]].join("."))).toEqual(expectedObject[keys[0]][keys[1]]);
            expect(config.get([keys[0], keys[1], keys[2]].join("."))).toEqual(expectedObject[keys[0]][keys[1]][keys[2]]);
            expect(config.get([keys[0], keys[1], keys[2], keys[3]].join("."))).toEqual(expectedObject[keys[0]][keys[1]][keys[2]][keys[3]]);
        });
    });

    describe('Clear', () => {
        beforeEach(() => {
            vi.clearAllMocks();
            vi.resetModules();
        });

        test('it clears configuration values that have been set, and reloads', () => {
            fs.existsSync.mockReturnValue(false);
            const config = new Config();

            const key = 'beef';
            const value = 'tacos';

            config.set(key, value);

            expect(config.get(key)).toEqual(value);

            config.clear();

            expect(config.get(key)).toEqual(null);
        });
    })
});
