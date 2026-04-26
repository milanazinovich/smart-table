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

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    if (before && before.length) {
        [...before].reverse().forEach(subName => {
            const cloned = cloneTemplate(subName);
            root.container.prepend(cloned.container);
            root[subName] = cloned;
        });
    }
    
    if (after && after.length) {
        after.forEach(subName => {
            const cloned = cloneTemplate(subName);
            root.container.append(cloned.container);
            root[subName] = cloned;
        });
    }

    // @todo: #1.3 — обработать события и вызвать onAction()
    root.container.addEventListener('change', () => {
        onAction();
    });
    
    root.container.addEventListener('reset', () => {
        setTimeout(() => {
            onAction();
        }, 0);
    });
    
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });

   const render = (data) => {
    const nextRows = data.map(item => {
        const row = cloneTemplate(rowTemplate);
        
        Object.keys(item).forEach(key => {
            // Маппинг полей: total остается total (не amount)
            let templateKey = key;
            // Если нужно, можно добавить другие маппинги
            
            if (row.elements[templateKey]) {
                const element = row.elements[templateKey];
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