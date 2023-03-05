/** router params type */
export interface Params {
  data: { id: string };
  hashString: string;
  params: null;
  queryString: string;
  route: {
    handler: {
      length: number;
      name: string;
    };
    hooks: object;
    name: string;
    path: string;
  };
  url: string;
}
