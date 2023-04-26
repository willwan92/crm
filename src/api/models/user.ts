import { StatusEnum } from '@/enums/statusEnum';
import { PageReq } from '@/models/basic';

export interface QueryUserReq extends PageReq {
  keyName: string;
  projectId: string;
  status: StatusEnum;
}

export interface UpdateUserStatusReq {
  userId: string;
  currentStatus: StatusEnum;
}
