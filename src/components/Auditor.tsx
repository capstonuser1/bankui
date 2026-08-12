import React from 'react';
import '../styles/Auditor.css';
import { Account } from '../api/types';
import { formatCurrency } from '../utils/format';

type TransferFormProps = {
    accounts: Account[];
    onTransferComplete: () => void;
    loading: boolean;
    error: string | null;
};

export default function Auditor({ accounts, onTransferComplete, loading, error }: TransferFormProps): JSX.Element {
    if (loading) {
        return <p className="status-message">Loading accounts...</p>;
    }

    if (error) {
        return <p className="status-message error">Error: {error}</p>;
    }

    return (
        <section className="account-list">
            <h1>Auditor:</h1>
            <h2>Total Accounts: <b>{accounts.length}</b></h2>
            <h2>Total Balance: <b style={{ color: 'green' }}>{formatCurrency(accounts.reduce((sum, account) => sum + account.balance, 0))}</b></h2>
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