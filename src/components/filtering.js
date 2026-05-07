export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        if (!elements || !indexes) return;
        
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            const options = indexes[elementName];
            
            if (select && select.tagName === 'SELECT' && Array.isArray(options)) {
                const currentValue = select.value;
                
                select.innerHTML = '<option value="" selected>—</option>';
                
                options.forEach(name => {
                    if (name) {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        select.appendChild(option);
                    }
                });
                
                if (currentValue && options.includes(currentValue)) {
                    select.value = currentValue;
                }
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const fieldName = action.dataset?.field;
            if (fieldName && elements[fieldName]) {
                const field = elements[fieldName];
                if (field) {
                    field.value = '';
                    const event = new Event('change', { bubbles: true });
                    field.dispatchEvent(event);
                }
            }
            return query;
        }

        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (!element) return;
            
            if (['INPUT', 'SELECT'].includes(element.tagName) && element.value) {
                filter[`filter[${element.name}]`] = element.value;
            }
        });

        return Object.keys(filter).length 
            ? Object.assign({}, query, filter) 
            : query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}