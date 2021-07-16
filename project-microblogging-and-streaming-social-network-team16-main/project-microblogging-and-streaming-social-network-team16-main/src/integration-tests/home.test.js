/**
 * @jest-environment jest-environment-webdriver
 */

const url = "http://localhost:1557";

describe("/home", () => {
  test("it renders", async () => {
    await browser.get(`${url}/home`);
    await new Promise((r) => setTimeout(r, 1000));
    const title = await browser.findElement(by.tagName("h1")).getText();
    expect(title).toContain("Home");
  });
});
