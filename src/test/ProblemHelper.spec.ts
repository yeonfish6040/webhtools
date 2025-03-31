import {Tester} from "./types";
import {ProblemHelper} from "../DreamhackHelper";

export class ProblemHelperSpec implements Tester {
  name = "ProblemHelperSpec";

  expected = "";

  async run(): Promise<any> {
    const ph = await (new ProblemHelper(927)).init();
    console.log(await ph.openVM());
    await ph.closeVM();

    return "";
  }
}