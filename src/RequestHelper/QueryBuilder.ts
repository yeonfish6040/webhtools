export class QueryBuilder extends String {
  constructor(obj: any) {
    const build = (obj: any, parentKey: string) => {
      return Object.keys(obj)
          .map((key): string => {
            const newKey = parentKey ? `${parentKey}[${key}]` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
              return build(obj[key], newKey);
            } else {
              return `${newKey}=${encodeURIComponent(obj[key])}`;
            }
          })
          .join('&');
    }

    const query =  Object.keys(obj)
        .map(key => build(obj[key], key))
        .join('&');

    super(query);
  }
}