import {Tester} from "./types";
import {CookieBuilderSpec} from "./CookieBuilder.spec";
import {RequestHelperSpec} from "./RequestHelper.spec";
import {ProblemHelperSpec} from "./ProblemHelper.spec";
import {WebhookSpec} from "./Webhook.spec";

const targetTests: Tester[] = [new CookieBuilderSpec(), new RequestHelperSpec(), new ProblemHelperSpec(), new WebhookSpec()];

let total = targetTests.length;
let success = 0;
let fail = 0;
async function runTest() {
  const tests = targetTests.map(async (testClass) => {
    try {
      const testResult: any = await testClass.run();
      if (testResult !== testClass.expected) {
        fail++;
        throw Error(`Test failed: ${testClass.name}\nResult: ${testResult}`);
      } else {
        success++;
        console.log(`Test passed: ${testClass.name}`);
      }
    } catch (e) {
      fail++;
      console.error(e);
    }
  });
  await Promise.all(tests);

  console.log(`Test passed ${success} of ${total}. ${fail} failed.`);
  if (total === success) {
    console.log("All test has executed successfully.");
    process.exit();
  } else {
    throw Error("Test failed.");
  }
}

runTest().then(() => {
})
