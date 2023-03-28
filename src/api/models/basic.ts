export interface PageRequest {
  pageNo: number;
  pageSize: number;
}

export interface PageResponse<T = any> {
  pageNo: number;
  pageSize: number;
  total: number;
  data: T[];
}
