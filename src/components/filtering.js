export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            const select = elements[elementName];
            const options = indexes[elementName];
            
            if (select && select.tagName === 'SELECT' && Array.isArray(options)) {
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
    };

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
      const fieldName = action.dataset?.field;
      const input = action.parentElement.querySelector('input');
      input.value = '';
      state[fieldName] = '';
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