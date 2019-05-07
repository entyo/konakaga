import express from "express";
import path from "path";
import puppeteer from "puppeteer";
import { Server } from "http";

const EXPRESS_DEV_SERVER_PORT = 1173;
let serverInstance: Server | null;
let browser: puppeteer.Browser | null;

beforeAll(async () => {
  const app = express();
  const path2public = path.join(__dirname, "..", "public");
  app.use("/", express.static(path2public));

  serverInstance = app.listen(EXPRESS_DEV_SERVER_PORT, () =>
    console.info(
      `テスト用の静的ファイルサーバを:${EXPRESS_DEV_SERVER_PORT}で起動しました。`
    )
  );

  browser = await puppeteer.launch();

  jest.setTimeout(10000);
});

afterAll(async () => {
  if (serverInstance) {
    serverInstance.close();
  }

  if (browser) {
    browser.close();
  }
});

describe("TWINS", () => {
  test("講義自体がないとき（土日祝とか）のインデックスページをスクレイピングできる", async () => {
    if (!browser) {
      return;
    }
    const page = await browser.newPage();
    // TODO: 本体と同じコードをテストする
    await page.goto(`http://localhost:${EXPRESS_DEV_SERVER_PORT}/no_class`, {
      waitUntil: "networkidle0"
    });

    const ehsKyuko = await page.$$(
      "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kyuko"
    );
    const ehsKaiko = await page.$$(
      "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kaiko"
    );
    expect(ehsKyuko.length).toBe(0);
    expect(ehsKaiko.length).toBe(0);
  });

  test("休講情報があるときのインデックスページをスクレイピングできる", async () => {
    if (!browser) {
      return;
    }
    const page = await browser.newPage();
    // TODO: 本体と同じコードをテストする
    await page.goto(`http://localhost:${EXPRESS_DEV_SERVER_PORT}/kyuko`, {
      waitUntil: "networkidle0"
    });

    const ehsKyuko = await page.$$(
      "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kyuko"
    );
    const ehsKaiko = await page.$$(
      "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kaiko"
    );
    expect(ehsKyuko.length).toBe(2);
    expect(ehsKaiko.length).toBe(1);

    const clip = await page.evaluate(() => {
      const li = document.querySelector(
        "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kyuko"
      );
      if (li && li.parentElement) {
        const { parentElement } = li;
        const {
          width,
          height,
          top: y,
          left: x
        } = parentElement.getBoundingClientRect();
        return { width, height, x, y };
      } else {
        return null;
      }
    }, "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list");

    expect(clip).toBeTruthy();
    if (clip) {
      await page.screenshot({ clip, path: "kyuko_test.png" });
      // TODO: メールで通知する
    }
  });

  test("休講情報がないときのインデックスページをスクレイピングできる", async () => {
    if (!browser) {
      return;
    }
    const page = await browser.newPage();
    await page.goto(`http://localhost:${EXPRESS_DEV_SERVER_PORT}/kaiko`, {
      waitUntil: "networkidle0"
    });

    const ehsKyuko = await page.$$(
      "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kyuko"
    );
    const ehsKaiko = await page.$$(
      "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list li.kaiko"
    );
    expect(ehsKyuko.length).toBe(0);
    expect(ehsKaiko.length).toBe(4);
  });
});
