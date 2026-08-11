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
import { AccountOperation } from '../enums/Transfer';



type TransferFormProps = {
  accounts: Account[];
  onTransferComplete: () => void;
};

export function TransferForm({ accounts, onTransferComplete }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [accountOperation, setAccountOperation] = useState<AccountOperation>(AccountOperation.Transfer);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);

  //const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setMessage(null);
    setMessageType(null);

    if (accountOperation === AccountOperation.ReviewTransactions) {
      setMessage('Review Transactions selected. Implement review flow here.');

      /** TODO: Implement review transaction logic
       * define the state for transactions and loading and error
       * call the getCustomerTransactions function from the api/client.ts file
       * pass the fromAccount as the accountId to the function
       * set the transactions state with the result
       * handle loading and error states accordingly
       */


      setMessageType('success');
      setSubmitting(false);
      return;
    }

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

  const resetForm = () => {
    setFromAccount('');
    setToAccount('');
    setAmount('');
  };

  return (
    <section className="transfer-form">
      <h2>Account Operations</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="accountOperation">Select Operation</label>
          <select
            id="accountOperation"
            value={accountOperation}
            onChange={(e) => setAccountOperation(e.target.value as AccountOperation)}          >
            <option value={AccountOperation.Transfer}>Transfer</option>
            <option value={AccountOperation.ReviewTransactions}>Review Transactions</option>
          </select>
        </div>
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
          <label htmlFor="toAccount"
            style={{ display: accountOperation === AccountOperation.ReviewTransactions ? 'none' : 'block' }}>
            To Account Number
          </label>
          <input
            id="toAccount"
            type="text"
            placeholder="Destination account number"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            required
            disabled={accountOperation === AccountOperation.ReviewTransactions}
            style={{ display: accountOperation === AccountOperation.ReviewTransactions ? 'none' : 'block' }}
          />
        </div>

        <div className="form-row">
          <label htmlFor="amount"
            style={{ display: accountOperation === AccountOperation.ReviewTransactions ? 'none' : 'block' }}>
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            disabled={accountOperation === AccountOperation.ReviewTransactions}
            style={{ display: accountOperation === AccountOperation.ReviewTransactions ? 'none' : 'block' }}
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : accountOperation === AccountOperation.Transfer ? 'Transfer' : 'Review Transactions'}
          </button>
          {/* Todo: Add a reset button. on click it should reset the form fields . use the resetForm function */}
          <button type="button" onClick={resetForm} disabled={submitting}>
            Reset
          </button>
        </div>

        {message && <p className={`form-message ${messageType}`}>{message}</p>}
      </form>
    </section>

  );
}
