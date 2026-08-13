import React, { useEffect, useState } from 'react';
import { Account, Customer } from '../api/types';
import { getAccountsbyCustomerId, getCustomers } from '../api/client.ts';

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
   const [customerNumber, setCustomerNumber] = useState<string>('');
   const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerAccounts, setCustomerAccounts] = useState<Account[]>([]);

   const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setCustomerNumber(selected);
    setFromAccount(''); // Reset the fromAccount when customer changes
    // Immediately bind accounts from the provided `accounts` prop for snappy UI
    const filtered = accounts.filter((a) => String(a.customerId) === selected);
    setCustomerAccounts(filtered);
    console.log(`Selected customer: ${selected}`);
    console.log('Filtered accounts count:', filtered.length);
  };

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
  useEffect(() => {
      const loadcustomers = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getCustomers();
          setCustomers(data);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      loadcustomers();
    }, []);
    useEffect(() => {
      if (customerNumber) {
        const loadCustomerAccounts = async () => {
          setLoading(true);
          setError(null);
          try {
            const data = await getAccountsbyCustomerId(customerNumber);
            console.log(`Loaded accounts for customer ${customerNumber}:`, data);
            setCustomerAccounts(data);
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error occurred');
          } finally {
            setLoading(false);
          }
        };
        loadCustomerAccounts();
      }
    }, [customerNumber]);
 if (error) return <p className="error">{error}</p>;
  return (
   <section className="deposit-withdraw-form">
      <h2>Deposit / Withdraw</h2>
      <form onSubmit={handleSubmit}>

         <div className="form-group">
          <label htmlFor="from-account">
            Customers
             </label>
            <select
              id="from-customer"
              value={customerNumber}
              onChange={handleCustomerChange}
              required
            >
              <option value="">-- Select --</option>
              {customers.map((a) => (
                <option key={a.customerNumber} value={a.customerNumber}>
                  {a.fullName}   {a.customerNumber}
                </option>
              ))}
            </select>
         
        </div>
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
              {customerAccounts.map((a) => (
                <option key={a.accountNumber} value={a.accountNumber}>
                  {a.accountNumber} ({a.accountType}, ${a.balance.toFixed(2)})
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

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : action === 'deposit' ? 'Deposit' : 'Withdraw'}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </section>
  );
}