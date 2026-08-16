import api from '@/bootstrap';
import RedVecinoLayout from '@/Layouts/RedVecinoLayout';
import DashboardOverview from '@/Components/Admin/DashboardOverview';
import PropertiesList from '@/Components/Admin/PropertiesList';
import UsersList from '@/Components/Admin/UsersList';
import TicketsList from '@/Components/Admin/TicketsList';
import FinancesLedger from '@/Components/Admin/FinancesLedger';
import FinesList from '@/Components/Admin/FinesList';
import SettingsPanel from '@/Components/Admin/SettingsPanel';
import PersonWizard from '@/Components/Admin/PersonWizard';
import CondoProfilePanel from '@/Components/Admin/CondoProfilePanel';
import EmployeesList from '@/Components/Admin/EmployeesList';
import AmenitiesBookingPanel from '@/Components/Admin/AmenitiesBookingPanel';
import PackageDelivery from '@/Components/Colaborador/PackageDelivery';
import MeetingsMinutes from '@/Components/Comite/MeetingsMinutes';

export default function AdminDashboard({
    user, condosList, adminCondoId, setAdminCondoId, adminActiveTab, setAdminActiveTab, allCondominiums,
    isMobileSidebarOpen, setIsMobileSidebarOpen, adminSettingsForm, toggleTheme, darkMode,
    adminFilteredProperties, adminFilteredUsers, adminFilteredTickets, adminFilteredPayments,
    adminFilteredFines, setTicketStatusFilter, setTicketPriorityFilter, editingTicket, setEditingTicket,
    showAddPropForm, setShowAddPropForm, editingProp, setEditingProp, newPropForm, setNewPropForm,
    propertiesList, setPropertiesList, userSubTab, setUserSubTab, showAddUserForm, setShowAddUserForm,
    editingUser, setEditingUser, newUserForm, setNewUserForm, usersList, setUsersList,
    filteredUsersForSubtab, showPersonWizard, setShowPersonWizard,
    paymentsTabMode, setPaymentsTabMode, paymentsList, setPaymentsList,
    showAddPaymentForm, setShowAddPaymentForm, newPaymentForm, setNewPaymentForm,
    editingPayment, setEditingPayment, financeSummary, financialCatalog,
    selectedIncomeCategory, setSelectedIncomeCategory, selectedExpenseCategory, setSelectedExpenseCategory,
    ledgerSubTab, setLedgerSubTab, filteredIncomes, incomesList, filteredExpenses, expensesList,
    showAddIncomeForm, setShowAddIncomeForm, showAddExpenseForm, setShowAddExpenseForm,
    newIncomeForm, setNewIncomeForm, newExpenseForm, setNewExpenseForm,
    editingIncome, setEditingIncome, editingExpense, setEditingExpense,
    loadingFinances, handleSaveIncome, handleDeleteIncome, handleSaveExpense, handleDeleteExpense,
    showAddFineForm, setShowAddFineForm, editingFine, setEditingFine, newFineForm, setNewFineForm,
    finesList, setFinesList, ticketsList, setTicketsList, adminFilteredTickets: aft,
    settingsSuccess, setSettingsSuccess, exportingLogs, setExportingLogs, setTerminalLogs,
    ticketStatusFilter, ticketPriorityFilter, adminFilteredUsers: afu
}) {
    return (
        <RedVecinoLayout
            user={user}
            role="admin"
            activeTab={adminActiveTab}
            setActiveTab={setAdminActiveTab}
            condosList={condosList}
            adminCondoId={adminCondoId}
            setAdminCondoId={setAdminCondoId}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
        >
            {adminActiveTab === 'dashboard' && (
                <DashboardOverview
                    condosList={condosList}
                    allCondominiums={allCondominiums}
                    adminCondoId={adminCondoId}
                    setAdminCondoId={setAdminCondoId}
                    adminFilteredProperties={adminFilteredProperties}
                    adminFilteredUsers={adminFilteredUsers}
                    adminFilteredTickets={adminFilteredTickets}
                    adminFilteredPayments={adminFilteredPayments}
                    adminFilteredFines={adminFilteredFines}
                    setAdminActiveTab={setAdminActiveTab}
                    setTicketStatusFilter={setTicketStatusFilter}
                    setTicketPriorityFilter={setTicketPriorityFilter}
                    setEditingTicket={setEditingTicket}
                    incomesList={incomesList}
                />
            )}
            {adminActiveTab === 'properties' && (
                <PropertiesList
                    showAddPropForm={showAddPropForm}
                    setShowAddPropForm={setShowAddPropForm}
                    editingProp={editingProp}
                    setEditingProp={setEditingProp}
                    newPropForm={newPropForm}
                    setNewPropForm={setNewPropForm}
                    propertiesList={propertiesList}
                    setPropertiesList={setPropertiesList}
                    adminFilteredProperties={adminFilteredProperties}
                    adminCondoId={adminCondoId}
                    condosList={condosList}
                    allCondominiums={allCondominiums}
                />
            )}
            {adminActiveTab === 'users' && (
                <>
                    <UsersList
                        userSubTab={userSubTab}
                        setUserSubTab={setUserSubTab}
                        showAddUserForm={showAddUserForm}
                        setShowAddUserForm={setShowAddUserForm}
                        editingUser={editingUser}
                        setEditingUser={setEditingUser}
                        newUserForm={newUserForm}
                        setNewUserForm={setNewUserForm}
                        usersList={usersList}
                        setUsersList={setUsersList}
                        adminFilteredUsers={adminFilteredUsers}
                        filteredUsersForSubtab={filteredUsersForSubtab}
                        adminCondoId={adminCondoId}
                        onOpenWizard={() => setShowPersonWizard(true)}
                    />
                    <PersonWizard
                        isOpen={showPersonWizard}
                        onClose={() => setShowPersonWizard(false)}
                        onSave={async (personData) => {
                            const payload = {
                                ...personData,
                                condominium_id: adminCondoId,
                                roles: personData.roles && personData.roles.length > 0
                                    ? personData.roles.map(r => r === 'comite' ? 'comité' : r === 'admin' ? 'admin' : r === 'colaborador' ? 'colaborador' : r === 'proveedor' ? 'proveedor' : 'resident')
                                    : ['resident'],
                            };
                            // Map torre/unidad to property_id if possible
                            if (personData.asociada && personData.torre && personData.unidad && propertiesList.length > 0) {
                                const prop = propertiesList.find(p =>
                                    p.block === personData.torre && p.number === personData.unidad
                                );
                                if (prop) payload.property_id = prop.id;
                            }
                            try {
                                const res = await api.post('/api/person-wizard', payload);
                                const created = res.data.user;
                                setUsersList(prev => [...prev, created]);
                            } catch (err) {
                                console.error('Error creando persona:', err.response?.data || err.message);
                            }
                            setShowPersonWizard(false);
                        }}
                        condosList={condosList}
                        propertiesList={propertiesList}
                        adminCondoId={adminCondoId}
                    />
                </>
            )}
            {adminActiveTab === 'tickets' && (
                <TicketsList
                    ticketStatusFilter={ticketStatusFilter}
                    setTicketStatusFilter={setTicketStatusFilter}
                    ticketPriorityFilter={ticketPriorityFilter}
                    setTicketPriorityFilter={setTicketPriorityFilter}
                    editingTicket={editingTicket}
                    setEditingTicket={setEditingTicket}
                    ticketsList={ticketsList}
                    setTicketsList={setTicketsList}
                    adminFilteredTickets={adminFilteredTickets}
                    adminFilteredUsers={adminFilteredUsers}
                />
            )}
            {adminActiveTab === 'payments' && (
                <FinancesLedger
                    adminCondoId={adminCondoId}
                    adminFilteredProperties={adminFilteredProperties}
                    adminFilteredUsers={adminFilteredUsers}
                    adminFilteredPayments={adminFilteredPayments}
                    paymentsTabMode={paymentsTabMode}
                    setPaymentsTabMode={setPaymentsTabMode}
                    paymentsList={paymentsList}
                    setPaymentsList={setPaymentsList}
                    showAddPaymentForm={showAddPaymentForm}
                    setShowAddPaymentForm={setShowAddPaymentForm}
                    newPaymentForm={newPaymentForm}
                    setNewPaymentForm={setNewPaymentForm}
                    editingPayment={editingPayment}
                    setEditingPayment={setEditingPayment}
                    financeSummary={financeSummary}
                    financialCatalog={financialCatalog}
                    selectedIncomeCategory={selectedIncomeCategory}
                    setSelectedIncomeCategory={setSelectedIncomeCategory}
                    selectedExpenseCategory={selectedExpenseCategory}
                    setSelectedExpenseCategory={setSelectedExpenseCategory}
                    ledgerSubTab={ledgerSubTab}
                    setLedgerSubTab={setLedgerSubTab}
                    filteredIncomes={filteredIncomes}
                    incomesList={incomesList}
                    filteredExpenses={filteredExpenses}
                    expensesList={expensesList}
                    showAddIncomeForm={showAddIncomeForm}
                    setShowAddIncomeForm={setShowAddIncomeForm}
                    showAddExpenseForm={showAddExpenseForm}
                    setShowAddExpenseForm={setShowAddExpenseForm}
                    newIncomeForm={newIncomeForm}
                    setNewIncomeForm={setNewIncomeForm}
                    newExpenseForm={newExpenseForm}
                    setNewExpenseForm={setNewExpenseForm}
                    editingIncome={editingIncome}
                    setEditingIncome={setEditingIncome}
                    editingExpense={editingExpense}
                    setEditingExpense={setEditingExpense}
                    loadingFinances={loadingFinances}
                    handleSaveIncome={handleSaveIncome}
                    handleDeleteIncome={handleDeleteIncome}
                    handleSaveExpense={handleSaveExpense}
                    handleDeleteExpense={handleDeleteExpense}
                    usersList={usersList}
                    allCondominiums={allCondominiums}
                    finesList={finesList}
                    ticketsList={ticketsList}
                    readOnly={false}
                />
            )}
            {adminActiveTab === 'fines' && (
                <FinesList
                    showAddFineForm={showAddFineForm}
                    setShowAddFineForm={setShowAddFineForm}
                    editingFine={editingFine}
                    setEditingFine={setEditingFine}
                    newFineForm={newFineForm}
                    setNewFineForm={setNewFineForm}
                    finesList={finesList}
                    setFinesList={setFinesList}
                    adminFilteredFines={adminFilteredFines}
                    adminFilteredProperties={adminFilteredProperties}
                    adminCondoId={adminCondoId}
                />
            )}
            {adminActiveTab === 'employees' && (
                <EmployeesList adminCondoId={adminCondoId} />
            )}
            {adminActiveTab === 'amenities' && (
                <AmenitiesBookingPanel adminCondoId={adminCondoId} />
            )}
            {adminActiveTab === 'packages' && (
                <PackageDelivery packages={[]} adminCondoId={adminCondoId} />
            )}
            {adminActiveTab === 'actas' && (
                <MeetingsMinutes adminCondoId={adminCondoId} />
            )}
            {adminActiveTab === 'condo_profile' && (
                <CondoProfilePanel
                    adminCondoId={adminCondoId}
                    condosList={condosList}
                    allCondominiums={allCondominiums}
                />
            )}
            {adminActiveTab === 'settings' && (
                <SettingsPanel
                    adminSettingsForm={adminSettingsForm}
                    setAdminSettingsForm={setAdminSettingsForm}
                    settingsSuccess={settingsSuccess}
                    setSettingsSuccess={setSettingsSuccess}
                    exportingLogs={exportingLogs}
                    setExportingLogs={setExportingLogs}
                    setTerminalLogs={setTerminalLogs}
                    usersList={usersList}
                    propertiesList={propertiesList}
                    paymentsList={paymentsList}
                />
            )}
        </RedVecinoLayout>
    );
}
