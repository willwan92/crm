export interface PageReq {
  current: number;
  size: number;
}

export interface PageRes<T = any> {
  current: number;
  size: number;
  total: number;
  record: T[];
}
