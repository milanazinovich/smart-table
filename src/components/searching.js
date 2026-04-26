import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison({
        skipEmptyTargetValues: rules.skipEmptyTargetValues,
        searchMultipleFields: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller', 'product', 'region', 'manager'], false)
    });

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        const searchValue = state[searchField];
        
        // Если поиск пустой, возвращаем все данные
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Фильтруем данные по поисковому запросу
        return data.filter(row => compare(row, state));
    }
}