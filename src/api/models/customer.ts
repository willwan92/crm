import { StatusEnum } from '@/enums/statusEnum';
import { PageReq } from '@/models/basic';

export interface QueryCustomerReq extends PageReq {
  customerName: string;
  customerLevel: string;
  shareStatus: StatusEnum | null;
  status: StatusEnum | null;
}

export interface QueryCustomerRes {
  accountResourceName: string;
  areaName: string;
  cityName: string;
  createTime: string;
  customerCode: string;
  customerLevel: string;
  customerName: string;
  customerSource: string;
  followUpTime: string;
  id: string;
  notFollowUpDays: string;
  sourceAccountName: string;
}

export interface AddCustomerReq {
  accountResourceId: string;
  accountResourceName: string;
  areaId: string;
  areaName: string;
  contactName: string;
  contactPhone: string;
  contactPosition: string;
  customerName: string;
  customerSource: string;
  industry: string;
  mainProduct: string;
  mergerName: string;
  organizationCode: string;
  registerAddress: string;
  registerCapital: string;
  registerTime: string;
  relaEnterprises: string;
  rentType: string;
  requireArea: string;
  spaceCondition: string;
  unitType: string;
}

export interface UpdateUserStatusReq {
  userId: string;
  currentStatus: StatusEnum;
}
