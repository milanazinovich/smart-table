import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // Запоминаем выбранный режим сортировки
            if (sortMap[action.dataset.value]) {
                action.dataset.value = sortMap[action.dataset.value];
            }
            field = action.dataset.field;
            order = action.dataset.value;

            // Сбрасываем сортировки остальных колонок
            columns.forEach(column => {
                if (column && column.dataset && column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // Получаем выбранный режим сортировки из состояния
            columns.forEach(column => {
                if (column && column.dataset && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        return sortCollection(data, field, order);
    }
}