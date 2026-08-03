import RedVecinoLayout from '@/Layouts/RedVecinoLayout';
import AttendanceControl from '@/Components/Colaborador/AttendanceControl';
import PackageDelivery from '@/Components/Colaborador/PackageDelivery';
import VisitorAccess from '@/Components/Colaborador/VisitorAccess';
import ShiftLogs from '@/Components/Colaborador/ShiftLogs';
import ContractViewer from '@/Components/Colaborador/ContractViewer';
import ShoppingList from '@/Components/Colaborador/ShoppingList';
import AssignedTickets from '@/Components/Colaborador/AssignedTickets';

export default function ColaboradorDashboard({
    user, condosList, adminCondoId, setAdminCondoId, colaboradorActiveTab, setColaboradorActiveTab,
    isMobileSidebarOpen, setIsMobileSidebarOpen, toggleTheme, darkMode,
    ocrScanning, setOcrScanning, packages, setPackages, setTerminalLogs,
    ticketsList, setTicketsList
}) {
    return (
        <RedVecinoLayout
            user={user}
            role="colaborador"
            activeTab={colaboradorActiveTab}
            setActiveTab={setColaboradorActiveTab}
            condosList={condosList}
            adminCondoId={adminCondoId}
            setAdminCondoId={setAdminCondoId}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
        >
            {colaboradorActiveTab === 'attendance' && (
                <AttendanceControl user={user} adminCondoId={adminCondoId} />
            )}
            {colaboradorActiveTab === 'packages' && (
                <PackageDelivery
                    ocrScanning={ocrScanning}
                    setOcrScanning={setOcrScanning}
                    packages={packages}
                    setPackages={setPackages}
                    setTerminalLogs={setTerminalLogs}
                />
            )}
            {colaboradorActiveTab === 'visitors' && (
                <VisitorAccess adminCondoId={adminCondoId} />
            )}
            {colaboradorActiveTab === 'shifts' && (
                <ShiftLogs adminCondoId={adminCondoId} />
            )}
            {colaboradorActiveTab === 'contracts' && (
                <ContractViewer user={user} />
            )}
            {colaboradorActiveTab === 'shopping' && (
                <ShoppingList adminCondoId={adminCondoId} />
            )}
            {colaboradorActiveTab === 'tickets' && (
                <AssignedTickets
                    user={user}
                    ticketsList={ticketsList}
                    setTicketsList={setTicketsList}
                />
            )}
        </RedVecinoLayout>
    );
}
