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
  cityId: string;
  cityName: string;
  contactName: string;
  contactPhone: string;
  contactPosition: string;
  customerName: string;
  customerSource: string;
  customerAddr: string;
  industry: string;
  mainProduct: string;
  organizationCode: string;
  registerAddress: string;
  registerCapital: string;
  registerDate: string;
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
