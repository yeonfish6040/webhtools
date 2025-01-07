"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieBuilderSpec = void 0;
const RequestHelper_1 = require("../RequestHelper");
class CookieBuilderSpec {
    name = "CookieBuilderSpec";
    expected = "hello=world; i%20hate=this%20world";
    async run() {
        return new RequestHelper_1.CookieBuilder()
            .setCookie("hello", "world")
            .setCookie("i hate", "this world")
            .build();
    }
}
exports.CookieBuilderSpec = CookieBuilderSpec;
