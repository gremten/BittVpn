# Валидность формы тех. карты (проверка сомнения автора)

Дата: 2026-11-06. Задача от автора через Ядрышко. Решений в журнал не вношу — решает автор. Макеты и заглушки tm/ в Figma не трогал.

## Вывод (кратко)

1. Две части формы разные по поддержке источниками. **Wireflow** (экраны + стрелки действий пользователя, «меняется только то, что меняется») — стандартный документированный формат (NN/g, Balsamiq). **Таблица «экран × состояние»** — стандартная практика «перечень состояний экрана» (Hurff, NN/g, блоги), но под именем «state matrix / spec», а не «тех. карта».
2. Название «тех. карта» в источниках не встречается. Ближайшие стандартные: *wireflow* (нарисованное), *design specification* / *prototype specification* (описание требований к экранам и состояниям). Для автора рекомендую **«карта экранов»**: коротко, не обещает «техники», соответствует тому, что в ней лежит (экран + что на нём меняется). Это моё предложение, не термин из источника.
3. Сомнение автора частично обосновано: NN/g прямо пишет, что спецификации **не нужны**, когда интерфейс простой, проект небольшой или компоненты уже описаны в дизайн-системе; нужны, когда взаимодействия сложные или команда новая. Гибрид (wireflow + таблица + две диаграммы состояний) источниками **не поддержан** — это мой синтез из раздела 8 `tech_map_form.md`; диаграммы состояний заказа и устройства для автора избыточны, пока он их не просит.
4. Главный вопрос «нужна ли карта, если сценарий уже со всеми состояниями»: она **дублирует**, если в сценарии у каждого состояния уже есть экран, что на нём меняется и откуда/куда ведёт. Она **добавляет** только то, чего в сценарии нет по определению: привязку к экранам-слотам (есть макет / нет), проверку полноты «экран × вариант», место, куда ложатся макеты. Я сценарии автора с состояниями не видел — оценить дублирование точнее не могу.
5. Нарисованная карта при готовом флоу v2 нужна только как слой, на который «натягиваются» макеты (критерий К9 автора). Если макеты потом делаются прямо по сценарию, нарисованная карта — лишний шаг; таблица без рисунка достаточна.
6. Экраны-компоненты в Figma: instance swap сохраняет переопределения по эвристикам, но вложенный swap и смена основного компонента их сбрасывают (документация и форум Figma). Остальные ограничения (вес файла, ссылки прототипа при swap, комментарии, варианты) в открытых страницах **не проверены** — проверять пилотом (раздел 4).

## Делать так

Карта экранов = одна таблица «экран × состояние × что меняется × откуда/куда × требование × источник × макет» как основа; рисовать wireflow только если автор подтвердит, что макеты будут «натягиваться» на карту, и сначала сделать пилот на одном подсценарии; диаграммы состояний не делать.

---

## 1. Источники (открыты в этой задаче; цитаты дословно)

