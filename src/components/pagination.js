import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // Подготавливаем шаблон кнопки для страницы и очищаем контейнер
    let pageTemplate = null;
    if (pages && pages.firstElementChild) {
        pageTemplate = pages.firstElementChild.cloneNode(true);
        pages.innerHTML = '';
    }

    return (data, state, action) => {
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.max(1, Math.ceil(data.length / rowsPerPage));
        let page = state.page;
        
        // Корректируем страницу, если она выходит за пределы
        if (page > pageCount) page = pageCount;
        if (page < 1) page = 1;

        // Обрабатываем действия
        if (action) {
            switch(action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount;
                    break;
                default:
                    if (action.name === 'page' || action.type === 'radio') {
                        const newPage = parseInt(action.value);
                        if (!isNaN(newPage) && newPage >= 1 && newPage <= pageCount) {
                            page = newPage;
                        }
                    }
                    break;
            }
        }

        // Выводим кнопки пагинации
        if (pages && pageTemplate) {
            const visiblePages = getPages(page, pageCount, 5);
            pages.replaceChildren(...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);
                return createPage(el, pageNumber, pageNumber === page);
            }));
        }

        // Обновляем статус пагинации
        if (fromRow && toRow && totalRows) {
            const startRow = data.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
            const endRow = Math.min(page * rowsPerPage, data.length);
            
            fromRow.textContent = startRow;
            toRow.textContent = endRow;
            totalRows.textContent = data.length;
        }

        // Возвращаем нужные строки для текущей страницы
        const skip = (page - 1) * rowsPerPage;
        return data.slice(skip, skip + rowsPerPage);
    }
}