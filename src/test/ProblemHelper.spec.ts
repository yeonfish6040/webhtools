import {Tester} from "./types";
import {ProblemHelper} from "../DreamhackHelper";

export class ProblemHelperSpec implements Tester {
  name = "ProblemHelperSpec";

  expected = "";

  async run(): Promise<any> {
    const ph = await (new ProblemHelper(927)).init();
    await ph.openVM();
    console.log(ph.getURL());
    // await ph.closeVM();

    return "";
  }
}