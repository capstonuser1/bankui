import React, { useEffect, useState } from 'react';
import { Account, Customer } from '../api/types';
import { getCustomers, getAccountsbyCustomerId, postPayment } from '../api/client.ts';
import '../styles/PaymentUtility.css';

type PaymentUtilityProps = {
  onPaymentComplete: () => void;
};

const UTILITY_OPTIONS = [
  {
    id: 'electricity',
    name: 'Electricity',
    icon: '⚡',
    description: 'Pay your electric bill',
    placeholder: 'Meter #'
  },
  {
    id: 'water',
    name: 'Water',
    icon: '💧',
    description: 'Pay your water bill',
    placeholder: 'Water Account #'
  },
  {
    id: 'gas',
    name: 'Gas',
    icon: '🔥',
    description: 'Pay your gas bill',
    placeholder: 'Gas Account #'
  },
  {
    id: 'broadband',
    name: 'Broadband',
    icon: '📡',
    description: 'Pay your internet bill',
    placeholder: 'Service Account #'
  }
];

export function PaymentUtility({ onPaymentComplete }: PaymentUtilityProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fromAccounts, setFromAccounts] = useState<Account[]>([]);
  const [toAccounts, setToAccounts] = useState<Account[]>([]);
  
  const [fromCustomer, setFromCustomer] = useState<string>('');
  const [toCustomer, setToCustomer] = useState<string>('');
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentType, setPaymentType] = useState<'transfer' | 'bill-payment' | 'scheduled'>('bill-payment');
  const [selectedUtility, setSelectedUtility] = useState<string>('electricity');
  const [utilityAccountNumber, setUtilityAccountNumber] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>('');

  // Load customers on mount
  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  // Default the fromCustomer to the first customer when customers load
  useEffect(() => {
    if (customers.length > 0 && !fromCustomer) {
      setFromCustomer(customers[0].customerNumber);
    }
  }, [customers, fromCustomer]);

  // Load from-accounts when fromCustomer changes
  useEffect(() => {
    if (fromCustomer) {
      const loadAccounts = async () => {
        try {
          const data = await getAccountsbyCustomerId(fromCustomer);
          setFromAccounts(data);
          setFromAccount('');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load accounts');
        }
      };
      loadAccounts();
    } else {
      setFromAccounts([]);
    }
  }, [fromCustomer]);

  // Load to-accounts when toCustomer changes
  useEffect(() => {
    if (toCustomer) {
      const loadAccounts = async () => {
        try {
          const data = await getAccountsbyCustomerId(toCustomer);
          setToAccounts(data);
          setToAccount('');
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to load accounts');
        }
      };
      loadAccounts();
    } else {
      setToAccounts([]);
    }
  }, [toCustomer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!fromAccount) {
      setError('Please select a from account');
      return;
    }

    if (paymentType === 'transfer' && !toAccount) {
      setError('Please select a to account for transfers');
      return;
    }

    if (paymentType === 'bill-payment' && !utilityAccountNumber) {
      setError('Please enter the utility account number');
      return;
    }

    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    if (paymentType === 'scheduled' && !scheduleDate) {
      setError('Please select a schedule date');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll simulate different payment types
      let toAccountNum = toAccount;
      const transactionTypeValue = 'TRANSFER';
      
      if (paymentType === 'bill-payment') {
        const utility = UTILITY_OPTIONS.find(u => u.id === selectedUtility);
        toAccountNum = `${utility?.name.toUpperCase()}_${utilityAccountNumber}`;
      } else if (paymentType === 'scheduled') {
        toAccountNum = toAccount || 'SCHEDULED';
      }

      await postPayment({
        
        amount: value,
        reference : paymentType === 'bill-payment' ? `${selectedUtility.toUpperCase()}_${utilityAccountNumber}` : 'N/A',
      });

      const typeLabel = 
        paymentType === 'transfer' ? 'Transfer' :
        paymentType === 'bill-payment' ? `${UTILITY_OPTIONS.find(u => u.id === selectedUtility)?.name} Payment` :
        'Scheduled Payment';

      setSuccess(`${typeLabel} of $${value.toFixed(2)} completed successfully!`);
      
      // Reset form
      setAmount('');
      setFromAccount('');
      setToAccount('');
      setScheduleDate('');
      setUtilityAccountNumber('');
      
      onPaymentComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="payment-utility">
      <h2>Payment Utility Center</h2>
      <p className="subtitle">Manage all your utility payments in one place</p>

      <form onSubmit={handleSubmit} className="card payment-card payment-form">
        {/* Payment Type Selection */}
        <div className="form-section">
          <h2>Payment Type</h2>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="bill-payment"
                checked={paymentType === 'bill-payment'}
                onChange={(e) => setPaymentType(e.target.value as 'transfer' | 'bill-payment' | 'scheduled')}
              />
              <span>Bill Payment</span>
              <span className="description">Pay bills from your account</span>
            </label>
          </div>
        </div>

        {/* From Account */}
        <div className="form-section">
          <h2>From Account</h2>
          <div className="form-row columns">
            <div className="form-group">
              <label className="label" htmlFor="from-account">Account</label>
              <select
                id="from-account"
                className="select-3d input"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                required
              >
                <option value="">-- Select Account --</option>
                {fromAccounts.map((a) => (
                  <option key={a.accountNumber} value={a.accountNumber}>
                    {a.accountNumber} ({a.accountType}, ${a.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* To Account (for transfers) */}
        {paymentType === 'transfer' && (
          <div className="form-section">
            <h2>To Account</h2>
            <div className="form-row columns">
              <div className="form-group">
                <label className="label" htmlFor="to-customer">Recipient Customer</label>
                <select
                  id="to-customer"
                  className="select-3d input"
                  value={toCustomer}
                  onChange={(e) => setToCustomer(e.target.value)}
                  required
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map((c) => (
                    <option key={c.customerId} value={c.customerNumber}>
                      {c.fullName} ({c.customerNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="to-account">Recipient Account</label>
                <select
                  id="to-account"
                  className="select-3d input"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  required
                >
                  <option value="">-- Select Account --</option>
                  {toAccounts.map((a) => (
                    <option key={a.accountNumber} value={a.accountNumber}>
                      {a.accountNumber} ({a.accountType}, ${a.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Utility Selection (for bill payments) */}
        {paymentType === 'bill-payment' && (
          <div className="form-section">
            <h2>Select Utility</h2>
            <div className="utility-grid">
              {UTILITY_OPTIONS.map((utility) => (
                <label
                  key={utility.id}
                  className={`utility-option ${selectedUtility === utility.id ? 'selected' : ''}`}
                  onClick={() => setSelectedUtility(utility.id)}
                >
                  <input
                    type="radio"
                    name="utility"
                    value={utility.id}
                    checked={selectedUtility === utility.id}
                    onChange={(e) => setSelectedUtility(e.target.value)}
                    style={{ display: 'none' }}
                  />
                  <div className="utility-icon">{utility.icon}</div>
                  <div className="utility-name">{utility.name}</div>
                  <div className="utility-description">{utility.description}</div>
                </label>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="label" htmlFor="utility-account">Consumer Number</label>
              <input
                id="utility-account"
                className="input"
                type="text"
                value={utilityAccountNumber}
                onChange={(e) => setUtilityAccountNumber(e.target.value)}
                placeholder={UTILITY_OPTIONS.find(u => u.id === selectedUtility)?.placeholder}
                required
              />
            </div>
          </div>
        )}

        {/* Amount */}
        <div className="form-section">
          <h2>Payment Details</h2>
          <div className="form-row columns">
            <div className="form-group">
              <label className="label" htmlFor="amount">Amount ($)</label>
              <input
                id="amount"
                className="input"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            {paymentType === 'scheduled' && (
              <div className="form-group">
                <label className="label" htmlFor="schedule-date">Schedule Date</label>
                <input
                  id="schedule-date"
                  className="input"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </div>
      </form>
    </section>
  );
}
