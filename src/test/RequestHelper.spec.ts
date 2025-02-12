import {CookieBuilder, RequestHelper} from "../";
import {Tester} from "./types";

export class RequestHelperSpec implements Tester {
  name = "RequestHelperSpec";

  expected = `[true,"emilys"]`;

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

    return JSON.stringify([res2.json?.authenticated, res3.json?.username]);
  }
}