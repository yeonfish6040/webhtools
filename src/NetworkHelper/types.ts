export type BodyRequest = Request & { body: any, headers: any };

export type Listener = (req: BodyRequest) => any;