| № | Источник | Цитата | Что подтверждает |
|---|---|---|---|
| T1 | NN/g, «Prototype Specifications» — https://www.nngroup.com/articles/prototype-specifications/ | «are a few lines of text written next to a prototype and describing details that may be ambiguous in the design.»; пример функциональной спецификации: «Different states of UI components»; «The user flow for complex interactions»; «the context of your project and team determines whether you should include specification in your project.» Спецификации не нужны при простом интерфейсе/флоу, малом проекте или компонентах из дизайн-системы с описанным поведением (пересказ страницы) | состояния и флоу — типичное содержимое спецификации; нужна не всегда |
| T2 | NN/g, «Wireflows» — https://www.nngroup.com/articles/wireflows/ | wireflow — «a design-specification format that combines wireframe-style page layout designs» с «a simplified flowchart-like way of representing interactions»; блок-схемы «lack the page context»; wireframes «don't describe interaction well» | wireflow = экраны + стрелки; это формат спецификации |
| T3 | IxDF, «Design Specifications» — https://ixdf.org/literature/topics/design-specifications | «Design specifications are detailed documents that outline essential requirements, constraints and specifications» «for products to adhere to.»; в UX спецификации «tend to consist of a minimum of annotated page or UI or component wireframes», плюс user interaction flows и sitemap | спецификация экранов — норма; состоит из экранов с аннотациями, флоу и карты |
| T4 | NN/g, «User Journeys vs. User Flows» — https://www.nngroup.com/articles/user-journeys-vs-user-flows/ | поток: «A set of interactions that describe the typical or ideal set of steps needed to accomplish a common task.»; wireflows «document the ideal or typical pathway through screens or pages»; flow-артефакты «capture key user steps and system responses» | флоу = типичный путь; состояния за его пределами (страница о состояниях не говорит) |
| T5 | Salesforce Trailhead, «Document Design Guidelines and Specifications» — https://trailhead.salesforce.com/content/learn/modules/systems-design-with-slds/document-design-guidelines-and-specifications | «There are six main interaction states that all designs must have specifications for.» (default, focus, hover, disabled, pressed, active) | перечень состояний — обязательная часть спецификации (для компонентов, не для экранов — граница применимости) |
| T6 | Figma Help, «Dev Mode statuses and notifications» — https://help.figma.com/hc/en-us/articles/26781702258583-Dev-Mode-statuses-and-notifications | Ready for dev: «Indicates that sections, frames, and components that are ready for a developer to review and implement.»; «The **Changed** state is set when a design that's been marked ready for dev or completed is modified.» «It cannot be set manually.» | статус применим к секциям, фреймам, компонентам; изменение автоматически помечается |
| T7 | Figma Plugin API, `InstanceNode` — https://developers.figma.com/docs/plugins/api/InstanceNode/ | `swapComponent` «preserves overrides using the same heuristics as instance swap in the Figma editor UI»; setter `mainComponent`: «setting this value clears all overrides and performs nested instance swapping» | swap сохраняет переопределения по эвристикам; смена основного компонента — сбрасывает |
| T8 | Figma Community Forum, «Expose nested instances lost if you swap the nested instance» — https://forum.figma.com/t/expose-nested-instances-lost-if-you-swap-the-nested-instance/54180 | автор: «If you do so, exposed nested component properties disappear.»; поддержка: «Yes, it's intended because of the "override".»; «Figma records the changes you make to an instance and preserves them» | при swap вложенного экземпляра выведенные свойства пропадают (поведение подтверждено как задуманное) |
| T9 | Scott Hurff, «How to fix a bad user interface» (UI stack), 2015 — из `tech_map_form.md`, С8 | «Every screen you interact with in a digital product has multiple personalities.»; «It's easy to overlook this state, and many product designers insert it as an afterthought.» | у экрана несколько состояний; их забывают |
| T10 | Balsamiq, «Wireflows» (Angeles) — из `tech_map_form.md`, Е2 | «Focus on the screens where something in the interface changes»; «These paths help you catch gaps or edge cases early and make your flow more complete.» | wireflow рисуют на экранах с изменениями; ловит пропуски |
| T11 | NN/g, «Wireflows» (Laubheimer) — раздел 11.1 `tech_map_form.md`, Е1 | «They are well suited for representing dynamic changes on one or few pages inside an app»; «work less well for capturing flows through a large number of relatively static pages linked together» | граница применимости wireflow |
| T12 | statecharts.dev, «What is a statechart» — `tech_map_form.md`, С2 | «A statechart is a state machine where each state in the state machine may define its own subordinate state machines, called substates.» | альтернатива для роста числа состояний (диаграмма), не для экранов |

Повторно открывал T1–T8 в этой задаче. T9–T12 — страницы открыты в прошлых задачах, цитаты взяты из `tech_map_form.md` (там проверены дословно); заново в этой задаче не открывал.

**Не проверено (получены только пересказы поисковика, страницы не открывал, цитат нет):** блоги вендоров про «state matrix» (UXMagic и подобные: «полная матрица состояний», «30–40% состояний на счастливом пути») — это цифры и тезисы блогов без первоисточника, в доказательства не беру; DesignOps handoff checklist; Webstacks; Material M3 States, Apple HIG Loading (не открылись ранее).

## 2. Ответы на четыре вопроса

### 2.1. Название артефакта между флоу и экранами

В открытых источниках нет термина «тех. карта». Есть:
- **wireflow** (T2, T4, T10, T11) — нарисованное: экраны + стрелки;
- **design / prototype specification** (T1, T3) — описание требований, состояний и флоу сложных взаимодействий;
- «перечень состояний экрана» (T9) — без устоявшегося названия в открытых страницах.
«Screen inventory», «state matrix», «UI state map», «screen spec» как термины подтвердить страницами **не удалось** (только блоги в поиске, не открыты). Рекомендация: **«карта экранов»** (не из источника). Если нужен «стандартный» термин для беседы с внешними дизайнерами — «wireflow» для рисунка и «screen specification» для таблицы.

