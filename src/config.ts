import * as dotenv from 'dotenv';
import { Builder, WebDriver, logging } from 'selenium-webdriver';

export class SeleniumTestConfig {
    constructor() {
        dotenv.config();
    }

    driver: WebDriver | null = null;

    init(): WebDriver | null {
        if (!(process.env.BROWSER === "chrome" || "edge" || "firefox")) {
            return null;
        }

        const logPrefers: logging.Preferences = new logging.Preferences();
        logPrefers.setLevel(logging.Type.BROWSER, logging.Level.ALL)

        this.driver = new Builder()
            .forBrowser(process.env.BROWSER!)
            .setLoggingPrefs(logPrefers)
            .build()
        return this.driver
    }

    quit() {
        this.driver?.quit();
    };
}