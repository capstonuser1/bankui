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
import { DepositWithdrawForm } from './components/DepositWithdrawForm';
import Menu from './components/Menu';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { CustomerTransactions } from './components/CustomerTransactions';

//import Ribbon from './components/Ribbon';
export function App() {
  const { user, loading: authLoading } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  /*  const [ribbonMessage, setRibbonMessage] = useState<string | null>(null);
   const [ribbonType, setRibbonType] = useState<string | null>(null);
   const [ribbonError, setRibbonError] = useState<string | null>(null);
   const [visible, setVisible] = useState<boolean>(false);
   const loadRibbonMessage = useCallback(async () => {
      try {
        const ribbonMsg = await getRibbonMsg();
        setRibbonMessage(ribbonMsg);
        setRibbonType(ribbonMsg ? 'warning' : 'info');
        setRibbonError(null);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        setRibbonError(message);
        setRibbonMessage(null);
        setRibbonType('error');
        console.error('Ribbon message error:', message);
      }
    }, []); */
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
      // loadRibbonMessage();
    } else {
      /*  setRibbonMessage(null);
        setRibbonType(null);
        setRibbonError(null);
        setVisible(false); */
    }
  }, [user, loadAccounts]);
  /* 
   }, [user, loadAccounts, loadRibbonMessage]);
  useEffect(() => {
     if (!ribbonMessage) {
       setVisible(false);
       return;
     }
 
     setVisible(true);
     const timer = window.setTimeout(() => {
       setVisible(false);
     }, 5000);
 
     return () => window.clearTimeout(timer);
   }, [ribbonMessage]); 
   after  header
      {user && (
         <Ribbon
           visible={visible}
           onClose={() => setVisible(false)}
           message={ribbonMessage ?? ribbonError ?? 'No ribbon message available'}
           type={ribbonType ?? 'info'}
         />
       )} 
   */
  return (
   <div className="App">
      <Header />
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
                path="/"
                element={
                  <>
                    <AccountList accounts={accounts} loading={loading} error={error} />
                    <TransferForm accounts={accounts} onTransferComplete={loadAccounts} />
                     <CustomerTransactions accountId={accounts.length > 0 ? accounts[0].id : ''} />
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
