/**
 * AccountList component (completed solution).
 *
 * Displays the customer's accounts in a table. Receives the accounts
 * data and loading/error state from its parent. This is a "presentational"
 * component: given props, it renders markup with no internal state.
 */

import React, { useEffect, useState } from 'react';
import type { Account } from '../api/types';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { postAccountUpdateStatus } from '../api/client';

type AccountListProps = {
  accounts: Account[];
  loading: boolean;
  error: string | null;
};

export function AccountList({ accounts, loading, error }: AccountListProps) {
  if (loading) {
    return <p className="status-message">Loading accounts...</p>;
  }

  if (error) {
    return <p className="status-message error">Error: {error}</p>;
  }

  const totalAvailable = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

  const { user } = useAuth();
  const hideTotalForTeller = Boolean(user && user.preferredUsername === 'teller1');

  const isTeller = Boolean(user && (user.preferredUsername === 'teller1' || (user.roles && user.roles.some((r) => /teller/i.test(r)))));

  // local copy of accounts so UI can reflect status changes immediately
  const [localAccounts, setLocalAccounts] = useState<Account[]>(accounts);
  useEffect(() => setLocalAccounts(accounts), [accounts]);

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [updatingAccount, setUpdatingAccount] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const navigate = useNavigate();

  const openRecentTransactions = (accountNumber: string) => {
    navigate(`/recent-transactions?account=${encodeURIComponent(accountNumber)}`);
  };

  const handleCardClick = (account: Account) => {
    if (isTeller) {
      setOpenMenuFor((prev) => (prev === account.accountNumber ? null : account.accountNumber));
      return;
    }
    openRecentTransactions(account.accountNumber);
  };

  const setAccountStatus = (accountNumber: string, status: string) => {
    // optimistic UI update while calling API
    setActionError(null);
    setUpdatingAccount(accountNumber);
    (async () => {
      try {
        await postAccountUpdateStatus(accountNumber, status);
        setLocalAccounts((prev) => prev.map((a) => (a.accountNumber === accountNumber ? { ...a, accountStatus: status } : a)));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to update account status';
        setActionError(msg);
      } finally {
        setUpdatingAccount(null);
        setOpenMenuFor(null);
      }
    })();
  };

  return (
    <section className="account-list">
      <h2>Your Accounts</h2>
      {!hideTotalForTeller && (
        <div className="accounts-summary">
          <div className="summary-card">
            <div className="summary-label text-muted">Total available</div>
            <div className="summary-amount">{formatCurrency(totalAvailable)}</div>
          </div>
        </div>
      )}
      <div className="account-grid">
        {localAccounts.map((account) => {
          const inactive = String(account.accountStatus).toLowerCase().includes('inactive');
          return (
            <article
              className="account-card card clickable"
              key={account.accountNumber}
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick(account)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(account); }}
            >
              <div className="account-card-header">
                <div className="account-number">{account.accountNumber}</div>
                <div className={`account-status ${inactive ? 'inactive' : 'active'}`}>
                  {account.accountStatus}
                </div>
              </div>
              <div className="account-card-body">
                <div className="account-type text-muted">{account.accountType}</div>
                <div className="balance">
                  <div className="balance-label text-muted">Balance</div>
                  <div className="amount">{formatCurrency(account.balance)}</div>
                </div>
              </div>
              {isTeller && openMenuFor === account.accountNumber && (
                <div className="account-actions-menu" role="menu" aria-label="Account actions">
                  <button
                    className="action-btn"
                    onClick={(e) => { e.stopPropagation(); setAccountStatus(account.accountNumber, 'ACTIVE'); }}
                    disabled={updatingAccount === account.accountNumber}
                  >
                    {updatingAccount === account.accountNumber ? 'Updating...' : 'Activate'}
                  </button>
                  <button
                    className="action-btn"
                    onClick={(e) => { e.stopPropagation(); setAccountStatus(account.accountNumber, 'INACTIVE'); }}
                    disabled={updatingAccount === account.accountNumber}
                  >
                    {updatingAccount === account.accountNumber ? 'Updating...' : 'Inactivate'}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {actionError && <div className="form-message error">{actionError}</div>}
    </section>
  );
}
