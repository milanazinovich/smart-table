export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    if (indexes && elements) {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            const options = indexes[elementName];
            
            if (select && select.tagName === 'SELECT' && options && Array.isArray(options)) {
                // Очищаем все опции кроме первой
                select.innerHTML = '<option value="" selected>—</option>';
                
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
        if (action && action.name === 'clear') {
            const fieldName = action.dataset?.field;
            if (fieldName && elements[fieldName]) {
                const field = elements[fieldName];
                if (field) {
                    field.value = '';
                    // Создаем событие change для обновления состояния
                    const event = new Event('change', { bubbles: true });
                    field.dispatchEvent(event);
                }
            }
            return data;
        }

        // Фильтруем данные
        return data.filter(row => {
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
            
            // Фильтр по сумме "от"
            if (state.totalFrom && state.totalFrom !== '') {
                const rowTotal = parseFloat(row.total);
                const fromValue = parseFloat(state.totalFrom);
                if (!isNaN(rowTotal) && !isNaN(fromValue) && rowTotal < fromValue) {
                    return false;
                }
            }
            
            // Фильтр по сумме "до"
            if (state.totalTo && state.totalTo !== '') {
                const rowTotal = parseFloat(row.total);
                const toValue = parseFloat(state.totalTo);
                if (!isNaN(rowTotal) && !isNaN(toValue) && rowTotal > toValue) {
                    return false;
                }
            }
            
            return true;
        });
    };
}