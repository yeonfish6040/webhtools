"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemHelperSpec = void 0;
const DreamhackHelper_1 = require("../DreamhackHelper");
class ProblemHelperSpec {
    name = "ProblemHelperSpec";
    expected = "";
    async run() {
        const ph = new DreamhackHelper_1.ProblemHelper(927);
        console.log(await ph.openVM());
        await ph.closeVM();
        return "";
    }
}
exports.ProblemHelperSpec = ProblemHelperSpec;
