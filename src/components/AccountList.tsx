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
      <table>
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Type</th>
            <th>Status</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.accountType}</td>
              <td>{account.status}</td>
              <td>{formatCurrency(account.balance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
