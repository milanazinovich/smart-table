import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    if (indexes && elements) {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            const options = indexes[elementName];
            
            if (select && select.tagName === 'SELECT' && options && Array.isArray(options)) {
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                options.forEach(name => {
                    if (name) {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        select.appendChild(option);
                    }
                });
            }
        });
    }

    return (data, state, action) => {
        // Обрабатываем очистку поля
        if (action && action.name === 'clear' && elements) {
            const fieldName = action.dataset?.field;
            if (fieldName && elements[fieldName]) {
                const field = elements[fieldName];
                if (field) {
                    field.value = '';
                    const event = new Event('change', { bubbles: true });
                    field.dispatchEvent(event);
                }
            }
        }

        return data.filter(row => {
            // Используем поле total (не amount)
            const rowTotal = typeof row.total === 'number' ? row.total : parseFloat(row.total);
            
            // Фильтр по дате
            if (state.date && state.date !== '') {
                if (!row.date.includes(state.date)) {
                    return false;
                }
            }
            
            // Фильтр по покупателю
            if (state.customer && state.customer !== '') {
                if (!row.customer.toLowerCase().includes(state.customer.toLowerCase())) {
                    return false;
                }
            }
            
            // Фильтр по продавцу (точное совпадение)
            if (state.seller && state.seller !== '') {
                if (row.seller !== state.seller) {
                    return false;
                }
            }
            
            // Фильтр по сумме "от" (totalFrom)
            if (state.totalFrom !== undefined && state.totalFrom !== null && state.totalFrom !== '') {
                const fromValue = parseFloat(state.totalFrom);
                if (!isNaN(fromValue)) {
                    if (rowTotal < fromValue) {
                        return false;
                    }
                }
            }
            
            // Фильтр по сумме "до" (totalTo)
            if (state.totalTo !== undefined && state.totalTo !== null && state.totalTo !== '') {
                const toValue = parseFloat(state.totalTo);
                if (!isNaN(toValue)) {
                    if (rowTotal > toValue) {
                        return false;
                    }
                }
            }
            
            return true;
        });
    };
}