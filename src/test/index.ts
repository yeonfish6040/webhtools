import {CookieBuilderSpec} from "./CookieBuilder.spec";
import {Tester} from "./types";
import {RequestHelperSpec} from "./RequestHelper.spec";

const targetTests: Tester[] = [new CookieBuilderSpec(), new RequestHelperSpec()];

(async () => {
  let total = targetTests.length;
  let success = 0;
  let fail = 0;
  const tests = targetTests.map(async (testClass) => {
    try {
      const testResult: any = await testClass.run();
      if (testResult !== testClass.expected) {
        fail++;
        throw Error(`Test failed: ${testClass.name}`);
      } else {
        success++;
        console.log(`Test passed: ${testClass.name}`);
      }
    } catch (e) {
      console.error(e);
    }
  });
  await Promise.all(tests);

  console.log(`Test passed ${success} of ${total}. ${fail} failed.`);
  if (total === success) {
    console.log("All test has executed successfully.");
  }else {
    console.log("Test failed.")
  }
})();
