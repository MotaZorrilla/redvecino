import FinancesLedger from '@/Components/Admin/FinancesLedger';

export default function FinancialAudit(props) {
    return <FinancesLedger {...props} readOnly={true} />;
}
