import {CookieBuilder} from "../RequestHelper";
import {Tester} from "./types";

export class CookieBuilderSpec implements Tester {
  name = "CookieBuilderSpec";

  expected = "hello=world; i%20hate=this%20world";

  async run(): Promise<any> {
    return new CookieBuilder()
      .setCookie("hello", "world")
      .setCookie("i hate", "this world")
      .build();
  }
}