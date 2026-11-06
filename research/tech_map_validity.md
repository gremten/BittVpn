# Валидность формы тех. карты (проверка сомнения автора)

Дата: 2026-11-06. Задача от автора через Ядрышко. Решений в журнал не вношу — решает автор. Макеты и заглушки tm/ в Figma не трогал.

> **Дополнено 2026-11-06:** раздел 5 «Названия и границы А/Б» (артефакты после флоу: А — описание всех состояний экранов, Б — спецификация для разработчиков).

> **Дополнено 2026-11-06 (ещё раз):** раздел 6 «Процесс после флоу: проверка схемы автора по источникам» (экран × состояния, статус платёжного заказа, критерии «состояние или экран»).

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


---

## 5. Названия и границы А/Б (запрос автора через Ядрышко, 2026-11-06)

### Вывод (кратко)

1. Единого устоявшегося названия для А и Б в открытых источниках **нет**. Найдены разрозненные: русское «карта экранов» (DTF), «wireflow» (NN/g), «design specification» / «prototype specification» (IxDF, NN/g), «матрица состояний» (только пересказ поисковика, страницу не открывал). Термины «screen inventory», «state matrix», «UI states spec» как отраслевые подтвердить **не удалось** (только блоги и шаблоны низкого авторитета).
2. **Б** по источникам — это «спецификация»: IxDF пишет, что она «tend to consist of a minimum of annotated page or UI or component wireframes», плюс флоу. **А** как отдельного названного артефакта в открытых источниках нет; ближе всего «карта экранов» (DTF) и перечень состояний экрана (Hurff, Ozon, UI/UX Atlas).
3. Граница А/Б — **моя интерпретация**: А = перечень экранов-слотов, состояний, переходов, основания и готовности (макета ещё нет); Б = А + макет + значения для реализации (тексты, правила, источники данных). Сливаются в один документ, когда у каждой карточки А появляется макет: карточка становится аннотацией к нему.
4. Из открытых страниц для разработчика называют: состояния загрузки, ошибки, пусто; какие запросы идут на экране, обязательные ли они, кэшируются ли данные; тексты пустых состояний (что произошло + что делать); имена компонентов из кода; описание сложного флоу. Критерии приёмки подтверждает S2 (текст от автора, T22): «Acceptance testing includes UX criteria based on the final prototype.» Анимации прямо не названы нигде, только «transitions between states» (T22) — пробел по анимациям остаётся.
5. Форма из примера автора (колонки-экраны, карточки-состояния, цвет = готовность, стрелки = действия) **подходит для А**: DTF описывает карту экранов с пометкой готовности экранов и стрелками переходов. Точного названия формы в источниках нет; название «карта экранов с карточками состояний» — моё.
6. Связка в Figma — только частично подтверждена источниками: Figma называет рамки-заглушки «difficult to scale and maintain», а `swapComponent` сохраняет переопределения. Про ссылки прототипа и сравнение «экземпляр / фрейм / ссылка» прямых источников нет — пилот.

### Рекомендация одной строкой («делать так»)

**А = «Карта экранов» (screen state map): колонки-экраны, карточки-состояния, цвет = готовность макета; Б = «Спецификация экранов» (screen specification): те же экраны с макетом и полями для разработки; связь через один экран-слот с id, куда потом встаёт макет (после пилота).** Названия — моё предложение.

### 5.1. Источники (цитаты дословно; «пересказ» помечен)

Открыты в этой задаче (T-номера продолжают раздел 1):

