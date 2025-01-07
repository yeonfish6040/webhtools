"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestHelperSpec = void 0;
const __1 = require("../");
class RequestHelperSpec {
    name = "RequestHelperSpec";
    expected = "The Shawshank Redemption";
    async run() {
        const rh = new __1.RequestHelper("https://dummyapi.online/api");
        const res = await rh.sendRequest("GET", "/movies/1");
        return res.json?.movie;
    }
}
exports.RequestHelperSpec = RequestHelperSpec;
