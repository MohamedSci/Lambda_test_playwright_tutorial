import { chromium } from "@playwright/test";
import test from "node:test";

test("first test 1", async ()=>{

const chromiumBrowser = await chromium.launch({
    headless:false
});
const chromiumContext = await chromiumBrowser.newContext();
const page = await chromiumContext.newPage();
page.waitForTimeout(5000);

const browser2 = await chromium.launch();
const context2 = await browser2.newContext();
const page2 = await context2.newPage();


});