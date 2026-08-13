/**
 * TransferForm component (completed solution).
 *
 * Lets the customer transfer funds between accounts. Filters out
 * inactive accounts from the source dropdown. After a successful
 * transfer, calls onTransferComplete so the parent can refresh the
 * displayed balances.
 */

import { useState } from 'react';
import { getCustomerTransactions, postTransfer } from '../api/client';
import type { Account } from '../api/types';
import { formatCurrency } from '../utils/format';
import { AccountOperation } from '../enums/Transfer';
import { CustomerTransactions } from './CustomerTransactions';



type TransferFormProps = {
  accounts: Account[];
  onTransferComplete: () => void;
};

export function TransferForm({ accounts, onTransferComplete }: TransferFormProps) {
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [accountOperation, setAccountOperation] = useState<AccountOperation>(AccountOperation.Transfer);
  const [showTransactions, setShowTransactions] = useState(false);
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
      // if (!fromAccount) {
      //   setMessage('Please select a source account first.');
      //   setMessageType('error');
      //   setSubmitting(false);
      //   return;
      // }

      // setShowTransactions(true);
      // setMessage(`Showing recent transactions for ${fromAccount}`);
      // setMessageType('success');
      // setSubmitting(false);
      // //todo: call getCustomerTransactions
      // const result_customer = await getCustomerTransactions(fromAccount);
      // console.log('Customer Transactions:', result_customer);
    }

    try {
      if (accountOperation === AccountOperation.Transfer) {
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
      }
      else if (accountOperation === AccountOperation.ReviewTransactions) {
        if (!fromAccount) {
          setMessage('Please select a source account first.');
          setMessageType('error');
          setSubmitting(false);
          return;
        }

        setShowTransactions(true);
        setMessage(`Showing recent transactions for ${fromAccount}`);
        setMessageType('success');
        setSubmitting(false);
        //todo: call getCustomerTransactions
        const result_customer = await getCustomerTransactions(fromAccount);
        console.log('Customer Transactions:', result_customer);
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
    setShowTransactions(false);
    setMessage(null);
  };

  const handleOperationChange = (value: AccountOperation): void => {
    setAccountOperation(value);
    setShowTransactions(false);
    setMessage(null);
  };

  const handleFromAccountChange = (value: string) => {
    setFromAccount(value);
    setShowTransactions(false);
    setMessage(null);
  };
  return (
    <section className="transfer-form">
      <h2>Account Operations</h2>
      <form onSubmit={handleSubmit} className="card transfer-card">
        <div className="form-row columns">
          <div className="form-group">
            <label className="label" htmlFor="accountOperation">Operation</label>
            <select
              id="accountOperation"
              className="select-3d input"
              value={accountOperation}
              onChange={(e) => handleOperationChange(e.target.value as AccountOperation)}
            >
              <option value={AccountOperation.Transfer}>Transfer</option>
              <option value={AccountOperation.ReviewTransactions}>Recent Transactions</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="fromAccount">From Account</label>
            <select
              id="fromAccount"
              className="select-3d input"
              value={fromAccount}
              onChange={(e) => handleFromAccountChange(e.target.value)}
              required
            >
              <option value="">-- Select an account --</option>
              {accounts.map((account) => (
                <option key={account.accountNumber} value={account.accountNumber}>
                  {account.accountNumber} ({account.accountType}) - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {accountOperation === AccountOperation.Transfer && (
          <>
            <div className="form-row columns">
              <div className="form-group">
                <label className="label" htmlFor="toAccount">To Account Number</label>
                <input
                  id="toAccount"
                  className="input"
                  type="text"
                  placeholder="Destination account number"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  className="input"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
          </>
        )}

        <div className="button-group">
          <button type="submit" className="btn btn-large" disabled={submitting}>
            {submitting ? 'Submitting...' : accountOperation === AccountOperation.Transfer ? 'Transfer' : 'View Transactions'}
          </button>
          <button type="button" className="btn secondary" onClick={resetForm} disabled={submitting}>
            Reset
          </button>
        </div>

        {message && <div className={`form-message ${messageType}`}>{message}</div>}
      </form>
      {/* show transactions grid only when "Recent Transactions" is selected and a fromAccount is chosen and View transactions is clicked */}
      {accountOperation === AccountOperation.ReviewTransactions && fromAccount && showTransactions && (
        <CustomerTransactions accountId={fromAccount} visible={showTransactions} />
      )}
    </section>

  );
}
