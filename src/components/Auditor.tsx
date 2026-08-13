import React, { useEffect, useState } from 'react';
import '../styles/Auditor.css';
import { AuditorData } from '../api/types';
import { formatCurrency } from '../utils/format';
import { getAuditTransactions } from '../api/client';

type AuditorFormProps = {
    auditorData: AuditorData[];
    loading: boolean;
    error: string | null;
};

export default function Auditor({ auditorData: _auditorData, loading: _parentLoading, error: _parentError }: AuditorFormProps): JSX.Element {

    const [auditData, setauditData] = useState<AuditorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAuditData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getAuditTransactions();
                setauditData(data);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        loadAuditData();
    }, []);

    //todo: fetch from getCustomerTransactions of react component and display in table format with all the fields of AuditorData


    if (loading) {
        return <p className="status-message">Loading audits...</p>;
    }

    if (error) {
        return <p className="status-message error">Error: {error}</p>;
    }

    return (
        <section className="auditor account-list">
            <h1>Auditor:</h1>
            <h2>Total Accounts: <b>{auditData.length}</b></h2>
            <h2>Total Balance: <b style={{ color: 'green' }}>{formatCurrency(auditData.reduce((sum, data) => sum + data.amount, 0))}</b></h2>
            <table>
                <thead>
                    <tr>
                        <th>Transaction Id</th>
                        <th>Account Holder Name</th>
                        <th>Account Number</th>
                        <th>Transaction Type</th>
                        <th>Amount</th>
                        <th>Transaction Status</th>
                        <th>Transaction Date</th>
                        <th>description</th>
                    </tr>
                </thead>
                <tbody>
                    {auditData.map((data) => (
                        <tr key={data.transactionId}>
                            <td>{'Txn-ID' + data.transactionId}</td>
                            <td>{data.customerName}</td>
                            <td>{data.accountNumber}</td>
                            <td style={{ color: data.transactionType === 'DEPOSIT' ? 'green' : 'red', fontWeight: 'bold' }}>{data.transactionType}</td>
                            <td>{formatCurrency(data.amount)}</td>
                            <td style={{ color: data.transactionStatus === 'COMPLETE' ? 'green' : 'red', fontWeight: 'bold' }}>{data.transactionStatus}</td>
                            <td>{data.transactionDate}</td>
                            <td>{'Amount - ' + formatCurrency(data.amount) + ' ' + data.transactionType + ' from ' + data.accountNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}