| № | Источник | Цитата / пересказ | Что даёт |
|---|---|---|---|
| T13 | DTF, «Карта экранов в разработке игрового интерфейса» — https://dtf.ru/18185-karta-ekranov-v-razrabotke-igrovogo-interfeysa | «Карта экранов — это схематичное отображение всех экранов проекта и связей между ними.»; «облегчить работу с интерфейсом проекта всем, кто с ним связан»; минусы: «Составление и поддержание карты в актуальном виде требует дополнительного времени и усилий», «При работе с особо большими проектами карта экранов становится громоздкой и теряет в эффективности». Пересказ: на карте показывают переходы, состояние интерфейса (какие экраны готовы, каких не хватает), пометки и стикеры; очевидные переходы вроде «назад» не рисуют | русское название А; готовность на карте; границы применимости. Автор — игровой интерфейс, не мобильный сервис |
| T14 | Habr, статья о состояниях экрана и запросах — https://habr.com/ru/articles/858524/ | «требуются дополнительные состояния — загрузки, ошибки или отсутствия контента»; «Попросите аналитика категоризировать запросы по обязательности»; «кэшируются ли данные на экране, и в какой момент мы их актуализируем»; «Тут нужен лоадер» или «Как выглядит ошибка?»; чек-лист автор держит в своём телеграм-канале, в статье его нет | что разработчику/дизайнеру нужно знать про состояния: запросы, обязательность, кэш |
| T15 | Habr (Ozon Tech), статья про пустые состояния — https://habr.com/en/companies/ozontech/articles/753022 | «Пустые состояния (empty states) — это сообщения, которые показывают, что в этой области интерфейса ничего нет.»; «В заголовке расскажите, что произошло, почему пользователь видит этот экран.»; «В подзаголовке дайте инструкцию, что пользователю делать дальше.» (про передачу макетов статья не говорит) | поля текста пустого состояния |
| T16 | UI/UX Atlas, урок «System states» — https://uiux-atlas.pages.dev/lessons/interaction-design/system-states-loading-skeleton-empty-error-and-success | «Before designing individual states, define the complete set of states your component or screen can be in.»; «A typical data-driven view has at minimum seven states:» (idle, loading, skeleton, populated, empty, error, success); про ошибку-как-пусто: «Distinguish this clearly from a genuine empty state, or users will assume the feature is simply unused.» Блог-уроки, авторитет низкий | сначала полный набор состояний, потом отрисовка (прямо соответствует А до макетов) |
| T17 | Figma, «Figma guide to developer handoff» — https://www.figma.com/best-practices/guide-to-developer-handoff/ | «the component name, description, usage instructions, variants, and states all exist.» (Expedia, рамка компонента); про Dropbox: «you won't find any redlines or callouts, because developers on her team are able to view all of the implementation details directly from Figma.»; «Designers might choose to include actual component names from the team's codebase.» Про edge cases страница не говорит | что кладут в Figma для разработчика |
| T18 | Figma Help, «Migrate a library to using slots» — https://help.figma.com/hc/en-us/articles/38607529833751-Migrate-a-library-to-using-slots | «Creating placeholder frames labeled `Content`, `Swap or replace me` or `Insert here`»; «worked as temporary solutions but are difficult to scale and maintain.»; «Slots in Figma replaces all of these patterns with a simpler, native way to define where content can go.»; «the overrides on the parent component won't carry over.» | заглушки-рамки против слотов/экземпляров |
| T19 | Figma Community Forum, «Swap frame with component» — https://forum.figma.com/t/swap-frame-with-component/57585 | «Quite often I get many iterations in and realise that I've been copying a frame all over my designs instead of a component.» (это запрос функции; поддержку в самом Figma страница не подтверждает) | риск фреймов: копии вместо компонента |
| T20 | «UX States Spec» (шаблон, pages.dev) — https://innovation-day-86f.pages.dev/spec-first-build/templates/ux-states-spec-template | «every screen has four states, not one»; колонки таблицы: «State», «Trigger», «What the user sees»; состояния: Loading, Populated, Empty, Error. Шаблон безымянного автора, авторитет низкий | пример таблицы Б |

Тексты от автора (страницы не открывались, выдержки в `research/sources_from_author_1.md`; пометка: **текст от автора, страница не открывалась**):

| № | Источник | Цитата | Что даёт |
|---|---|---|---|
| T21 | S1. Apple HIG «Loading» (developer.apple.com/design/human-interface-guidelines/loading) | «Show something as soon as possible. If you make people wait for loading to complete before displaying anything, they can interpret the lack of content as a problem with your app or game. Instead, consider showing placeholder text, graphics, or animations as content loads, replacing these elements as content becomes available.»; «Clearly communicate that content is loading and how long it might take to complete.» (в выдержке: определённый индикатор, когда время известно; неопределённый, когда нет); «In situations where content needs a second or two to load, it's better to display a loading indicator than a blank screen.» (watchOS) | поля состояния «загрузка» в А/Б: что видно вместо пустоты (заполнитель/скелетон), индикатор определённый или нет |
| T22 | S2. Чек-лист передачи дизайна разработке (текст со ссылками на uxpin.com; заголовок страницы не прислан, вероятно «Design Handoff Checklist» UXPin — сверить) | «Prototypes account for all interaction states, error states, and transitions between states.»; «Prototypes account for data extremes (e.g., short and long last names, phone number formats, non-US postcodes).»; «Annotate prototypes with use cases, failure states, and interaction nuances.»; «Acceptance testing includes UX criteria based on the final prototype.»; «Use an inspection tool to auto-generate visual specs... Avoid redlining as much as possible.» | состав Б: все состояния, переходы между ними, крайние данные, аннотации, критерии приёмки |

