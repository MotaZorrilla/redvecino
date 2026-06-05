import ComiteLayout from '@/Layouts/ComiteLayout';
import DashboardOverview from '@/Components/Admin/DashboardOverview';
import FinancialAudit from '@/Components/Comite/FinancialAudit';
import ChatAuditLogs from '@/Components/Comite/ChatAuditLogs';
import MeetingsMinutes from '@/Components/Comite/MeetingsMinutes';

export default function ComiteDashboard({
    user, condosList, adminCondoId, setAdminCondoId, comiteActiveTab, setComiteActiveTab,
    isMobileSidebarOpen, setIsMobileSidebarOpen, toggleTheme, darkMode,
    adminFilteredProperties, adminFilteredUsers, adminFilteredTickets, adminFilteredPayments,
    adminFilteredFines, setTicketStatusFilter, setTicketPriorityFilter, setEditingTicket,
    paymentsTabMode, setPaymentsTabMode, paymentsList, setPaymentsList,
    showAddPaymentForm, setShowAddPaymentForm, newPaymentForm, setNewPaymentForm,
    editingPayment, setEditingPayment, financeSummary, financialCatalog,
    selectedIncomeCategory, setSelectedIncomeCategory, selectedExpenseCategory, setSelectedExpenseCategory,
    ledgerSubTab, setLedgerSubTab, filteredIncomes, incomesList, filteredExpenses, expensesList,
    showAddIncomeForm, setShowAddIncomeForm, showAddExpenseForm, setShowAddExpenseForm,
    newIncomeForm, setNewIncomeForm, newExpenseForm, setNewExpenseForm,
    editingIncome, setEditingIncome, editingExpense, setEditingExpense,
    loadingFinances, handleSaveIncome, handleDeleteIncome, handleSaveExpense, handleDeleteExpense,
    usersList, selectedAuditChat, setSelectedAuditChat, auditedMessagesState, setAuditedMessagesState,
    chatAuditReply, setChatAuditReply
}) {
    return (
        <ComiteLayout
            condosList={condosList}
            adminCondoId={adminCondoId}
            setAdminCondoId={setAdminCondoId}
            comiteActiveTab={comiteActiveTab}
            setComiteActiveTab={setComiteActiveTab}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            user={user}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
        >
            {comiteActiveTab === 'dashboard' && (
                <DashboardOverview
                    condosList={condosList}
                    adminCondoId={adminCondoId}
                    adminFilteredProperties={adminFilteredProperties}
                    adminFilteredUsers={adminFilteredUsers}
                    adminFilteredTickets={adminFilteredTickets}
                    adminFilteredPayments={adminFilteredPayments}
                    adminFilteredFines={adminFilteredFines}
                    setAdminActiveTab={setComiteActiveTab}
                    setTicketStatusFilter={setTicketStatusFilter}
                    setTicketPriorityFilter={setTicketPriorityFilter}
                    setEditingTicket={setEditingTicket}
                />
            )}
            {comiteActiveTab === 'finances' && (
                <FinancialAudit
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
                />
            )}
            {comiteActiveTab === 'chats' && (
                <ChatAuditLogs
                    selectedAuditChat={selectedAuditChat}
                    setSelectedAuditChat={setSelectedAuditChat}
                    auditedMessagesState={auditedMessagesState}
                    setAuditedMessagesState={setAuditedMessagesState}
                    chatAuditReply={chatAuditReply}
                    setChatAuditReply={setChatAuditReply}
                />
            )}
            {comiteActiveTab === 'actas' && (
                <MeetingsMinutes adminCondoId={adminCondoId} />
            )}
        </ComiteLayout>
    );
}
