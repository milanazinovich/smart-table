export function initSearching(searchField) {
    return (data, state, action) => {
        // Получаем значение поиска
        const searchValue = state[searchField];
        
        // Если поиск пустой - возвращаем все данные
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Приводим поисковый запрос к нижнему регистру
        const query = searchValue.toLowerCase().trim();
        
        // Фильтруем данные
        const filteredData = data.filter(row => {
            // Проверяем каждое поле строки
            const date = row.date?.toString().toLowerCase() || '';
            const customer = row.customer?.toString().toLowerCase() || '';
            const seller = row.seller?.toString().toLowerCase() || '';
            const total = row.total?.toString().toLowerCase() || '';
            
            // Если хотя бы одно поле содержит искомую подстроку - возвращаем true
            return date.includes(query) || 
                   customer.includes(query) || 
                   seller.includes(query) || 
                   total.includes(query);
        });
        
        return filteredData;
    };
}