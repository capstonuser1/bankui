import React, { useState } from 'react';
import { Account } from '../api/types';

type TransferFormProps = {
  accounts: Account[];
  onTransferComplete: () => void;
};

export function DepositWithdrawForm({ accounts, onTransferComplete }: TransferFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fromAccount, setFromAccount] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError('Enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccess(`${action === 'deposit' ? 'Deposited' : 'Withdrew'} $${value.toFixed(2)}`);
      setAmount('');
      onTransferComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
 if (error) return <p className="error">{error}</p>;
  return (
   <section className="deposit-withdraw-form">
      <h2>Deposit / Withdraw</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from-account">
            Account
             </label>
            <select
              id="from-account"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} ({a.accountType}, ${a.balance.toFixed(2)})
                </option>
              ))}
            </select>
         
        </div>

        <div className="form-group">
          <label htmlFor="action">
            Action 
          </label>
            <select
              id="action"
              value={action}
              onChange={(e) => setAction(e.target.value as 'deposit' | 'withdraw')}
            >
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
            </select>
           
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            Amount
             </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
         
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-large" disabled={loading}>
            {loading ? 'Processing...' : action === 'deposit' ? 'Deposit' : 'Withdraw'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </section>
  );
}