Уже открывались раньше (цитаты в разделе 1 и `tech_map_form.md`): T1 NN/g «Prototype Specifications», T2 NN/g «Wireflows», T3 IxDF «Design Specifications», T5 Trailhead, T9 Hurff, T10 Balsamiq.

**Не удалось / не проверено:** Material 3 («States», «Structure») — страницы вернули только заголовок; Apple HIG «Loading» мне не открылась, текст прислал автор (T21); Atlassian «About the Atlassian Design System» открылась, но про состояния и handoff не говорит (только «Our design system stores all design decisions in a centralized, accessible place.»); NN/g «Design handoff checklist» и «UX deliverables» — 404; Smashing (Hurff) — 404; UX Collective «Designing for different UI states» — 403; Nathan Curtis «Doneness Matrices» (кандидат на название цвета-готовности) — не открылась, только упоминание на странице Хабра; Яндекс, Тинькофф, Авито, Skillbox/Contented — прямых страниц про «карту состояний» и «спецификацию экрана» не нашёл; Хабр Q&A «матрица состояний» — только пересказ поисковика (определение «карта всех возможных состояний и вариантов взаимодействия» не цитирую); блоги вендоров про handoff-спеки (animation, acceptance criteria в пересказах) — страницы не открыл.

### 5.2. Ответы на вопросы

**Вопрос 1. Названия и границы.**
- А: прямого названия нет. Ближайшее русское — «карта экранов» (T13: экраны, связи, готовность, пометки). Для состояний — «перечень состояний экрана» (T9, T16: «define the complete set of states»). Тип материала у T20 — «UX States Spec».
- Б: «design specification» / «prototype specification» (T1, T3); wireflow (T2) — частный вид, где к экранам добавлены стрелки.
- Граница (моя): что **есть до макетов** (экран-слот, состояния, переходы, основание, готовность) — А; что **требует макета и значений** (тексты, размеры, источники данных, правила) — Б. T1 говорит, что объём спецификации зависит от проекта и команды («the context of your project and team determines whether you should include specification in your project») — граница не стандартизована.
- Слияние: одна карточка может быть и А, и Б, если она получила макет и поля реализации. Источников, описывающих этот переход, нет.

**Вопрос 2. Что нужно разработчикам в Б.**
Подтверждено страницами: состояния загрузки/ошибки/пусто (T14, T15, T16, T20); триггер состояния и «что видит» (T20); какие запросы идут и обязательные ли они, кэш (T14); текст пустого состояния — что произошло и что делать (T15); интерактивные состояния элементов (T5); имена компонентов из кода и описание (T17); флоу сложных взаимодействий (T1). Критерии приёмки и крайние данные — только T22 (текст от автора); анимации, правила не нашёл — это не вывод «не нужны», а «не проверено». Переходы между состояниями (T16 в пересказе поиска: nqui) — страница не открыта.

**Вопрос 3. Подходит ли форма примера для А.**
Структуру 8056:864 я знаю по выгрузке Дизайна (`second_designer_context_dump.md`; в Figma сам не читал): заголовок и пояснение; легенда из 5 статусов («Есть в макете», «Решено — отразить в макете», «Частично», «Нет / Не определено — сделать», «Правило»); 8 колонок-экранов со стрелками-коннекторами; карточки с полями: название состояния, что видит, куда ведёт («→»), основание («[шаг] · Г · джоб»), статус, иногда «кому» («→ Дизайн», «→ Автор»); внизу граф состояний устройства. Цвет в выгрузку не входит.
- Совпадает с T13 по сути (экраны + связи + готовность + пометки) и с T2/T10 по стрелкам-действиям. Это моё сопоставление, не определение из источника.
- Название формы в практике: точного нет; ближайшее — «карта экранов» (T13) по виду и «wireflow» (T2) по стрелкам; «матрица готовности» (Curtis) — не проверено.
- Ограничения по источникам: T13 — громоздко на больших проектах и нужно время на поддержку; T11 — wireflow слабее при большом числе статичных страниц. Для 8 колонок (8056:864) это не проблема; для карты всего приложения — риск.

