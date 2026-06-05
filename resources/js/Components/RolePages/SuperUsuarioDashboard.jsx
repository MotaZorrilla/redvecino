import SuperUsuarioLayout from '@/Layouts/SuperUsuarioLayout';

export default function SuperUsuarioDashboard({ user, toggleTheme, darkMode, usersList, setUsersList, condosList, setCondosList }) {
    return (
        <SuperUsuarioLayout
            user={user}
            toggleTheme={toggleTheme}
            darkMode={darkMode}
            usersList={usersList}
            setUsersList={setUsersList}
            condosList={condosList}
            setCondosList={setCondosList}
        />
    );
}
