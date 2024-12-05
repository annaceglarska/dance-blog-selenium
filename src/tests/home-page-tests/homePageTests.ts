import { By, Key, until, WebDriver } from 'selenium-webdriver';
import { strict as assert } from 'assert';
import { SeleniumTestConfig } from '../../config';

describe('Dance blog home page ', function () {
    let driver: WebDriver;

    before(async function () {
        const driverInstance = new SeleniumTestConfig().init()
        if (driverInstance) {
            driver = driverInstance;
        } else {
            throw new Error("WebDriver initialization error")
        }
    });

    after(async function () {
        await driver.quit();
    });

    it('should contains title', async function () {
        await driver.get(process.env.WEBSIDE_URL!);

        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, 10000);

        const title = await driver.findElement(By.css("h1"));
        const text = await title.getText()
        assert.equal(text, 'Dance blog')
    });
});