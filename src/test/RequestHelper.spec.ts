import {RequestHelper} from "../";
import {Tester} from "./types";

export class RequestHelperSpec implements Tester {
  name = "RequestHelperSpec";

  expected = "The Shawshank Redemption";

  async run(): Promise<any> {
    const rh = new RequestHelper("https://dummyapi.online/api");
    const res = await rh.sendRequest<{
      id: number,
      movie: string,
      rating: number,
      image: string,
      imdb_url: string,
    }>("GET", "/movies/1");

    return res.json?.movie;
  }
}