**Вопрос 4. Связка А и Б в Figma.**
- Заглушки-рамки Figma называет временным решением, «difficult to scale and maintain» (T18); копирование рамки вместо компонента — частая ошибка (T19).
- `swapComponent` сохраняет переопределения по эвристикам; смена `mainComponent` их сбрасывает (T7); выведенные свойства пропадают при замене вложенного экземпляра (T8); при переходе на слоты «overrides … won't carry over» (T18).
- Вывод (моя интерпретация): экран-слот как **экземпляр одного компонента** с id и подписями (инстансы), макет встаёт заменой; рамки хуже (копии без связи); ссылка на макет в карточке — самый лёгкий вариант без зависимости от файла. Сравнения трёх подходов в открытых источниках нет. Что проверить пилотом — см. 2.3 выше; дополнительно: потеря подписей карточки при swap и поведение стрелок.

**Вопрос 5. Рекомендация.**
| | А | Б |
|---|---|---|
| Рус. | Карта экранов (с состояниями) | Спецификация экранов |
| Англ. | Screen state map | Screen specification |
| Опора | T13, T9, T16 | T1, T3 |
| Поля (из 8056:864) | экран-слот (id, название), состояние, что видит, куда ведёт, основание (шаг · гипотеза · джоб), статус (цвет), кому делать | всё из А + макет (ссылка/экземпляр) + триггер состояния + текст + запросы/обязательность/кэш (T14) + интерактивные состояния (T5) |
| Подтверждено текстом от автора (T22) | — | все состояния взаимодействия, ошибок и переходы между ними; крайние данные; аннотации «use cases, failure states, interaction nuances»; UX-критерии приёмки по финальному прототипу |
| Не подтверждено | — | анимации как отдельная часть (в T22 только «transitions between states») |
| Форма | колонки-экраны, карточки, цвет, стрелки | те же экраны, карточки, где вместо описания — макет с аннотациями |

Названия и границы — моё предложение; терминов, закреплённых отраслью, я не нашёл.

### 5.3. Что не проверено

Material 3, Apple HIG, Atlassian (про handoff), Smashing, UX Collective, Яндекс/Тинькофф/Авито/Skillbox; «Doneness Matrices» Curtis; Хабр Q&A «матрица состояний»; поведение стрелок/ссылок прототипа и подписей tm/ при swap; структура 8056:864 — по выгрузке Дизайна, цвета и ссылки на гипотезы по карточкам в Figma не сверял; соответствие экранов 8056:864 макетам (расхождение с «макетов онбординга нет» остаётся).


---

## 6. Процесс после флоу: проверка схемы автора по источникам (2026-11-06)

Решения в журнал не вношу (запись §120 делает автор). Свои предложения помечены «МОЁ».

### Вывод (кратко)

1. **Подтверждается:** состояния принадлежат экрану, а не фиче (Hurff: «Every screen … has multiple personalities»; NN/g wireflow: состояние — «the same app page» с изменением). Один статус заказа показывает один экран — источники этому не противоречат, но и прямо не говорят.
2. **Статус платёжного заказа:** все открытые документации (Stripe, ЮKassa) и практические статьи сходятся: итог платежа определяет **сервер** (уведомление webhook, при необходимости — запрос статуса), а не возврат пользователя по ссылке: «Сам факт возврата ничего не говорит об итоге» (ЮKassa, пересказ), «customers can leave the page after payment is complete» (Stripe). Из этого следуют состояния: ожидает, в обработке, успех, отказ, истёк срок. «Ушёл без оплаты» — не отдельный статус, а ожидание, которое кончается истечением срока.
3. **Решение автора «ошибка оплаты и истёкший таймер = один статус «Отменён»»** с источниками не спорит: у ЮKassa один итоговый статус `canceled`, причины (`expired_on_confirmation`, `insufficient_funds` и др.) отдельным полем. Но у Stripe отказ — не итоговый статус: платёж возвращается в состояние «можно повторить». «Возврат к подбору без статуса при отказе» ближе к Stripe; ЮKassa требует новый платёж.
4. **Не подтверждено / нет источников:** критерии «отдельный экран или состояние» и «когда делить экран» (авторитетных правил не нашёл — только косвенное: иерархия состояний, комбинаторный рост); «Назад зависит от входа»; показ причины отказа, когда её показала сторонняя платёжка. Что у нас делает бэкенд, не гадаю — вопросы разработчику в 6.5.
5. **Нужен ли отдельный список статусов сущности (заказ):** провайдеры ведут его на стороне сервера (фиксированный список), экран его **показывает**. МОЁ: короткая таблица «статус заказа → какое состояние какого экрана» нужна как мост, но это не отдельный артефакт, а столбец в карте экранов.
6. Итеративная проверка «матрица → правка флоу/экранов» подтверждается принципом полноты таблицы (decision table) и «ловить пропуски» (Balsamiq); сама схема правил 4 (пропуск → экран/правка флоу) — **МОЁ** синтез, прямого источника нет.

