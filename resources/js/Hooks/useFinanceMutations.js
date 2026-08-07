/**
 * @file useFinanceMutations.js
 * @description Mutaciones React Query para el CRUD de finanzas de condominio.
 * Cada mutación invalida la caché de finanzas al éxito, evitando refetch manual.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useFinanceMutations(condominiumId) {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['condo-finances', condominiumId] });
    };

    const saveIncome = useMutation({
        mutationFn: (payload) =>
            payload?.id
                ? axios.put(`/api/condo-finances/incomes/${payload.id}`, payload)
                : axios.post('/api/condo-finances/incomes', payload),
        onSuccess: invalidate,
    });

    const deleteIncome = useMutation({
        mutationFn: (id) => axios.delete(`/api/condo-finances/incomes/${id}`),
        onSuccess: invalidate,
    });

    const saveExpense = useMutation({
        mutationFn: (payload) =>
            payload?.id
                ? axios.put(`/api/condo-finances/expenses/${payload.id}`, payload)
                : axios.post('/api/condo-finances/expenses', payload),
        onSuccess: invalidate,
    });

    const deleteExpense = useMutation({
        mutationFn: (id) => axios.delete(`/api/condo-finances/expenses/${id}`),
        onSuccess: invalidate,
    });

    return { saveIncome, deleteIncome, saveExpense, deleteExpense };
}

export default useFinanceMutations;