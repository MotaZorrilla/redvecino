/**
 * @file useCondoFinances.js
 * @description Hook de React Query para las finanzas de un condominio.
 * Centraliza la consulta de summary + incomes + expenses (evita el Promise.all
 * inline y los 3 useEffect que poblaban estado en Dashboard.jsx).
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchCondoFinances = async (condominiumId) => {
    const [summaryRes, incomesRes, expensesRes] = await Promise.all([
        axios.get(`/api/condo-finances/summary?condominium_id=${condominiumId}`),
        axios.get(`/api/condo-finances/incomes?condominium_id=${condominiumId}&per_page=500`),
        axios.get(`/api/condo-finances/expenses?condominium_id=${condominiumId}&per_page=500`),
    ]);

    return {
        summary: summaryRes.data,
        incomes: incomesRes.data.data || [],
        expenses: expensesRes.data.data || [],
    };
};

export function useCondoFinances(condominiumId) {
    return useQuery({
        queryKey: ['condo-finances', condominiumId],
        queryFn: () => fetchCondoFinances(condominiumId),
        enabled: !!condominiumId,
    });
}

export default useCondoFinances;
