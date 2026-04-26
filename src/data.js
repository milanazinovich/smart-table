import {makeIndex} from "./lib/utils.js";

export function initData(sourceData) {
    const sellersObj = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    const customersObj = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`);
    
    const data = sourceData.purchase_records.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellersObj[item.seller_id],
        customer: customersObj[item.customer_id],
        total: item.total_amount
    }));
    
    // Преобразуем объекты в массивы уникальных значений для фильтров
    const sellers = [...new Set(Object.values(sellersObj))].sort();
    const customers = [...new Set(Object.values(customersObj))].sort();
    
    return {sellers, customers, data};
}