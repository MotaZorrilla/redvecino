import MiVecinoLayout from '@/Layouts/MiVecinoLayout';
import CommonExpensesQR from '@/Components/Propietario/CommonExpensesQR';
import FinancialReports from '@/Components/Propietario/FinancialReports';
import BookingManager from '@/Components/Propietario/BookingManager';
import PropertyOwnership from '@/Components/Propietario/PropertyOwnership';

export default function PropietarioDashboard({
    user, propietarioActiveTab, setPropietarioActiveTab, isMobileSidebarOpen, setIsMobileSidebarOpen,
    toggleTheme, darkMode, residentExpenses, setResidentExpenses,
    paymentHistory, setPaymentHistory, showPaymentModal, setShowPaymentModal,
    paymentReceiptName, setPaymentReceiptName, isProcessingPayment, setIsProcessingPayment,
    paymentCompletedSuccess, setPaymentCompletedSuccess, executeQrPayment,
    simulatedMoroso, setSimulatedMoroso, setShowMorosidadModal, amenities, setAmenities,
    myReservations, setMyReservations, bookingAmenity, setBookingAmenity,
    bookingDate, setBookingDate, bookingSlot, setBookingSlot, submitBooking,
    propertiesList
}) {
    return (
        <MiVecinoLayout
            user={user}
            mobileTab={propietarioActiveTab}
            setMobileTab={setPropietarioActiveTab}
            simulatedMoroso={simulatedMoroso}
            setSimulatedMoroso={setSimulatedMoroso}
            setShowMorosidadModal={setShowMorosidadModal}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
        >
            {propietarioActiveTab === 'home' && (
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
            {propietarioActiveTab === 'reports' && (
                <FinancialReports user={user} />
            )}
            {propietarioActiveTab === 'booking' && (
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
            {propietarioActiveTab === 'units' && (
                <PropertyOwnership user={user} propertiesList={propertiesList} />
            )}
        </MiVecinoLayout>
    );
}
