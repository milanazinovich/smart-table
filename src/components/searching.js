import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    const compare = createComparison({
        skipEmptyTargetValues: rules.skipEmptyTargetValues,
        searchMultipleFields: rules.searchMultipleFields(
            searchField, 
            ['date', 'customer', 'seller', 'amount'],
            false
        )
    });

    return (data, state, action) => {
        const searchValue = state[searchField];
        
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        return data.filter(row => compare(row, state));
    }
}