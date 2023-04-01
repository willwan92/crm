
import { StatusEnum } from '@/enums/statusEnum';
import { PageReq } from '@/models/basic';

export interface QueryUserReq extends PageReq {
    keyName: string;
    status: StatusEnum;
}

export interface QueryUserRes {
    accountName: string;
    accountPosition: string;
    id: string;
    status: StatusEnum;
    userName: string;
}

export interface UpdateUserStatusReq {
    userId: string;
    currentStatus: StatusEnum;
}