### 6.1. Источники (открыты в этой задаче; цитаты дословно, «пересказ» помечен)

| № | Источник | Цитата / пересказ | Что даёт |
|---|---|---|---|
| T23 | Stripe, «Payment status updates» — https://docs.stripe.com/payments/payment-intents/verifying-status | «Don’t attempt to handle order fulfillment on the client side because customers can leave the page after payment is complete but before the fulfillment process initiates. Instead, use webhooks to monitor the `payment_intent.succeeded` event»; «You can use polling instead of webhooks … but it’s much less reliable and might trigger rate limits.»; «If the payment attempt fails (for example, due to a decline), the PaymentIntent’s status returns to `requires_payment_method` so the payment can be retried.»; таблица: «The customer didn’t complete the checkout» → `requires_action`; событие `payment_failed`: «The customer’s payment was declined by a card network or otherwise expired.»; «Display an error message and prompt your customer to attempt payment again» | webhook — основной способ, опрос — запасной; отказ возвращает к повтору; «не завершил» = ожидание |
| T24 | Stripe, «How Payment Intents and Setup Intents work» — https://docs.stripe.com/payments/paymentintents/lifecycle | статусы: `requires_payment_method`, `requires_confirmation`, `requires_action`, `processing`, `succeeded`, `canceled`; `processing`: «asynchronous payment method … can take up to a few days»; `canceled`: «You can cancel a PaymentIntent before it reaches a `processing` or `succeeded` state» (пересказ); «Create the PaymentIntent as soon as you know the amount to charge so Stripe can record all attempted payments.» | список статусов платёжной сущности ведёт провайдер; «в обработке» — реальное состояние |
| T25 | ЮKassa, «Процесс платежа» — https://yookassa.ru/developers/payment-acceptance/getting-started/payment-process | статусы `pending`, `waiting_for_capture`, `succeeded`, `canceled` (итоговый); «Пользователь может подтвердить платеж только за определенный срок»; «Если он не сделает этого, ЮKassa отменит платеж, указав причину `expired_on_confirmation`.» (в пересказе страницы); `canceled` наступает при отмене магазином, истечении срока или отказе ЮKassa/провайдера (пересказ); получение статуса — запросом («периодически отправляйте запросы…») или уведомлением | один итоговый статус «отменён» с разными причинами; истечение — отмена по сроку |
| T26 | ЮKassa, «Входящие уведомления» — https://yookassa.ru/developers/using-api/webhooks | «Проверьте текущий статус объекта, чтобы убедиться, что статус из уведомления актуален.»; «ЮKassa продолжит доставлять уведомление в течение 24 часов, начиная с момента, когда событие произошло.»; подтверждать получение — «ответьте кодом состояния HTTP 200» | уведомление + проверка статуса запросом; повторная доставка |
| T27 | ЮKassa, «Неуспешные платежи» — https://yookassa.ru/developers/payment-acceptance/after-the-payment/declined-payments | пересказ (дословных фраз страница для покупателя не даёт): причина приходит в `cancellation_details` (`party`, `reason`); страница предлагает использовать её для сообщений пользователю; таблица причин с советом покупателю (`insufficient_funds` — «пополнить баланс или выбрать другой способ», `expired_on_confirmation` — «повторить платеж и завершить оплату» и др.); отменённый платёж не повторяется автоматически, нужен новый | причина доступна магазину; совет — конкретное действие; повтор = новый платёж |
| T28 | ЮKassa, «Быстрый старт» — https://yookassa.ru/developers/payment-acceptance/getting-started/quick-start | «После успешной оплаты (и если что-то пойдет не так) ЮKassa вернет пользователя на `return_url`»; «Платеж можно считать успешным, как только он перешел в статус `succeeded`.»; статус надо проверять уведомлением или запросом, в том числе после возврата (пересказ) | возврат по ссылке не говорит об итоге |
| T29 | Paystack-статья (mctaba.com), «Race conditions between webhooks and redirect callbacks» — https://mctaba.com/learn/paystack/race-conditions-between-paystack-webhooks-and-redirect-callbacks | «The redirect can arrive before the webhook, leaving your callback page showing a pending order»; «when the callback page loads, call the Paystack Verify API to check the transaction status.»; «If your database shows 'pending' and you have not verified with Paystack, the payment might have succeeded.»; не показывать отказ по одному только «pending»; если ещё идёт — показать «в обработке» (пересказ). Блог-статья, авторитет ниже документации | при возврате не делать вывод об отказе по «ожидает» |
| T30 | dev.to, «Your checkout redirect is not payment confirmation» — https://dev.to/ecomtrad24/your-checkout-redirect-is-not-payment-confirmation-c4i | «It only tells you that the customer's browser reached a certain URL.»; «A customer can close the tab.»; статусы-примеры «created, pending, processing, paid, failed, expired, cancelled, review, refunded»; система только с «успех/неудача» «will lose important information» (пересказ); «A session can expire.» Блог, авторитет низкий | список состояний заказа; ушёл с вкладки — не отказ |

