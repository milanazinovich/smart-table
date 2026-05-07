import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            if (sortMap[action.dataset.value]) {
                action.dataset.value = sortMap[action.dataset.value];
            }
            
            field = action.dataset.field;
            order = action.dataset.value;

            columns.forEach(column => {
                if (column && column.dataset && column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            columns.forEach(column => {
                if (column && column.dataset && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        const sort = (field && order && order !== 'none') ? `${field}:${order}` : null;

        return sort 
            ? Object.assign({}, query, { sort }) 
            : query;
    };
}