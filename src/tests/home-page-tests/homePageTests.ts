import { By, WebDriver } from 'selenium-webdriver';
import { strict as assert } from 'assert';
import { SeleniumTestConfig } from '../../config';

describe('Dance blog home page ', () => {
    let driver: WebDriver;

    before(async () => {
        const driverInstance = await new SeleniumTestConfig().init()
        if (driverInstance) {
            driver = driverInstance;
        } else {
            throw new Error("WebDriver initialization error")
        }

        await driver.get(process.env.WEBSIDE_URL!);

        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, 10000);

        await driver.sleep(1000)
    });

    after(async () => {
        await driver.quit();
    });

    it('should contains title', async () => {
        const textTitle = 'Dance blog'

        const title = await driver.findElement(By.css('h1'));
        const text = await title.getText()

        assert.equal(text, textTitle)
    });
});