import {createComparison, defaultRules} from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполняем выпадающие списки опциями
    if (indexes && elements) {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName] && indexes[elementName]) {
                const select = elements[elementName];
                const options = indexes[elementName];
                
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
                if (field && (field.tagName === 'SELECT' || field.tagName === 'INPUT')) {
                    field.value = '';
                    const event = new Event('change', { bubbles: true });
                    field.dispatchEvent(event);
                }
            }
        }

        return data.filter(row => compare(row, state));
    }
}