Из ранних разделов: T9 Hurff, T10 Balsamiq, T11 NN/g wireflow, T12 statecharts.dev, С6 Wikipedia «Decision table» («A decision table is considered balanced or complete if it includes every possible combination of input variables.»), С7 Wikipedia «Combinatorial explosion» — страницы открыты в прошлых задачах, здесь повторно не открывал. T14 (Habr), T16 (UI/UX Atlas), T20 (шаблон) — раздел 5.1.

**Не открыто / не проверено:** UI-книга Anthony Alicea («screen» vs «frame») — PDF не прочитался, есть только пересказ поисковика («an action may or may not take you to a new screen but will almost always take you to a new frame») — **цитатой не использую**; Baymard о причине отказа — страница вернула 410, есть лишь пересказ поисковика; Edfapay, Juspay, Amazon Pay — пересказы поисковика; сведений о том, **как именно** наше приложение получает статус от платёжки, нет (бэкенд не гадаю).

### 6.2. Критерии «состояние того же экрана / отдельный экран» и «когда делить экран»

| Что | Источник и цитата | Интерпретация |
|---|---|---|
| Состояние — тот же экран с изменением | NN/g (T11): «one can visualize only the elements that do change due to user input.»; «each wireframe corresponds to the same app page, rather than representing different app pages» | Если меняется часть экрана и страница та же — это состояние, а не новый экран |
| Экран имеет несколько состояний | Hurff (T9): «Every screen you interact with in a digital product has multiple personalities.» | Состояния принадлежат экрану |
| Рост числа состояний | statecharts.dev (T12): состояние может иметь подсостояния; С7: «the rapid growth of the complexity of a problem due to the way its combinatorics depends on input, constraints and bounds» | МОЁ: когда состояний слишком много и они в разных условиях — иерархия/деление |
| Своя цель и действия → отдельный экран | **Источника не нашёл** | МОЁ (правило автора 4): ориентир — что меняется: часть экрана или цель пользователя. Пересказ поиска про «screen vs frame» (страница не открыта) согласуется, но цитатой не является |
| Состояние требует действия, которого нет во флоу → править флоу | **Источника не нашёл** | МОЁ; логика: флоу описывает действия пользователя (T4: «interactions that describe the typical or ideal set of steps»), значит действие, которого нет, = дыра во флоу |
| Состояние некуда положить | **Источника не нашёл** | МОЁ; опора на «полноту таблицы» (С6) и «ловить пропуски» (T10) |

### 6.3. Привязка состояний: экран или фича; экран, общий для нескольких фич

- Подтверждено: состояния — свойство экрана (T9, T11). Ни один открытый источник не говорит «состояния лежат у фичи».
- Экран общий для нескольких фич: прямых источников нет. МОЁ (из пилота 8056:864 и правил автора): в карточке экрана строка «откуда приходят» (фича/вход), у каждого состояния — «основание» (подсценарий/гипотеза/джоб); «Назад» — отдельное поле на вход. «Назад зависит от входа» — источников не нашёл; при этом Ф25 (простой «Назад» не ветка) уже в критериях флоу.
- Риск (МОЁ): если состояния описывать «на фичу», один и тот же статус окажется в нескольких местах и расходится; поэтому у экрана одна колонка, у состояния — ссылки на фичи.

