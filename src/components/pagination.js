import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    let pageTemplate = null;
    if (pages && pages.firstElementChild) {
        pageTemplate = pages.firstElementChild.cloneNode(true);
        pages.innerHTML = '';
    }

    let pageCount = 1;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        const currentPageCount = pageCount || 1;

        if (page > currentPageCount) page = currentPageCount;
        if (page < 1) page = 1;

        if (action) {
            switch(action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(currentPageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = currentPageCount;
                    break;
                default:
                    if (action.name === 'page' || action.type === 'radio') {
                        const newPage = parseInt(action.value);
                        if (!isNaN(newPage) && newPage >= 1 && newPage <= currentPageCount) {
                            page = newPage;
                        }
                    }
                    break;
            }
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.max(1, Math.ceil(total / limit));

        if (pages && pageTemplate) {
            const visiblePages = getPages(page, pageCount, 5);
            pages.replaceChildren(...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            }));
        }

        if (fromRow && toRow && totalRows) {
            const startRow = total === 0 ? 0 : (page - 1) * limit + 1;
            const endRow = Math.min(page * limit, total);
            
            fromRow.textContent = startRow;
            toRow.textContent = endRow;
            totalRows.textContent = total;
        }
    };

    return {
        applyPagination,
        updatePagination
    };
};