/**
 * @jest-environment jest-environment-webdriver
 */

const url = "http://localhost:1557";

describe("/signup", () => {
  test("it renders", async () => {
    await browser.get(`${url}/signup`);
    await new Promise((r) => setTimeout(r, 1000));
    const title = await browser.findElement(by.tagName("h1")).getText();
    expect(title).toContain("Sign Up");
    const username = `user${Date.now()}`;
    const password = `Password1234`;
    await browser.executeScript(
      `document.getElementsByName('username')[0].value='${username}'`
    );
    await browser.executeScript(
      `document.getElementsByName('password')[0].value='${password}'`
    );
    await new Promise((r) => setTimeout(r, 500));
    await browser.executeScript(
      `document.querySelector('button[type=submit]').click()`
    );
  }, 30000);
});
