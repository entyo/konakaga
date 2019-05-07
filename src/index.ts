import * as nodecron from 'node-cron';
import { getNodeEnv } from './nodeenv';
import { runAllAsync } from './program';

const nodeEnv = getNodeEnv().run()
console.log(process.env.NODE_ENV, process.env.TWINS_ID, process.env.TWINS_PASS, process.env.SENDGRID_API_KEY);
if (nodeEnv === "development") {
  runAllAsync;
} else {
  // nodecron.schedule('0 0 0 * * *', () => runAllAsync);
  // test
  const t = nodecron.schedule('* * * * *', () => runAllAsync);
  t.start();
}
