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
import type { Account, AuditorData } from './api/types';
import './styles/App.css';
import { getAccounts, getFlashMessage } from './api/client';
import { TransferForm } from './components/TransferForm';
import { useAuth } from './auth/AuthContext';
import { SignInScreen } from './components/SignInScreen';
import { DepositWithdrawForm } from './components/DepositWithdrawForm';
import Menu from './components/Menu';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { CustomerTransactions } from './components/CustomerTransactions';

import Ribbon from './components/Ribbon';
import Auditor from './components/Auditor';
export function App() {
  const { user, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [flashType, setFlashType] = useState<string | null>(null);
  const [flashError, setFlashError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [auditorData, setAuditorData] = useState<AuditorData[]>([]);
  const loadFlashMessage = useCallback(async () => {
    try {
      const flashMsg = await getFlashMessage();
      setFlashMessage(flashMsg ? flashMsg : "In observance of Independence Day, our bank will be closed on [Aug 15th 2026].We will reopen on [16th Aug 2026] during regular business hours.Happy Independence Day!");
      setFlashType(flashMsg ? 'warning' : 'info');
      setFlashError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setFlashError(message);
      setFlashMessage(null);
      setFlashType('error');
      console.error('Flash message error:', message);
    }
  }, []);
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
      loadFlashMessage();
    } else {
      setFlashMessage(null);
      setFlashType(null);
      setFlashError(null);
      setVisible(false);
    }
  }, [user, loadAccounts, loadFlashMessage]);

  useEffect(() => {
    if (!flashMessage) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  return (
    <div className="App">
      <Header />
      {user && (
        <Ribbon
          visible={visible}
          onClose={() => setVisible(false)}
          message={flashMessage ?? flashError ?? 'No flash message available'}
          type={flashType ?? 'info'}
        />
      )}
      <BrowserRouter>
        <Menu />
        <main>
          {authLoading ? (
            <p className="status-message">Loading user info...</p>
          ) : !user ? (
            <SignInScreen />
          ) : (
            <Routes>
              <Route
                path="/deposits"
                element={<DepositWithdrawForm accounts={accounts} onTransferComplete={loadAccounts} />}
              />
              <Route
                path="/transactions"
                element={<TransferForm accounts={accounts} onTransferComplete={loadAccounts} />}
              />
              <Route
                path="/audits"
                element={<Auditor auditorData={auditorData} loading={loading} error={error} />}
              />
              <Route
                path="/"
                element={
                  <>
                    <AccountList accounts={accounts} loading={loading} error={error} />

                    {/* <TransferForm accounts={accounts} onTransferComplete={loadAccounts} />
                    <CustomerTransactions accountId={accounts.length > 0 ? accounts[0].id : ''} /> */}
                  </>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
      </BrowserRouter>
    </div>

  );
}
