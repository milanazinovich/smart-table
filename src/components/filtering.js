import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            // Очищаем существующие опции (кроме первой, если это placeholder)
            const options = elements[elementName].querySelectorAll('option:not([value=""])');
            options.forEach(opt => opt.remove());
            
            // Добавляем новые опции из индекса
            Object.values(indexes[elementName]).forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                elements[elementName].appendChild(option);
            });
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const fieldName = action.dataset?.field;
            if (fieldName && elements[fieldName]) {
                const field = elements[fieldName];
                // Очищаем значение поля
                if (field.tagName === 'SELECT' || field.tagName === 'INPUT') {
                    field.value = '';
                }
                // Также очищаем значение в state (косвенно через форму)
                // Форма сама обновится при сбросе, но мы можем вызвать событие
                const event = new Event('change', { bubbles: true });
                field.dispatchEvent(event);
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}