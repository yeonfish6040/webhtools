"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHelperSpec = void 0;
const __1 = require("../");
class RequestHelperSpec {
    name = "RequestHelperSpec";
    expected = `[true,"emilys",true]`;
    async run() {
        const results = [];
        const rh2 = new __1.RequestHelper("https://httpbin.org/basic-auth/foo/bar");
        rh2.setBasicAuth("foo", "bar");
        const res2 = await rh2.get("");
        const rh3 = new __1.RequestHelper("https://dummyjson.com/")
            .setContentType("application/json");
        const res3 = await rh3.post("/auth/login", {
            username: "emilys",
            password: "emilyspass",
        });
        const rh4 = await __1.RequestHelper.from(1859);
        const res4 = await rh4.get("/");
        return JSON.stringify([res2.json?.authenticated, res3.json?.username, res4.ok]);
    }
}
exports.RequestHelperSpec = RequestHelperSpec;
