import {createComparison, defaultRules} from "../lib/compare.js";

// Создаем компаратор с правилами по умолчанию
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    if (indexes && elements) {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName] && indexes[elementName]) {
                const select = elements[elementName];
                const options = indexes[elementName];
                
                // Очищаем существующие опции (кроме первой пустой)
                while (select.options.length > 1) {
                    select.remove(1);
                }
                
                if (options && options.length) {
                    options.forEach(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        select.appendChild(option);
                    });
                }
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
                    if (field.tagName === 'SELECT' || field.tagName === 'INPUT') {
                        field.value = '';
                    }
                    const event = new Event('change', { bubbles: true });
                    field.dispatchEvent(event);
                }
            }
        }

        // Фильтруем данные
        return data.filter(row => {
            // Проверяем каждый фильтр
            for (const [key, value] of Object.entries(state)) {
                if (value === '' || value === null || value === undefined) {
                    continue;
                }
                
                // Обработка диапазона totalFrom
                if (key === 'totalFrom') {
                    const rowTotal = parseFloat(row.amount);
                    const fromValue = parseFloat(value);
                    if (!isNaN(rowTotal) && !isNaN(fromValue) && rowTotal < fromValue) {
                        return false;
                    }
                    continue;
                }
                
                // Обработка диапазона totalTo
                if (key === 'totalTo') {
                    const rowTotal = parseFloat(row.amount);
                    const toValue = parseFloat(value);
                    if (!isNaN(rowTotal) && !isNaN(toValue) && rowTotal > toValue) {
                        return false;
                    }
                    continue;
                }
                
                // Обработка фильтра по продавцу (seller)
                if (key === 'seller' && value !== '') {
                    if (row.seller !== value) {
                        return false;
                    }
                    continue;
                }
                
                // Обработка фильтра по покупателю (customer)
                if (key === 'customer' && value !== '') {
                    if (!row.customer.toLowerCase().includes(value.toLowerCase())) {
                        return false;
                    }
                    continue;
                }
                
                // Обработка фильтра по дате
                if (key === 'date' && value !== '') {
                    if (!row.date.includes(value)) {
                        return false;
                    }
                    continue;
                }
            }
            return true;
        });
    }
}