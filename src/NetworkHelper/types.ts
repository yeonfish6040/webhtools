export type BodyRequest = Request & { body: any };

export type Listener = (req: BodyRequest) => any;