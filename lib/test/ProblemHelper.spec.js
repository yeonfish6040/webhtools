"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemHelperSpec = void 0;
const DreamhackHelper_1 = require("../DreamhackHelper");
class ProblemHelperSpec {
    name = "ProblemHelperSpec";
    expected = "";
    async run() {
        const ph = await (new DreamhackHelper_1.ProblemHelper(927)).init();
        await ph.openVM();
        console.log(ph.getURL());
        // await ph.closeVM();
        return "";
    }
}
exports.ProblemHelperSpec = ProblemHelperSpec;
