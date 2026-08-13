import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CustomerTransactions } from './CustomerTransactions';

export default function RecentTransactionsPage() {
  const [searchParams] = useSearchParams();
  const account = searchParams.get('account') ?? '';

  if (!account) {
    return <p className="status-message">No account selected for recent transactions.</p>;
  }

  return <CustomerTransactions accountId={account} visible={true} />;
}
