import { Actions, By, WebDriver, WebElement } from 'selenium-webdriver';
import { strict as assert } from 'assert';
import { SeleniumTestConfig } from '../../config';
import { v4 } from 'uuid';

describe('Create post form ', () => {
    let driver: WebDriver;

    before(async () => {
        const driverInstance = await new SeleniumTestConfig().init()
        if (driverInstance) {
            driver = driverInstance;
        } else {
            throw new Error("WebDriver initialization error")
        }

        await driver.get(process.env.CREATE_POST_VIEW_URL!);

        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, 10000);

        await driver.sleep(1000)
    });

    after(async () => {
        await driver.quit();
    });

    it('should create post', async () => {

        const titleFieldText = `Automatic post ${v4()}`
        const postContent = `Automatic test content ${v4()}`



        const titleField = await driver.findElement(By.css('[data-test-id=create-post-input-field-title]'));
        await titleField.click();

        await titleField.sendKeys(titleFieldText)

        const tagsField = await driver.findElement(By.css('[data-test-id=tag-field]'))
        await tagsField.click()

        let selectOption
        await driver.wait(async () => {
            selectOption = await driver.findElement(By.css('mat-option'))
            return Boolean(selectOption)
        }, 10000);

        await selectOption!.click()

        const markdownField = await driver.findElement(By.className('ace_text-input'));

        await markdownField.sendKeys(postContent)

        const submitButton = await driver.findElement(By.css('[type="submit"]'))

        await submitButton.submit()

        await driver.sleep(1000)

        let matGrid: WebElement[] = [];
        await driver.wait(async () => {
            matGrid = await driver.findElements(By.css('mat-grid-tile'));
            return Boolean(matGrid)
        }, 10000)

        let isNewPostTitle: boolean = false;
        let isNewPostContent: boolean = false;

        for await (let matGridElement of matGrid) {
            isNewPostTitle = await (await matGridElement.findElement(By.css('mat-card-title'))).getText() === titleFieldText

            //ToDo:  Bad option - doesn't work with markdown 
            isNewPostContent = await (await matGridElement.findElement(By.css('markdown'))).getText() === postContent
            if (isNewPostTitle || isNewPostContent) {
                break;
            }

        }

        assert.ok(isNewPostTitle, 'Correct title not found')
        assert.ok(isNewPostContent, 'Correct content not found')

    });


});