import { Newtype, prism, iso } from "newtype-ts";
import { IO } from "fp-ts/lib/IO";
import { fromNullable, Option } from "fp-ts/lib/Option";
import { Either } from "fp-ts/lib/Either";
import { left, right } from "fp-ts/lib/Either";

// https://www.cc.tsukuba.ac.jp/wp/service/account/#utid-name
export interface ID extends Newtype<{ readonly ID: unique symbol }, string> {}
const startWithS = (maybeID: string) => maybeID.startsWith("s");
const isValidLengthAsID = (maybeID: string) => maybeID.length === 8;
const validateID = isValidLengthAsID && startWithS;
const id = prism<ID>(validateID);

// https://account.tsukuba.ac.jp/cgi-bin/changepwd.cgi
export interface PASS extends Newtype<{ readonly ID: unique symbol }, string> {}
const isValidLengthAsPASS = (pass: string) =>
  pass.length >= 8 && pass.length <= 16;
const pass = prism<PASS>(isValidLengthAsPASS);

const _ = "";

function getID(): IO<Option<ID>> {
  return new IO(() =>
    id.getOption(fromNullable(process.env.TWINS_ID).getOrElse(_))
  );
}

function getPASS(): IO<Option<PASS>> {
  return new IO(() =>
    pass.getOption(fromNullable(process.env.TWINS_PASS).getOrElse(_))
  );
}

export const isoID = iso<ID>();
export const isoPASS = iso<PASS>();

export function getUserData(): IO<Either<Error, [ID, PASS]>> {
  return getID().chain(id =>
    getPASS().map(pass =>
      id.isNone() || pass.isNone()
        ? left<Error, [ID, PASS]>(
            new Error(`ログイン情報が不正です。\nid: ${id}\npass:${pass}`)
          )
        : right<Error, [ID, PASS]>([id.value, pass.value])
    )
  );
}

export const TWINS_URL = "https://twins.tsukuba.ac.jp";

export function buildMailAddress(id: ID): string {
  return `${isoID.unwrap(id)}@s.tsukuba.ac.jp`;
}
