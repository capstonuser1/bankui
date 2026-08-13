import { useEffect, useState } from 'react';
import { getCustomerTransactions } from '../api/client';
import type { TransactionList } from '../api/types';
import { formatCurrency } from '../utils/format';
import '../styles/CustomerTransactions.css';

export function CustomerTransactions({
    accountId,
    visible = false,
}: {
    accountId: string;
    visible?: boolean;
}) {
    const [transactions, setTransactions] = useState<TransactionList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // window.alert('CustomerTransactions component mounted. Account ID: ' + accountId + ', Visible: ' + visible);
        if (!visible || !accountId) return;
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
    }, [accountId, visible]);

    if (!visible) return null;
    if (loading) return <p className="status-message">Loading transactions...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="account-list transactions">
            {transactions.length === 0 ? (
                <p>No transactions found</p>
            ) : (
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Account Number</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.accountNumber}>
                                    <td>{tx.transactionId}</td>
                                    <td>{tx.accountNumber}</td>
                                    <td>{tx.transactionType}</td>
                                    <td>{formatCurrency(tx.amount)}</td>
                                    <td>{tx.status}</td>
                                    <td>{tx.date}</td>
                                    <td>{tx.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
