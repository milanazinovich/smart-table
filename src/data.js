import {makeIndex} from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

let sellersCache;
let customersCache;
let lastResult;
let lastQuery;

const mapRecords = (data, sellers, customers) => data.map(item => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount
}));

export function initData(sourceData) {
    const sellersObj = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    const customersObj = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.first_name}`);
    
    const localData = sourceData.purchase_records.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellersObj[item.seller_id],
        customer: customersObj[item.customer_id],
        total: item.total_amount
    }));
    
    const localSellers = [...new Set(Object.values(sellersObj))].sort();
    const localCustomers = [...new Set(Object.values(customersObj))].sort();

    const getIndexes = async () => {
        if (!sellersCache || !customersCache) {
            try {
                [sellersCache, customersCache] = await Promise.all([
                    fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                    fetch(`${BASE_URL}/customers`).then(res => res.json()),
                ]);
            } catch (e) {
                console.warn('Server unavailable, using local indexes', e);
                sellersCache = localSellers;
                customersCache = localCustomers;
            }
        }
        return { sellers: sellersCache, customers: customersCache };
    };

    const getRecords = async (query = {}, isUpdated = false) => {
        const qs = new URLSearchParams(query);
        const nextQuery = qs.toString();

        if (lastQuery === nextQuery && !isUpdated && lastResult) {
            return lastResult;
        }

        try {
            const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
            const records = await response.json();

            if (!sellersCache || !customersCache) {
                await getIndexes();
            }

            lastQuery = nextQuery;
            lastResult = {
                total: records.total,
                items: mapRecords(records.items, sellersCache, customersCache)
            };

            return lastResult;
        } catch (e) {
            console.warn('Server fetch failed, using local data', e);
            
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const start = (page - 1) * limit;
            const end = start + limit;
            
            return {
                total: localData.length,
                items: localData.slice(start, end)
            };
        }
    };

    return {
        getIndexes,
        getRecords
    };
}