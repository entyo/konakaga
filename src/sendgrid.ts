import sgMail from "@sendgrid/mail";
import { IO } from "fp-ts/lib/IO";
import { Option, fromNullable } from "fp-ts/lib/Option";
import { fromOption, Either } from "fp-ts/lib/Either";

// TODO: 幽霊型をつかう
// type SgMail = typeof sgMail;

// type SgMailWithAPIKey = number & { readonly __DegreeBrand: unique symbol };

function getAPIKey(): IO<Option<string>> {
  console.log(`SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY}`);
  return new IO(() => fromNullable(process.env.SENDGRID_API_KEY));
}

export function setAPIKeyToMailClient(): IO<Either<Error, void>> {
  return getAPIKey().map(fa =>
    fromOption<Error>(new Error("SENGRID_API_KEYが設定されていません"))(fa).map(
      key => sgMail.setApiKey(key)
    )
  );
}

export function sendMail(content: string, to: string) {
  console.log(`${from} から ${to} に休校情報を通知します。`);
  return sgMail.send({
    to,
    from,
    subject: "[konakaga] 今日は休講の講義があります",
    html:
      "<p><a href='https://twins.tsukuba.ac.jp'>TWINS</a>にて詳細情報を確認してください。</p>",
    attachments: [
      {
        content,
        filename: "today's-classes.png",
        type: "image/png",
        disposition: "attachment"
      }
    ]
  });
}

const from = "konakaga.app@gmail.com";
