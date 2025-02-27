import { afterEach, describe, test, vi, expect } from "vitest";
import { defaultConfig } from "../../src/config/Default.js";
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

        const result = config.all();
        expect(result).toEqual(defaultConfig);
    });

    test("it loads the config if it exists", () => {
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(JSON.stringify({ someKey: "someValue" }));

        const config = new Config();
        expect(fs.existsSync).toHaveBeenCalledOnce();
        expect(fs.readFileSync).toHaveBeenCalledOnce();
        expect(fs.readFileSync).toHaveBeenCalledWith(filepath, "utf-8");

        const result = config.all();
        expect(result).toEqual({ ...defaultConfig, someKey: "someValue" });
    });
});
