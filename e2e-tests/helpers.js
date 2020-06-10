const {By, until} = require('selenium-webdriver')

const xClass = (cls) => (`[contains(concat(' ',normalize-space(@class),' '),' ${cls} ')]`)

const getElementCSS = async (driver, selector, timeout = 3000) => {
    const el = await driver.wait(until.elementLocated(By.css(selector)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementXPath = async (driver, xpath, timeout = 3000) => {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementName = async (driver, name, timeout = 3000) => {
    const el = await driver.wait(until.elementLocated(By.name(name)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementId = async (driver, id, timeout = 3000) => {
    const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

const antGetFormItemExplain = async (driver, id) => {
    return await getElementXPath(driver, `//*[@id='${id}']/ancestor::div${xClass('ant-form-item')}//div${xClass('ant-form-item-explain')}`);
}


module.exports = {
    xClass,
    getElementCSS,
    getElementXPath,
    getElementName,
    getElementId,
    antGetFormItemExplain
}