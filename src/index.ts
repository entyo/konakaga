import * as nodecron from 'node-cron';
import { getNodeEnv } from './nodeenv';
import { runAllAsync } from './program';

const nodeEnv = getNodeEnv().run()
if (nodeEnv === "development") {
  runAllAsync;
} else {
  // nodecron.schedule('0 0 0 * * *', () => runAllAsync);
  // test
  nodecron.schedule('0 0 0 * *', () => runAllAsync);
}
