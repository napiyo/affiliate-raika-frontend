export interface User {
  role: USER_ROLE_TYPE;
  verifiedEmail: boolean;
  suspended: boolean;
  _id: string;
  email: string;
  phone:string;
  name:string;
  referralToken: string;
  bankName?:string,
  accountNumber?:number,
  ifsc?:string,
  upiId?:string
  createdAt: string;
  updatedAt: string;
  // __v: number;
  balance:number,
  lifetimeEarnings: number;
  lifetimeWithdrawn: number;
  points:number,
  lifetimePointsEarnings: number;
  lifetimePointsWithdrawn: number;
  totalLeadsConv: number;
  totalLeads: number;
}


export interface TransactionInterface {
  type: TransactionType,
  amount: number,
  comment: string,
  createdAt: string,
  reference:string,
  txnId:string,
  user:string,
  createdBy:string
}

export const sampleUser: User = {
  _id: "USER_404",
  name: "NOT EXIST",
  verifiedEmail:true,
  suspended:false,
  role:'user',
  email: "@",
  phone: "+91 ",
  bankName: "State Bank of India",
  accountNumber: 1234567890123456,
  upiId: "UPI ID",
  ifsc: "SBIN0001234",
  balance: 0,
  lifetimeEarnings: 0,
  lifetimeWithdrawn: 0,
  totalLeadsConv: 0,
  totalLeads: 0,
  referralToken:'test',
  points:0,
  lifetimePointsEarnings:0,
  lifetimePointsWithdrawn:0,
  createdAt:new Date().getTime().toString(),
  updatedAt:new Date().getTime().toString(),
}
export const USER_ROLE = ['admin','user','sales','goldUser']
export type USER_ROLE_TYPE = 'admin' | 'user' | 'sales' |'goldUser';

export const Role_ENUM = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  SALES: 'sales',
  GOLDUSER:'goldUser'
});

export const TRANSACTIONS_TYPES = ["CREDIT", "DEBIT", "WITHDRAWAL" , 'LOYALITY_POINT_CREDIT', 'LOYALITY_POINT_DEBIT'];
export const TRANSACTIONS_TYPES_FOR_SALES = [ "DEBIT", "WITHDRAWAL" , 'LOYALITY_POINT_DEBIT'];
export type TransactionType = 'CREDIT' | 'DEBIT' | 'WITHDRAWAL' | 'LOYALITY_POINT_CREDIT | LOYALITY_POINT_DEBIT'
export const TRANSACTIONS_ENUM = Object.freeze({
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
  WITHDRAWAL:'WITHDRAWAL',
  LOYALITY_POINT_CREDIT:'LOYALITY_POINT_CREDIT',
  LOYALITY_POINT_DEBIT:"LOYALITY_POINT_DEBIT"
});

export interface Lead {
  id: string;
  name: string;
  // status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  status:'New' | 'InProgress' | 'ShootCompleted' | 'Lost';
  email?: string;
  phone: string;
  requirement: string;
  createdOn: Date;
  source: 'affiliate-link' | 'affiliate-manual';
}