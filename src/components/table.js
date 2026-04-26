import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    
    // Добавляем шаблоны "до" таблицы (в обратном порядке для правильной последовательности)
    if (before && before.length) {
        [...before].reverse().forEach(subName => {
            const cloned = cloneTemplate(subName);
            root.container.prepend(cloned.container);
            root[subName] = cloned;
        });
    }
    
    // Добавляем шаблоны "после" таблицы
    if (after && after.length) {
        after.forEach(subName => {
            const cloned = cloneTemplate(subName);
            root.container.append(cloned.container);
            root[subName] = cloned;
        });
    }

    // @todo: #1.3 —  обработать события и вызвать onAction()
    
    // Обработчик события change
    root.container.addEventListener('change', () => {
        onAction();
    });
    
    // Обработчик события reset (с задержкой, чтобы поля успели очиститься)
    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0);
    });
    
    // Обработчик события submit
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            // Клонируем шаблон строки
            const row = cloneTemplate(rowTemplate);
            
            // Заполняем ячейки данными
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    const element = row.elements[key];
                    // Проверяем тип элемента для правильного присвоения значения
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                        element.value = item[key];
                    } else {
                        element.textContent = item[key];
                    }
                }
            });
            
            return row.container;
        });
        
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}