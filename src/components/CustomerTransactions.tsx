import { useEffect, useState } from 'react';
import { getCustomerTransactions } from '../api/client';
import type { TransactionList } from '../api/types';
import { formatCurrency } from '../utils/format';
import '../styles/CustomerTransactions.css';

export function CustomerTransactions({ accountId }: { accountId: string }) {
    const [transactions, setTransactions] = useState<TransactionList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getCustomerTransactions(accountId);
                setTransactions(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (accountId) {
            loadTransactions();
        }
    }, [accountId]);

    if (loading) return <p className="status-message">Loading transactions...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="account-list transactions">
            <h2> <u>Recent Transactions for the Account: {accountId || 'Unknown'}</u></h2>
            {transactions.length === 0 ? (
                <p>No transactions found</p>
            ) : (
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Account Id</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.transactionId}>
                                    <td>{tx.transactionId}</td>
                                    <td>{tx.accountId}</td>
                                    <td>{tx.type}</td>
                                    <td>{formatCurrency(tx.amount)}</td>
                                    <td>
                                        <span className={`status status--${(tx.status || '').toLowerCase()}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td>{tx.date}</td>
                                    <td>{tx.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
