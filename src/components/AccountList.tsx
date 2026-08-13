/**
 * AccountList component (completed solution).
 *
 * Displays the customer's accounts in a table. Receives the accounts
 * data and loading/error state from its parent. This is a "presentational"
 * component: given props, it renders markup with no internal state.
 */

import type { Account } from '../api/types';
import { formatCurrency } from '../utils/format';

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

  return (
    <section className="account-list">
      <h2>Your Accounts</h2>
      <div className="account-grid">
        {accounts.map((account) => {
          const inactive = String(account.accountStatus).toLowerCase().includes('inactive');
          return (
            <article className="account-card card" key={account.accountNumber}>
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