### 6.4. Статус платёжного заказа от сторонней платёжки

Что подтверждено документацией и статьями:
- **Основной способ — уведомление (webhook)** на сервер: Stripe T23 — не завершать выдачу на клиенте, «customers can leave the page»; ЮKassa T26 — после события приходит уведомление, получение подтверждают HTTP 200, доставка повторяется 24 часа.
- **Запрос статуса (опрос)** — запасной: Stripe T23 — «much less reliable and might trigger rate limits»; ЮKassa T25 допускает периодические запросы; перед верой уведомлению — проверить статус запросом (T26).
- **Возврат по ссылке** (`return_url`) — **не итог**: ЮKassa T28 — возврат и при успехе, и «если что-то пойдет не так»; Stripe/T29/T30 — редирект может прийти раньше уведомления или не прийти вовсе (закрыл вкладку).
- Следующие состояния (по документации/статьям, не по нашему бэкенду):
  - **ожидает оплаты / не завершил:** ЮKassa `pending`, Stripe `requires_action` («The customer didn’t complete the checkout»);
  - **в обработке:** Stripe `processing` (асинхронные методы — до нескольких дней);
  - **успех:** ЮKassa `succeeded`, Stripe `succeeded`;
  - **отказ:** ЮKassa — итоговый `canceled` с причиной (T25, T27); Stripe — возврат к `requires_payment_method` для повтора (T23);
  - **истёк срок:** ЮKassa — `canceled` с причиной `expired_on_confirmation` (T25); Stripe — «declined by a card network or otherwise expired» (событие `payment_failed`, T23).
- **«Ушёл без оплаты»** отдельного статуса не имеет: платёж остаётся в ожидании до срока и затем отменяется по сроку (T25) — вывод из страниц. Что на возврате ожидание нельзя показывать как отказ — T29.

Сверка с решениями автора (журнал): 
- «Ошибка оплаты и истёкший таймер = один статус «Отменён»» — совместимо с ЮKassa (один итоговый `canceled`, причина отдельным полем); у Stripe отказ не итоговый, поэтому наш «Отменён» должен быть именно итоговым статусом заказа в нашей модели, а повтор оплаты — новый заказ/платёж (у ЮKassa так).
- «Причина отказа банка не показывается (её показывает платёжка)»: ЮKassa T27 даёт магазину причину и таблицу советов, Baymard (пересказ) рекомендует сообщение + путь продолжения. Для случая, когда причину уже показала платёжная страница, **источников нет**: ни подтверждается, ни опровергается. Практика, которую находим, — «причина по возможности + следующее действие» (T27, пересказ поиска про Baymard/Amazon Pay).
- «При отказе возврат к подбору без статуса»: у Stripe отказ → тот же платёж, повтор (T23); ЮKassa → новый платёж (T27). Прямого источника, что можно вернуть без показа статуса, нет; но T29 предупреждает: на возврате нельзя решать «отказ/успех» по ссылке — сначала статус с сервера.
- «При истечении срока состояние «Время вышло», по «назад» возврат к подбору»: срок у ЮKassa задаёт провайдер («только за определенный срок», T25). МОЁ: наш таймер 09:45 и срок провайдера могут расходиться; кто главный — вопрос разработчику (6.5).

### 6.5. Вопросы разработчику (не гадаю)

1. Как приложение узнаёт итог оплаты: уведомление, запрос статуса, оба? Что происходит, если пользователь вернулся раньше уведомления (T29)?
2. Какие статусы заказа хранит сервер и как они отображаются из статусов платёжки (в т.ч. отказ и истечение срока)?
3. Кто владеет сроком оплаты: наш таймер или срок платёжки; что происходит при их расхождении?
4. Приходит ли причина отказа; решено ли её не показывать; что видит пользователь, когда причину показала платёжная страница?
5. Повторная попытка: тот же заказ/платёж или новый (Stripe vs ЮKassa — разные модели)?
6. Закрыл вкладку/приложение во время оплаты — что остаётся в заказе и как вернуть пользователя?

### 6.6. Базовые состояния и состояния продукта: нужен ли отдельный список

