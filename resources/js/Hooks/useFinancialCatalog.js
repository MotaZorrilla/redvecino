/**
 * @file useFinancialCatalog.js
 * @description Hook de React Query para el catálogo financiero (incomes/expenses).
 * Reemplaza el useEffect + setFinancialCatalog de Dashboard.jsx.
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchFinancialCatalog = async () => {
    const res = await axios.get('/api/condo-finances/catalog');
    return res.data;
};

export function useFinancialCatalog(enabled) {
    return useQuery({
        queryKey: ['financial-catalog'],
        queryFn: fetchFinancialCatalog,
        enabled: !!enabled,
    });
}

export default useFinancialCatalog;