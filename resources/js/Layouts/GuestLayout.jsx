import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function GuestLayout({ children }) {
    // Symmetrical boot sequence: sync theme from dashboard localStorage for seamless experience
    useEffect(() => {
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300 relative overflow-hidden">
            {/* Elegant glassmorphic background decoration meshes */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Standard Breeze Layout wrapper, upgraded to a high-end card */}
            <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-3xl shadow-xl shadow-slate-100/50 dark:shadow-none z-10 flex flex-col gap-6">
                
                {/* Centralized Brand Logo */}
                <div className="flex justify-center text-center">
                    <Link href="/" className="group transition-transform duration-300 hover:scale-105">
                        <ApplicationLogo size="large" showSubtext={true} />
                    </Link>
                </div>

                {/* Form area */}
                <div className="text-slate-700 dark:text-slate-350">
                    {children}
                </div>
            </div>
        </div>
    );
}
