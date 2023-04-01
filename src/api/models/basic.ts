export interface PageReq {
  pageNum: number;
  pageSize: number;
}

export interface PageRes<T = any> {
  current: number;
  size: number;
  total: number;
  record: T[];
}
