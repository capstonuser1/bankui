/**
 * API client for the banking backend.
 *
 * All HTTP communication with the backend goes through this file. During
 * Lab A the requests are intercepted by Mock Service Worker (MSW) and
 * answered with canned data. In a later lab MSW will be removed and these
 * same calls will hit a real Spring Boot BFF without changing the
 * function signatures.
 */

import { Account, AuditorData, Customer, TransactionList, TransferRequest, TransferResponse, User } from './types';

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetch('/api/me', { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Failed to load current user: ${response.status}`);
  }

  if (response.ok && response.status === 401) {
    return null;
  }
  return response.json();
}

export async function getAccounts(): Promise<Account[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const roles = user.roles ?? [];
  const isPrivileged = roles.some((r) => /teller|auditor|/i.test(r));

  const url = isPrivileged
    ? '/api/accounts'
    : `/api/accountsbysubject?subject=${encodeURIComponent(user.subject)}`;
  
  // Debugging line

  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Failed to load accounts: ${response.status}`);
  }
  return response.json();
}

/**TODO: Implement the actual API call to fetch customer transactions based on the account ID */

export async function getCustomerTransactions(fromAccountNumber: string): Promise<TransactionList[]> {

  // return response.filter((transaction) => transaction.accountId === accountId);
  const url = `/api/accounts/${fromAccountNumber}/transactions`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Failed to load transactions: ${response.status}`);
  }
  return response.json();
}

export async function getAuditTransactions(): Promise<AuditorData[]> {

  // return response.filter((transaction) => transaction.accountId === accountId);
  //todo: generate dummy data for auditor transactions
  const dummyTransactions: AuditorData[] = [
    { transactionId: '1', customerName: 'Bob', accountNumber: '101-1010-11', transactionType: 'DEPOSIT', amount: 100, transactionStatus: 'COMPLETED', transactionDate: '2023-01-01', description: '', createdDate: new Date('2023-01-01') },
    { transactionId: '1', customerName: 'Alice', accountNumber: '101-1010-12', transactionType: 'DEPOSIT', amount: 200, transactionStatus: 'COMPLETED', transactionDate: '2023-01-02', description: '', createdDate: new Date('2023-01-02') },
  ]
  const response = dummyTransactions;
  // const url = `/api/accounts/auditTransactions`;
  // const response = await fetch(url, { headers: { Accept: 'application/json' } });
  // if (!response.ok) {
  //   throw new Error(`Failed to load transactions: ${response.status}`);
  // }
  //return response.json();
  return response;
}

export async function postTransfer(request: TransferRequest): Promise<TransferResponse> {
  const response = await fetch('/api/transfers', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Transfer failed: ${response.status}`);
  }
  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch('/logout', {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to logout: ${response.status}`);
  }
  if (response.status !== 302) {
    throw new Error('Login failed: expected redirect to login page');
  }
}

async function safeReadErrorMessage(response: Response): Promise<string | null> {
  try {
    const body = await response.json();
    if (body && typeof body.message === 'string') {
      return body.message;
    }
    return null;
  } catch {
    return null;
  }
}
export async function getFlashMessage(): Promise<string> {
  try {
    const response = await fetch('/api/flashmessage', {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      console.warn(`Failed to load flash message: ${response.status}`);
      return '';
    }
    const data = await response.text();
    console.log("Ribbon message data:", data);
    return data && typeof data === 'string' ? data.trim() : '';
  } catch (error) {
    console.error('Error fetching flash message:', error);
    return '';
  }
}

export async function postTransaction(request: TransferRequest): Promise<TransferResponse> {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Transfer failed: ${response.status}`);
  }
  return response.json();
}


export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch('/api/customers', {
    method: 'GET',
    headers: {
      Accept: 'application/json'

    },
  });
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Transfer failed: ${response.status}`);
  }
  return response.json();
}
export async function getAccountsbyCustomerId(customerNumber: string): Promise<Account[]> {
  const response = await fetch(`/api/${customerNumber}/accounts`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'

    },
  });
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Accounts failed: ${response.status}`);
  }
  return response.json();
}

export async function postAccountUpdateStatus(accountNumber: string, status: string): Promise<{ success?: boolean; message?: string }> {
  const response = await fetch('/api/accountupdatestatus', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accountNumber, status }),
  });

  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Account update failed: ${response.status}`);
  }

  return response.json();
}

type Payment = Record<string, unknown>;

export async function getPayments(): Promise<Payment[]> {
  const response = await fetch('/payments', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load payments: ${response.status}`);
  }

  return response.json();
}

export async function postPayment(request: Payment): Promise<Payment> {
  const response = await fetch('/payments', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Payment failed: ${response.status}`);
  }

  return response.json();
}

// Register subscriptions API helpers
export type RegisterSub = {
  id?: string;
  customerNumber?: string;
  plan?: string;
  startDate?: string;
  [key: string]: unknown;
};

export async function getRegisterSubs(): Promise<RegisterSub[]> {
  const response = await fetch('/registersubs', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Failed to load register subs: ${response.status}`);
  }
  return response.json();
}

export async function postRegisterSub(payload: RegisterSub): Promise<RegisterSub> {
  const response = await fetch('/registersubs', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await safeReadErrorMessage(response);
    throw new Error(message || `Register sub failed: ${response.status}`);
  }
  return response.json();
}
