/**
 * TypeScript types for the banking API.
 *
 * These types describe the shape of the data exchanged with the backend.
 * They are imported by the API client and by components that work with
 * accounts, customers, and transactions.
 */

//export type AccountStatus = 'ACTIVE' | 'INACTIVE';
export type AccountType = 'SAVINGS' | 'CHECKING';

export type Account = {
  accountId: number;
  accountNumber: string;
  customerId: string;
  accountType: AccountType;
  balance: number;
  accountStatus: string; // AccountStatus;
  openedDate: string;
};

export type User = {
  subject: string;
  preferredUsername: string;
  fullName: string;
  roles: string[];
};

export type TransactionStatus = 'COMPLETED' | 'FAILED';
export type TransactionType = 'TRANSFER' | 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export type Transaction = {
  transactionId: string;
  date: string;
  transactionType: TransactionType;
  amount: number;
  account1: string;
  account2: string | null;
  status: TransactionStatus;
};

export type TransactionList = {
  transactionId: string;
  accountNumber: string;
  transactionType: TransactionType;
  amount: number;
  transactionStatus: TransactionStatus;
  transactionDate: string;
  description: string;
};

export type TransferRequest = {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  transactionType: TransactionType;
};

export type TransferResponse = {
  transactionId: string;
  status: TransactionStatus;
};

export type Customer = {
  customerId: number;
  customerNumber: string;
  fullName: string;
  email: string;
  createdDate: Date;
};

export type AuditorData = {
  transactionId: string;
  accountNumber: string;
  customerName: string;
  transactionType: TransactionType;
  amount: number;
  transactionStatus: TransactionStatus;
  transactionDate: string;
  description: string;
  createdDate: Date;
};