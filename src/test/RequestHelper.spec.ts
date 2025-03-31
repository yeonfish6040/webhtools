import {CookieBuilder, RequestHelper} from "../";
import {Tester} from "./types";

export class RequestHelperSpec implements Tester {
  name = "RequestHelperSpec";

  expected = `[true,"emilys",true]`;

  async run(): Promise<any> {
    const results = [];

    const rh2 = new RequestHelper("https://httpbin.org/basic-auth/foo/bar");
    rh2.setBasicAuth("foo", "bar");
    const res2 = await rh2.get<{
      authenticated: boolean,
      user: string
    }>("");

    const rh3 = new RequestHelper("https://dummyjson.com/")
      .setContentType("application/json");
    const res3 = await rh3.post<{
      accessToken: string,
      refreshToken: string,
      id: number,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      gender: string,
      image: string,
    }>("/auth/login", {
      username: "emilys",
      password: "emilyspass",
    });

    const rh4 = await RequestHelper.from(1859);
    const res4 = await rh4.get("/");

    const rh5 = new RequestHelper("https://webhook.site/f11f1553-decb-446b-8b87-a152210d4d4e");
    const res5 = await rh5.get("/?i=hate&you=true", { hello: "fuck you" });

    return JSON.stringify([res2.json?.authenticated, res3.json?.username, res4.ok]);
  }
}