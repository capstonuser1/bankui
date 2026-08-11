/**
 * App component (completed solution).
 *
 * Owns the accounts state and shares it between AccountList (read-only
 * display) and TransferForm (write actions). After a successful transfer
 * the form invokes loadAccounts to refresh the displayed balances.
 */
import { useState, useCallback, useEffect } from 'react';

import { Header } from './components/Header';
import { AccountList } from './components/AccountList';
import type { Account } from './api/types';
import './styles/App.css';
import { getAccounts } from './api/client';
import { TransferForm } from './components/TransferForm';
import { useAuth } from './auth/AuthContext';
import { SignInScreen } from './components/SignInScreen';

export function App() {
  const { user, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user, loadAccounts]);

  return (
    <div className="App">
      <Header />
      <main>
        {authLoading && <p className="status-message">Loading user info...</p>}
        {!authLoading && !user && <SignInScreen />}
        {!authLoading && user && (
          <>
            <AccountList accounts={accounts} loading={loading} error={error} />
            <TransferForm accounts={accounts} onTransferComplete={loadAccounts} />
          </>
        )}
      </main>
    </div>
  );
}
