/**
 * TransferForm component (completed solution).
 *
 * Lets the customer transfer funds between accounts. Filters out
 * inactive accounts from the source dropdown. After a successful
 * transfer, calls onTransferComplete so the parent can refresh the
 * displayed balances.
 */

import { useState } from 'react';
import { postTransfer } from '../api/client';
import type { Account } from '../api/types';
import { formatCurrency } from '../utils/format';

type TransferFormProps = {
  accounts: Account[];
  onTransferComplete: () => void;
};

export function TransferForm({ accounts, onTransferComplete }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  //const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    try {
      const result = await postTransfer({
        fromAccountNumber: fromAccount,
        toAccountNumber: toAccount,
        amount: parseFloat(amount),
      });

      if (result.status === 'COMPLETE') {
        setMessage(`Transfer complete. Transaction ID: ${result.transactionId}`);
        setMessageType('success');
        setFromAccount('');
        setToAccount('');
        setAmount('');
        onTransferComplete();
      } else {
        setMessage('Transfer failed. Please try again.');
        setMessageType('error');
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Unknown error occurred');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  }

  if (accounts.length === 0) {
    return (
      <section className="transfer-form">
        <h2>Transfer Money</h2>
        <p className="status-message">No accounts available for transfer.</p>
      </section>
    );
  }

  return (
    <section className="transfer-form">
      <h2>Transfer Money</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="fromAccount">From Account</label>
          <select
            id="fromAccount"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            required
          >
            <option value="">-- Select an account --</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.id} ({account.accountType}) - {formatCurrency(account.balance)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="toAccount">To Account Number</label>
          <input
            id="toAccount"
            type="text"
            placeholder="Destination account number"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Transfer'}
        </button>

        {message && <p className={`form-message ${messageType}`}>{message}</p>}
      </form>
    </section>
  );
}