- Подтверждено: в практике есть **общие списки** базовых состояний — «seven states» (T16: idle, loading, skeleton, populated, empty, error, success), «four states» (T20), чек-лист автора Хабра, который «лежит в моём телеграм-канале» (T14), шесть интерактивных состояний (T5, для элементов). Они используются как напоминание, не как артефакт проекта.
- Подтверждено: перед рисованием экранов определяют полный набор состояний (T16: «Before designing individual states, define the complete set of states…»).
- Не подтверждено: что список базовых состояний «выводится из сценария» — источников нет.
- МОЁ: отдельный чек-лист базовых состояний делать **не как артефакт**, а как проверка при заполнении матрицы (для каждого экрана: нужны ли загрузка/пусто/ошибка — решение «нет, потому что…» тоже фиксируется). Состояния продукта (статусы заказа, устройства) — отдельная короткая таблица «статус сущности → экран.состояние» (см. вывод п.5).

### 6.7. Итеративная проверка «матрица → правка флоу/экранов»

- Подтверждено: полнота таблицы — проверка перебором (С6); пропуски ловят при сборке путей (T10: «These paths help you catch gaps or edge cases early and make your flow more complete.»); состояния обычно вспоминают поздно (T9: «many product designers insert it as an afterthought»; T14: правки «Тут нужен лоадер» приходят после ревью).
- МОЁ: цикл «флоу → список экранов → матрица → для каждого пропуска правило 4 → правка флоу/экрана → повторная матрица» (≥2 прохода, остановка, когда пустых клеток нет и каждая клетка имеет основание). Как цикл в источниках не описан.

### 6.8. Что в схеме не подтверждается или противоречит источникам; что предложить

| Пункт схемы | Статус по источникам | Предложение (МОЁ) |
|---|---|---|
| 1. Флоу → черновой список экранов | противоречия нет; связь с T4 (флоу = типичный путь) | оставить |
| 2. Состояния у экрана, не у фичи; «откуда приходят» | подтверждено (T9, T11) для «состояния у экрана»; «откуда приходят», «Назад зависит от входа» — источников нет | оставить; «Назад» как поле на вход, пометить как решение автора |
| 3. Один статус — один экран | не противоречит; провайдеры ведут список статусов на сервере | добавить короткую таблицу «статус → экран.состояние» |
| Отказ и истёк срок = «Отменён» | совместимо с ЮKassa (T25); у Stripe иначе (T23) | в спецификации различить: итоговый статус заказа и причина (в модели, не обязательно на экране) |
| Не показывать причину отказа | нет источника на «платёжка показала сама»; общий тезис практики — причина + действие (T27, пересказ) | пометить как решение автора, вопрос разработчику (6.5, п.4) |
| Возврат к подбору без статуса при отказе | не подтверждено; риск при возврате — не судить по ссылке (T28, T29) | вопрос разработчику (6.5, п.1) |
| 4. Правила «экран или состояние» | есть косвенная опора (T11, T12, С7); правил про «свою цель/действия» и «нет во флоу» нет | оставить как эвристики автора, не подавать как отраслевой стандарт |
| 5. Карта экранов → экраны → спецификация; отдельная тех. карта не нужна | согласуется с разделом 5 (А, Б) и T1 (спецификация не всегда нужна) | оставить |
| 5. Чек-лист базовых состояний не обязателен | списки существуют в практике (T5, T14, T16, T20); «выводится из сценария» не подтверждено | использовать как проверку при заполнении, без отдельного артефакта |

### 6.9. Рекомендация одной строкой («делать так»)

**Матрица «экран × состояния» + таблица «статус заказа → экран.состояние»; итог оплаты считать по серверу (уведомление + запрос статуса), а не по возврату; правила «экран или состояние» подавать как эвристики автора; вопросы 6.5 отдать разработчику до сборки.**

### 6.10. Что не проверено

Бэкенд приложения и платёжка (какая именно) неизвестны; про Telegram Payments/платёжку проекта страниц не открывал (только Stripe и ЮKassa как примеры); Baymard, Alicea — только пересказы поисковика; Material 3, Apple HIG (про состояния экрана), NN/g о критериях «экран или состояние» — не найдено; Paystack и dev.to — блоги; точные тексты экранов и статусов нашего приложения в этом разделе не проверялись (журнал не перечитывал, решения автора взяты из присланного задания).
