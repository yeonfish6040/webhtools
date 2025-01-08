import {CookieBuilder, RequestHelper} from "../";
import {Tester} from "./types";

export class RequestHelperSpec implements Tester {
  name = "RequestHelperSpec";

  expected = `["The Shawshank Redemption",true,"emilys"]`;

  async run(): Promise<any> {
    const results = [];

    const rh1 = new RequestHelper("https://dummyapi.online/api");
    const res1 = await rh1.get<{
      id: number,
      movie: string,
      rating: number,
      image: string,
      imdb_url: string,
    }>("/movies/1");

    const rh2 = new RequestHelper("https://httpbin.org/basic-auth/foo/bar");
    rh2.setBasicAuth("foo", "bar");
    const res2 = await rh2.get<{
      authenticated: boolean,
      user: string
    }>("/");

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

    return JSON.stringify([res1.json?.movie, res2.json?.authenticated, res3.json?.username]);
  }
}