### 2.2. Валидна ли таблица и чего ей не хватает по сравнению с нарисованной картой

- Валидна: T3 («annotated page or UI or component wireframes» — аннотации к экранам), T1 (спецификация состояний), T9 (у экрана несколько состояний).
- Чего не хватает таблице относительно рисунка (по T2, T10, T11): *контекста экрана* (T2: блок-схемы «lack the page context» — таблица без макета в том же положении), *видимости пути* (стрелки действий), *быстрого обнаружения пропусков по ветке* (T10). Чего не хватает рисунку относительно таблицы: проверки полноты «экран × вариант» (пропуск в таблице виден как пустая клетка; на схеме — нет) — это мой вывод, прямого источника нет.
- Нужна ли нарисованная карта при флоу v2 (FigJam 5:157)? Флоу v2 — путь пользователя (T4: «typical or ideal set of steps»), состояния он по Ф15 не несёт. Нарисованная карта нужна, если (а) на неё будут «натягиваться» макеты (К9 автора) и (б) подсценариев с отдельным путём ≥ нескольких (по T11 wireflow хорош для «одной или немногих страниц с динамическими изменениями»; при большом наборе статичных страниц — слабее). Для онбординга: 5 подсценариев (раздел 11.3 `tech_map_form.md`) — на границе, решать пилотом.

### 2.3. Экраны-компоненты в Figma

Подтверждено источниками:
- instance swap сохраняет переопределения «по эвристикам» редактора (T7); при смене основного компонента через API переопределения сбрасываются (T7);
- при swap вложенного экземпляра выведенные свойства пропадают; это «intended» (T8);
- Ready for dev применим к секциям, фреймам и компонентам; флаг Changed ставится автоматически (T6).
**Не проверено в открытых страницах (проверять пилотом):** вес файла при множестве экземпляров макетов; сохраняются ли стрелки/ссылки прототипа и коннекторы при swap; как работают комментарии на экземплярах; пределы вариантов компонента и вложенности; Dev Mode для заглушек; поведение при замене заглушки на реальный макет, когда макеты в другом файле/библиотеке.
**Альтернативы** (мои, источников нет): настоящие фреймы макета прямо на карте (без компонентов) с обновлением вручную; ссылки/превью на макет вместо вставки; плагины синхронизации. Выбор — после пилота.
**Что проверить на пилоте** (один подсценарий, 3–4 экрана): (1) swap заглушка → реальный макет: остались ли подписи tm/ и коннекторы; (2) переименование/удаление макета: что происходит с экземпляром; (3) вес и скорость файла при 30+ экземплярах; (4) видимость и перенос комментариев; (5) Dev Mode: открываются ли заметки блока tm/screen; (6) что делает автор при смене макета: правит карту или она обновляется сама.

### 2.4. Нужна ли тех. карта автору, который уже собирает «сценарий со всеми состояниями»

По T1: спецификация нужна, когда без неё остаётся неоднозначность; при простых путях и готовой дизайн-системе — нет. Сценарий v5 описывает пользователя (боль/ожидание/ставка/ход событий) — не экран. Поэтому:
- **Дублирует**, если в каждом состоянии сценария уже названы экран, изменение на экране и переходы. Тогда отдельная таблица — копия, расхождение копий растёт со временем (риск моего вывода, не цитата).
- **Добавляет:** (а) явный перечень экранов-слотов с признаком «макет есть/нет/частично» (в инвентаре 32 слота: есть 16, частично 2, концепт 4, нет 10 — раздел 11.7 `tech_map_form.md`); (б) проверку «экран × вариант» на пропуски; (в) место, куда макет встаёт, не дожидаясь остальных.
- Если автор и так ведёт то же в сценарии, самое экономное: **не делать отдельный артефакт, а добавить в сценарий колонки «экран» и «макет»** — проверить по одному его готовому сценарию, что именно в нём уже есть. Это требует его материала; я его не видел.

## 3. Расхождения и ограничения

- Прямых источников «лучшая форма тех. карты» нет (как и в прошлых задачах).
- T5 говорит о состояниях элементов (hover, focus и т.д.), не экранов; использую только как подтверждение «перечень состояний — часть спецификации».
- T1 перечисляет случаи «не нужно» по пересказу страницы (инструмент вернул резюме; точные формулировки пунктов не показал).
- Оценки «дублирует/добавляет» — мои, без данных о сценариях автора.
