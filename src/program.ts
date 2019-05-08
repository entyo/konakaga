import { IO } from "fp-ts/lib/IO";
import { error } from "fp-ts/lib/Console";
import { tryCatch } from "fp-ts/lib/TaskEither";
import puppeteer from "puppeteer";
import {
  ID,
  PASS,
  isoID,
  isoPASS,
  getUserData,
  buildMailAddress
} from "./twins";
import { TWINS_URL } from "./twins";
import { getNodeEnv } from "./nodeenv";
import { resolve } from "path";
import { config } from "dotenv";
import { setAPIKeyToMailClient, sendMail } from "./sendgrid";

export const panic = new IO(() => process.exit(1));

interface Clip {
  width: number;
  height: number;
  x: number;
  y: number;
}

const takeScreenShot = (page: puppeteer.Page, path: string) =>
  tryCatch(
    () =>
      page.screenshot({
        path
      }),
    reason =>
      new Error(
        `puppetterでスクリーンショットを撮ろうとしましたが失敗しました: ${reason}`
      )
  );

const NODE_ENV = getNodeEnv().run();
if (NODE_ENV === "development") {
  config({ path: resolve(__dirname, "../.env") });
}

const fa = getUserData().run();
if (fa.isLeft()) {
  error(fa.value)
    .chain(() => panic)
    .run();
}
// TODO: asをやめる
const [ID, PASS] = fa.value as [ID, PASS];
export const task = tryCatch(
  () => puppeteer.launch(),
  reason => new Error(`puppeteer の起動に失敗しました: ${reason}`)
)
  .chain<[puppeteer.Browser, puppeteer.Page]>(browser =>
    tryCatch(
      () =>
        browser.newPage().then(page => {
          return [browser, page];
        }),
      reason =>
        new Error(`puppetterで空の新規ページを開けませんでした: ${reason}`)
    )
  )
  .chain<[puppeteer.Browser, puppeteer.Page]>(([browser, page]) =>
    tryCatch(
      () =>
        page.goto(TWINS_URL, { waitUntil: "networkidle0" }).then(() => {
          return [browser, page];
        }),
      reason =>
        new Error(`puppetterで${TWINS_URL}を開けませんでした: ${reason}`)
    )
  )
  .chain<[puppeteer.Browser, puppeteer.Page]>(([browser, page]) =>
    takeScreenShot(page, "klis-top.png").map(() => [browser, page])
  )
  .chain<[puppeteer.Browser, puppeteer.Page]>(([browser, page]) =>
    tryCatch(
      () =>
        page
          .type(
            "#LoginFormSlim tbody tr td > input[name='userName']",
            isoID.unwrap(ID)
          )
          .then(() =>
            page.type(
              "#LoginFormSlim tbody tr td > input[name='password']",
              isoPASS.unwrap(PASS)
            )
          )
          .then(() =>
            Promise.all([
              page.click("#LoginFormSlim tbody tr td > button[type='submit']"),
              page.waitForNavigation({ waitUntil: "networkidle0" })
            ])
          )
          .then(() => {
            return [browser, page];
          }),
      reason =>
        new Error(`ユーザ情報をフォームに入力する操作に失敗しました: ${reason}`)
    )
  )
  .chain<[puppeteer.Browser, puppeteer.Page]>(([browser, page]) =>
    takeScreenShot(page, "klis-mypage.png").map(() => [browser, page])
  )
  .chain<[puppeteer.Browser, puppeteer.Page, Clip | null]>(([browser, page]) =>
    tryCatch(
      () =>
        page
          .evaluate(() => {
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
          }, "div#wf_PTW0005100-s_20120920145137-mysch-portlet-list > ul.mysch-portlet-list")
          .then(clip => [browser, page, clip]),
      reason =>
        new Error(
          `今日の休講情報を取得しようとしましたが、失敗しました: ${reason}`
        )
    )
  )
  .chain(([browser, page, clip]) =>
    tryCatch(
      () =>
        clip
          ? page
              .screenshot({ clip, path: "kyuko.png" })
              .then(taken => {
                // TODO: リファクタリングをする
                const content = taken.toString("base64");
                const fa = setAPIKeyToMailClient().run();
                if (fa.isLeft()) {
                  throw fa.value;
                }
                return sendMail(content, buildMailAddress(ID));
              })
              .then(() =>
                console.log(
                  "休校情報が見つかったため、スクリーンショットを撮影しメールで通知しました。"
                )
              )
          : Promise.resolve(console.log("今日休講の講義はないようです。")),
      reason => new Error(`スクリーンショットの撮影に失敗しました: ${reason}`)
    ).map(() => browser)
  )
  .chain(browser =>
    tryCatch(
      () => browser.close(),
      reason => new Error(`puppetterが正常に終了しませんでした: ${reason}`)
    )
  );
