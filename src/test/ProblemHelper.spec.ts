import {Tester} from "./types";
import {ProblemHelper} from "../DreamhackHelper";

export class ProblemHelperSpec implements Tester {
  name = "ProblemHelperSpec";

  expected = "";

  async run(): Promise<any> {
    const ph = new ProblemHelper(927);
    console.log(await ph.openVM());
    await ph.closeVM();

    return "";
  }
}