import { IO } from "fp-ts/lib/IO";

type PROD_OR_DEV = "development" | "production";
export function getNodeEnv(): IO<PROD_OR_DEV> {
  return new IO(() => _getNodeEnv());
}

const _getNodeEnv: () => PROD_OR_DEV = () =>
  process.env.NODE_ENV === "production" ? "production" : "development";
