import RedVecinoLayout from '@/Layouts/RedVecinoLayout';
import DevOpsTelemetry from '@/Components/Ti/DevOpsTelemetry';
import SpatiePermissionMatrix from '@/Components/Ti/SpatiePermissionMatrix';
import SpatieImpersonator from '@/Components/Ti/SpatieImpersonator';
import GlobalUsersTable from '@/Components/Ti/GlobalUsersTable';
import CondosManagement from '@/Components/Ti/CondosManagement';
import SandboxInspeccion from '@/Components/Ti/SandboxInspeccion';

export default function TiDashboard({
    user, tiActiveTab, setTiActiveTab, isMobileDevOpsSidebarOpen, setIsMobileDevOpsSidebarOpen,
    toggleTheme, darkMode, globalMaintenanceMode, setGlobalMaintenanceMode,
    cpuLoad, ramUsage, latency, terminalLogs, setTerminalLogs,
    selectedImpCondo, setSelectedImpCondo, selectedImpRole, setSelectedImpRole,
    selectedImpUser, setSelectedImpUser, condosList, usersList, getUserCondoId,
    setAdminCondoId, setImpersonatedUser,
    showAddUserForm, setShowAddUserForm, searchUserQuery, setSearchUserQuery,
    roleUserFilter, setRoleUserFilter, editingUser, setEditingUser,
    newUserForm, setNewUserForm, setUsersList,
    showAddCondoForm, setShowAddCondoForm, editingCondo, setEditingCondo,
    newCondoForm, setNewCondoForm, setCondosList, adminCondoId,
    sandboxCondoId, setSandboxCondoId, sandboxModule, setSandboxModule,
    propertiesList, ticketsList, stats, paymentsList,
    auditedMessagesState, packages
}) {
    return (
        <RedVecinoLayout
            user={user}
            role="ti"
            activeTab={tiActiveTab}
            setActiveTab={setTiActiveTab}
            isMobileSidebarOpen={isMobileDevOpsSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileDevOpsSidebarOpen}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
        >
            {tiActiveTab === 'devops' && (
                <DevOpsTelemetry
                    globalMaintenanceMode={globalMaintenanceMode}
                    setGlobalMaintenanceMode={setGlobalMaintenanceMode}
                    cpuLoad={cpuLoad}
                    ramUsage={ramUsage}
                    latency={latency}
                    terminalLogs={terminalLogs}
                    setTerminalLogs={setTerminalLogs}
                />
            )}
            {tiActiveTab === 'matrix' && (
                <SpatiePermissionMatrix setTerminalLogs={setTerminalLogs} />
            )}
            {tiActiveTab === 'impersonation' && (
                <SpatieImpersonator
                    selectedImpCondo={selectedImpCondo}
                    setSelectedImpCondo={setSelectedImpCondo}
                    selectedImpRole={selectedImpRole}
                    setSelectedImpRole={setSelectedImpRole}
                    selectedImpUser={selectedImpUser}
                    setSelectedImpUser={setSelectedImpUser}
                    condosList={condosList}
                    usersList={usersList}
                    getUserCondoId={getUserCondoId}
                    setAdminCondoId={setAdminCondoId}
                    setImpersonatedUser={setImpersonatedUser}
                    setTerminalLogs={setTerminalLogs}
                />
            )}
            {tiActiveTab === 'users' && (
                <GlobalUsersTable
                    showAddUserForm={showAddUserForm}
                    setShowAddUserForm={setShowAddUserForm}
                    searchUserQuery={searchUserQuery}
                    setSearchUserQuery={setSearchUserQuery}
                    roleUserFilter={roleUserFilter}
                    setRoleUserFilter={setRoleUserFilter}
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    newUserForm={newUserForm}
                    setNewUserForm={setNewUserForm}
                    usersList={usersList}
                    setUsersList={setUsersList}
                    setTerminalLogs={setTerminalLogs}
                    setImpersonatedUser={setImpersonatedUser}
                />
            )}
            {tiActiveTab === 'condos' && (
                <CondosManagement
                    showAddCondoForm={showAddCondoForm}
                    setShowAddCondoForm={setShowAddCondoForm}
                    editingCondo={editingCondo}
                    setEditingCondo={setEditingCondo}
                    newCondoForm={newCondoForm}
                    setNewCondoForm={setNewCondoForm}
                    condosList={condosList}
                    setCondosList={setCondosList}
                    setTerminalLogs={setTerminalLogs}
                    adminCondoId={adminCondoId}
                    setAdminCondoId={setAdminCondoId}
                />
            )}
            {tiActiveTab === 'sandbox' && (
                <SandboxInspeccion
                    sandboxCondoId={sandboxCondoId}
                    setSandboxCondoId={setSandboxCondoId}
                    sandboxModule={sandboxModule}
                    setSandboxModule={setSandboxModule}
                    condosList={condosList}
                    propertiesList={propertiesList}
                    setTerminalLogs={setTerminalLogs}
                    usersList={usersList}
                    setImpersonatedUser={setImpersonatedUser}
                    ticketsList={ticketsList}
                    stats={stats}
                    paymentsList={paymentsList}
                    auditedMessagesState={auditedMessagesState}
                    packages={packages}
                />
            )}
        </RedVecinoLayout>
    );
}
