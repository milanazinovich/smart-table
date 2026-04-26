import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // Настраиваем компаратор для поиска по нескольким полям
    const compare = createComparison({
        skipEmptyTargetValues: rules.skipEmptyTargetValues,
        searchMultipleFields: rules.searchMultipleFields(
            searchField,           // имя поля в state (например 'search')
            ['date', 'customer', 'seller', 'total'],  // поля для поиска
            false                 // false = регистронезависимый поиск
        )
    });

    return (data, state, action) => {
        // Получаем значение поиска из state
        const searchValue = state[searchField];
        
        // Если поиск пустой или только пробелы - возвращаем все данные
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Фильтруем данные: оставляем только те строки, где есть совпадение
        return data.filter(row => compare(row, state));
    }
}