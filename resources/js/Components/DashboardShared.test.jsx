import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { 
    Badge, 
    StatusBadge, 
    StatCard, 
    StatRow, 
    SimpleTable 
} from './DashboardShared';

// Mock de @inertiajs/react para evitar problemas con Link
vi.mock('@inertiajs/react', () => ({
    Link: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>,
    usePage: () => ({
        props: {}
    })
}));

afterEach(() => {
    document.body.innerHTML = '';
});

describe('Badge', () => {
    it('renders with default variant styling', () => {
        render(<Badge>Prueba Default</Badge>);
        const element = screen.getByText('Prueba Default');
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('bg-gray-100');
    });

    it('renders with correct variant classes', () => {
        const { rerender } = render(<Badge variant="success">Éxito</Badge>);
        expect(screen.getByText('Éxito')).toHaveClass('bg-brand-green/10');

        rerender(<Badge variant="danger">Error</Badge>);
        expect(screen.getByText('Error')).toHaveClass('bg-brand-error/10');

        rerender(<Badge variant="warning">Alerta</Badge>);
        expect(screen.getByText('Alerta')).toHaveClass('bg-brand-orange/10');

        rerender(<Badge variant="info">Info</Badge>);
        expect(screen.getByText('Info')).toHaveClass('bg-brand-info/10');

        rerender(<Badge variant="purple">Púrpura</Badge>);
        expect(screen.getByText('Púrpura')).toHaveClass('bg-brand-purple/10');
    });

    it('falls back to default classes if variant is invalid', () => {
        render(<Badge variant="invalid-variant">Prueba</Badge>);
        expect(screen.getByText('Prueba')).toHaveClass('bg-gray-100');
    });
});

describe('StatusBadge', () => {
    it('translates status type correctly', () => {
        const { rerender } = render(<StatusBadge type="ticket" status="open" />);
        expect(screen.getByText('Abierto')).toHaveClass('bg-brand-info/10');

        rerender(<StatusBadge type="ticket" status="resolved" />);
        expect(screen.getByText('Resuelto')).toHaveClass('bg-brand-green/10');

        rerender(<StatusBadge type="payment" status="pending" />);
        expect(screen.getByText('Pendiente')).toHaveClass('bg-brand-orange/10');

        rerender(<StatusBadge type="priority" status="urgent" />);
        expect(screen.getByText('Urgente')).toHaveClass('bg-brand-error/10');
    });

    it('falls back to default if type or status is unknown', () => {
        render(<StatusBadge type="unknown-type" status="desconocido" />);
        const badge = screen.getByText('desconocido');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-gray-100');
    });
});

describe('StatCard', () => {
    it('renders title, value and description correctly', () => {
        render(
            <StatCard 
                title="Usuarios Activos" 
                value="1,234" 
                description="Incremento del 12%" 
                icon={<span>📊</span>}
            />
        );

        expect(screen.getByText('Usuarios Activos')).toBeInTheDocument();
        expect(screen.getByText('1,234')).toBeInTheDocument();
        expect(screen.getByText('Incremento del 12%')).toBeInTheDocument();
        expect(screen.getByText('📊')).toBeInTheDocument();
    });

    it('applies correct background color styling classes based on color prop', () => {
        const { rerender } = render(<StatCard title="Card" value="0" color="emerald" />);
        expect(screen.getByText('0').closest('.relative').querySelector('.rounded-xl')).toHaveClass('bg-brand-green/10');

        rerender(<StatCard title="Card" value="0" color="rose" />);
        expect(screen.getByText('0').closest('.relative').querySelector('.rounded-xl')).toHaveClass('bg-brand-error/10');
    });

    it('triggers onClick and has pointer cursor when onClick is provided', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<StatCard title="Card" value="0" onClick={onClick} />);
        
        const card = screen.getByText('Card').closest('.relative');
        expect(card).toHaveClass('cursor-pointer');
        
        await user.click(card);
        expect(onClick).toHaveBeenCalled();
    });

    it('does not have cursor-pointer class when onClick is not provided', () => {
        render(<StatCard title="Card" value="0" />);
        const card = screen.getByText('Card').closest('.relative');
        expect(card).not.toHaveClass('cursor-pointer');
    });
});

describe('StatRow', () => {
    it('renders label and value with icon', () => {
        render(<StatRow label="Fecha límite" value="2026-12-31" icon={<span>📅</span>} />);
        expect(screen.getByText('Fecha límite')).toBeInTheDocument();
        expect(screen.getByText('2026-12-31')).toBeInTheDocument();
        expect(screen.getByText('📅')).toBeInTheDocument();
    });
});

describe('SimpleTable', () => {
    const headers = ['Nombre', 'Rol', 'Estado'];
    const rows = [
        { cells: ['Juan', 'Admin', 'Activo'] },
        { cells: ['María', 'Residente', 'Inactivo'] }
    ];

    it('renders headers and cell contents correctly', () => {
        render(<SimpleTable headers={headers} rows={rows} />);

        headers.forEach(h => {
            expect(screen.getByRole('columnheader', { name: h })).toBeInTheDocument();
        });

        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('María')).toBeInTheDocument();
        expect(screen.getByText('Inactivo')).toBeInTheDocument();
    });

    it('renders emptyMessage when rows are empty or undefined', () => {
        const { rerender } = render(<SimpleTable headers={headers} rows={[]} emptyMessage="No hay usuarios registrados" />);
        expect(screen.getByText('No hay usuarios registrados')).toBeInTheDocument();

        rerender(<SimpleTable headers={headers} rows={undefined} emptyMessage="No hay registros" />);
        expect(screen.getByText('No hay registros')).toBeInTheDocument();
    });
});
