"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CookieBuilder_spec_1 = require("./CookieBuilder.spec");
const RequestHelper_spec_1 = require("./RequestHelper.spec");
const ProblemHelper_spec_1 = require("./ProblemHelper.spec");
const Webhook_spec_1 = require("./Webhook.spec");
const targetTests = [new CookieBuilder_spec_1.CookieBuilderSpec(), new RequestHelper_spec_1.RequestHelperSpec(), new ProblemHelper_spec_1.ProblemHelperSpec(), new Webhook_spec_1.WebhookSpec()];
let total = targetTests.length;
let success = 0;
let fail = 0;
async function runTest() {
    const tests = targetTests.map(async (testClass) => {
        try {
            const testResult = await testClass.run();
            if (testResult !== testClass.expected) {
                fail++;
                throw Error(`Test failed: ${testClass.name}\nExpected ${testClass.expected}\nbut got ${testResult}`);
            }
            else {
                success++;
                console.log(`Test passed: ${testClass.name}`);
            }
        }
        catch (e) {
            fail++;
            console.error(e);
        }
    });
    await Promise.all(tests);
    console.log(`Test passed ${success} of ${total}. ${fail} failed.`);
    if (total === success) {
        console.log("All test has executed successfully.");
        process.exit();
    }
    else {
        throw Error("Test failed.");
    }
}
runTest().then(() => {
});
