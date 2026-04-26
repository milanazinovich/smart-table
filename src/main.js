import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

let applySearching = null;
let applyFiltering = null;
let applySorting = null;
let applyPagination = null;

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
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

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let result = [...data];
    
    if (applySearching) {
        result = applySearching(result, state, action);
    }
    if (applyFiltering) {
        result = applyFiltering(result, state, action);
    }
    if (applySorting) {
        result = applySorting(result, state, action);
    }
    if (applyPagination) {
        result = applyPagination(result, state, action);
    }

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// Инициализация поиска
applySearching = initSearching('search');

// Инициализация фильтрации
const filterElements = sampleTable.filter?.elements || {};
applyFiltering = initFiltering(filterElements, {
    search: indexes.sellers || [],
    searchByCustomer: indexes.customers || []
});

// Инициализация сортировки - ИСПРАВЛЕНО
const sortButtons = [];
const headerElements = sampleTable.header?.elements;
if (headerElements) {
    // headerElements - это объект, ищем кнопки по ключам
    const dateButton = headerElements.sortByDate;
    const totalButton = headerElements.sortByTotal;
    if (dateButton) sortButtons.push(dateButton);
    if (totalButton) sortButtons.push(totalButton);
}
applySorting = initSorting(sortButtons);

// Инициализация пагинации - ИСПРАВЛЕНО
const paginationElements = sampleTable.pagination?.elements;
if (paginationElements) {
    applyPagination = initPagination(
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
                if (isCurrent) {
                    input.checked = true;
                }
            }
            if (span) {
                span.textContent = page;
            }
            return el;
        }
    );
}

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();