"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CookieBuilder_spec_1 = require("./CookieBuilder.spec");
const RequestHelper_spec_1 = require("./RequestHelper.spec");
const targetTests = [new CookieBuilder_spec_1.CookieBuilderSpec(), new RequestHelper_spec_1.RequestHelperSpec()];
(async () => {
    let total = targetTests.length;
    let success = 0;
    let fail = 0;
    const tests = targetTests.map(async (testClass) => {
        try {
            const testResult = await testClass.run();
            if (testResult !== testClass.expected) {
                fail++;
                throw Error(`Test failed: ${testClass.name}`);
            }
            else {
                success++;
                console.log(`Test passed: ${testClass.name}`);
            }
        }
        catch (e) {
            console.error(e);
        }
    });
    await Promise.all(tests);
    console.log(`Test passed ${success} of ${total}. ${fail} failed.`);
    if (total === success) {
        console.log("All test successfully executed.");
    }
    else {
        console.log("Test failed.");
    }
})();
