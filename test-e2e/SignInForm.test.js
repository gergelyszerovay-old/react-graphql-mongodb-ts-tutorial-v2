const {Builder} = require('selenium-webdriver')
require('selenium-webdriver/chrome')
require('selenium-webdriver/firefox')
require('chromedriver')
require('geckodriver')
const {xClass, getElementCSS, getElementId, getElementXPath, antGetFormItemExplain} = require('./helpers')
const {defineFeature, loadFeature} = require('jest-cucumber')

const rootURL = 'http://localhost:3000/'

const feature = loadFeature(__dirname + '/features/SignInForm.feature');

const givenVisitUrlAndLoadDemoData = (ctx, given, url) => {
    given('I visit /', async () => {
        await ctx.driver.get(url);
    });

    given('the demo data is loaded', async () => {
        ctx.driver.executeScript("window.appTest('load_demo_data');");
    });

}

const whenIPressTheSignInButton = (ctx, when) => {
    when('I press the Sign In button', async (password) => {
        const elSubmitButton = await getElementCSS(ctx.driver, '.ant-btn-primary');
        await elSubmitButton.click();
    });
}

defineFeature(feature, test => {
    let ctx = {};

    beforeAll(async () => {
        ctx.driver = await new Builder().forBrowser('firefox').build()
    }, 10000)

    // afterAll(async () => driver.quit(), 10000);

    test('The e-mail field is required and accepts only e-mail addresses', ({given, when, then}) => {
        // console.log(ctx);
        givenVisitUrlAndLoadDemoData(ctx, given, rootURL);

        when(/^I enter into the email field: (.*)$/, async (email) => {
            const el = await getElementId(ctx.driver, 'SignInForm_email');
            await el.sendKeys(email);
            const elSubmitButton = await getElementCSS(ctx.driver, '.ant-btn-primary');
            await elSubmitButton.click();
        });

        whenIPressTheSignInButton(ctx, when);

        then(/^The email field's error message is: (.*)$/, async (message) => {
            const elEmailError = await antGetFormItemExplain(ctx.driver, 'SignInForm_email');
            expect(await elEmailError.getText()).toEqual(message);
        });
    });

    test('The password field is required and the minimum password length is 8 characters', ({given, when, then}) => {
        givenVisitUrlAndLoadDemoData(ctx, given, rootURL);

        when(/^I enter into the password field: (.*)$/, async (password) => {
            const el = await getElementId(ctx.driver, 'SignInForm_password');
            await el.sendKeys(password);
            const elSubmitButton = await getElementCSS(ctx.driver, '.ant-btn-primary');
            await elSubmitButton.click();
        });

        whenIPressTheSignInButton(ctx, when);

        then(/^The password field's error message is: (.*)$/, async (message) => {
            const elPasswordError = await antGetFormItemExplain(ctx.driver, 'SignInForm_password');
            expect(await elPasswordError.getText()).toEqual(message);
        });
    });

    test('The user tries to log in with an e-mail address, that is not in the database', ({given, when, then}) => {
        givenVisitUrlAndLoadDemoData(ctx, given, rootURL);

        when(/^I enter into the email field: (.*)$/, async (email) => {
            const el = await getElementId(ctx.driver, 'SignInForm_email');
            await el.sendKeys(email);
        });

        when(/^I enter into the password field: (.*)$/, async (password) => {
            const el = await getElementId(ctx.driver, 'SignInForm_password');
            await el.sendKeys(password);
        });

        whenIPressTheSignInButton(ctx, when);

        then(/^I should see an error notice, it's text is: (.*)$/, async (message) => {
            const elNotice = await getElementXPath(ctx.driver, `//div${xClass('ant-message-notice')}//div${xClass('ant-message-error')}`);
            expect(await elNotice.getText()).toEqual(message);
        });
    });
});

