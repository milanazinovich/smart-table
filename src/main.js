import './fonts/ys-display/fonts.css';
import './style.css';

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

const api = initData(sourceData);

let applySearching = null;
let applyFiltering = null;
let applySorting = null;
let applyPagination = null;
let updatePagination = null;
let updateIndexes = null;

function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const page = parseInt(state.page ?? 1);
    
    return {
        ...state,
        rowsPerPage,
        page
    };
}

async function render(action) {
    const state = collectState();
    let query = {};
    
    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    
    if (updatePagination) {
        updatePagination(total, query);
    }
    
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

applySearching = initSearching('search');

const filterElements = sampleTable.filter?.elements || {};
({applyFiltering, updateIndexes} = initFiltering(filterElements));

const sortButtons = [];
const headerElements = sampleTable.header?.elements;
if (headerElements) {
    if (headerElements.sortByDate) sortButtons.push(headerElements.sortByDate);
    if (headerElements.sortByTotal) sortButtons.push(headerElements.sortByTotal);
}
applySorting = initSorting(sortButtons);

const paginationElements = sampleTable.pagination?.elements;
if (paginationElements) {
    ({applyPagination, updatePagination} = initPagination(
        {
            pages: paginationElements.pages,
            fromRow: paginationElements.fromRow,
            toRow: paginationElements.toRow,
            totalRows: paginationElements.totalRows
        },
        (el, page, isCurrent) => {
            const input = el.querySelector('input');
            const span = el.querySelector('span');
            if (input) {
                input.value = page;
                if (isCurrent) input.checked = true;
            }
            if (span) span.textContent = page;
            return el;
        }
    ));
}

async function init() {
    const indexes = await api.getIndexes();
    
    if (updateIndexes && filterElements) {
        updateIndexes(filterElements, {
            searchBySeller: indexes.sellers,
            searchByCustomer: indexes.customers
        });
    }
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

init().then(render).catch(err => {
    console.error('Failed to initialize app:', err);
    sampleTable.render([]);
});