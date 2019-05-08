import * as nodecron from "node-cron";
import { getNodeEnv } from "./nodeenv";
import { task, panic } from "./program";
import { log, error } from "fp-ts/lib/Console";
import { fromIO } from "fp-ts/lib/TaskEither";

const runnable = task
  .chain(() => fromIO(log("何もかも正常に動作しました👏")))
  .orElse(l =>
    fromIO(error(`致命的なエラーが発生しました ${l}`).chain(() => panic))
  );
const nodeEnv = getNodeEnv().run();
if (nodeEnv === "development") {
  runnable.run();
} else {
  const t = nodecron.schedule("0 0 0 * * *", () => runnable.run());
  t.start();
}
