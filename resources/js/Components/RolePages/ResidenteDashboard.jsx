import ResidentLayout from '@/Layouts/ResidentLayout';
import ResidentOverview from '@/Components/Residente/ResidentOverview';
import AnnouncementsList from '@/Components/Residente/AnnouncementsList';
import BookingManager from '@/Components/Propietario/BookingManager';
import CommonExpensesQR from '@/Components/Propietario/CommonExpensesQR';
import TicketsReport from '@/Components/Residente/TicketsReport';
import CommunityChat from '@/Components/Residente/CommunityChat';

export default function ResidenteDashboard({
    user, isDesktop, forceMobileView, setForceMobileView, mobileTab, setMobileTab,
    simulatedMoroso, setSimulatedMoroso, setShowMorosidadModal, residentCondo, toggleTheme, darkMode,
    residentExpenses, setResidentExpenses, paymentHistory, setPaymentHistory,
    showPaymentModal, setShowPaymentModal, paymentReceiptName, setPaymentReceiptName,
    isProcessingPayment, setIsProcessingPayment, paymentCompletedSuccess, setPaymentCompletedSuccess,
    executeQrPayment, reportedTickets, setReportedTickets, myReservations, setMyReservations,
    amenities, setAmenities, bookingAmenity, setBookingAmenity, bookingDate, setBookingDate,
    bookingSlot, setBookingSlot, submitBooking,
    newTicketTitle, setNewTicketTitle, newTicketDesc, setNewTicketDesc,
    newTicketCat, setNewTicketCat, newTicketPri, setNewTicketPri, submitTicket,
    chatMessages, setChatMessages, chatInput, setChatInput, isTyping, setIsTyping, sendChatMessage
}) {
    return (
        <ResidentLayout
            user={user}
            isDesktop={isDesktop}
            forceMobileView={forceMobileView}
            setForceMobileView={setForceMobileView}
            mobileTab={mobileTab}
            setMobileTab={setMobileTab}
            simulatedMoroso={simulatedMoroso}
            setSimulatedMoroso={setSimulatedMoroso}
            setShowMorosidadModal={setShowMorosidadModal}
            residentCondo={residentCondo}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
        >
            {mobileTab === 'home' && (
                <ResidentOverview
                    user={user}
                    simulatedMoroso={simulatedMoroso}
                    residentExpenses={residentExpenses}
                    setMobileTab={setMobileTab}
                    setShowMorosidadModal={setShowMorosidadModal}
                    reportedTickets={reportedTickets}
                    myReservations={myReservations}
                />
            )}
            {mobileTab === 'comunicados' && (
                <AnnouncementsList />
            )}
            {mobileTab === 'reservas' && (
                <BookingManager
                    user={user}
                    simulatedMoroso={simulatedMoroso}
                    setShowMorosidadModal={setShowMorosidadModal}
                    amenities={amenities}
                    setAmenities={setAmenities}
                    myReservations={myReservations}
                    setMyReservations={setMyReservations}
                    bookingAmenity={bookingAmenity}
                    setBookingAmenity={setBookingAmenity}
                    bookingDate={bookingDate}
                    setBookingDate={setBookingDate}
                    bookingSlot={bookingSlot}
                    setBookingSlot={setBookingSlot}
                    submitBooking={submitBooking}
                />
            )}
            {mobileTab === 'pagos' && (
                <CommonExpensesQR
                    user={user}
                    residentExpenses={residentExpenses}
                    setResidentExpenses={setResidentExpenses}
                    paymentHistory={paymentHistory}
                    setPaymentHistory={setPaymentHistory}
                    showPaymentModal={showPaymentModal}
                    setShowPaymentModal={setShowPaymentModal}
                    paymentReceiptName={paymentReceiptName}
                    setPaymentReceiptName={setPaymentReceiptName}
                    isProcessingPayment={isProcessingPayment}
                    setIsProcessingPayment={setIsProcessingPayment}
                    paymentCompletedSuccess={paymentCompletedSuccess}
                    setPaymentCompletedSuccess={setPaymentCompletedSuccess}
                    executeQrPayment={executeQrPayment}
                />
            )}
            {mobileTab === 'incidencias' && (
                <TicketsReport
                    newTicketTitle={newTicketTitle}
                    setNewTicketTitle={setNewTicketTitle}
                    newTicketDesc={newTicketDesc}
                    setNewTicketDesc={setNewTicketDesc}
                    newTicketCat={newTicketCat}
                    setNewTicketCat={setNewTicketCat}
                    newTicketPri={newTicketPri}
                    setNewTicketPri={setNewTicketPri}
                    reportedTickets={reportedTickets}
                    setReportedTickets={setReportedTickets}
                    submitTicket={submitTicket}
                />
            )}
            {mobileTab === 'comunidad' && (
                <CommunityChat
                    chatMessages={chatMessages}
                    setChatMessages={setChatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    isTyping={isTyping}
                    setIsTyping={setIsTyping}
                    sendChatMessage={sendChatMessage}
                />
            )}
            {mobileTab === 'documentos' && (
                <div className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm animate-scale-up text-xs border-gray-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block border-b pb-2 dark:border-slate-800">Biblioteca Completa de Documentos</span>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { title: 'Reglamento de Copropiedad Oficial', type: 'PDF', size: '2.4 MB', date: '01/01/2026' },
                            { title: 'Minuta Asamblea Extraordinaria - Mayo', type: 'PDF', size: '820 KB', date: '12/05/2026' },
                            { title: 'Balance Consolidado Gastos Comunes Q1', type: 'XLSX', size: '1.2 MB', date: '10/04/2026' }
                        ].map((doc, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#72B043]/30 transition-all text-left">
                                <div>
                                    <p className="font-black text-slate-800 dark:text-white text-xs">{doc.title}</p>
                                    <span className="text-[9px] text-slate-400 block mt-0.5">{doc.type} &bull; {doc.size} &bull; Subido el {doc.date}</span>
                                </div>
                                <button type="button" onClick={() => alert(`Descargando ${doc.title}...`)} className="px-4 py-2 bg-[#72B043]/10 hover:bg-[#72B043]/20 text-[#72B043] font-bold rounded-xl transition-all">
                                    Descargar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ResidentLayout>
    );
}
