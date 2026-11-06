# Названия артефактов после флоу: справочник по источникам (2026-11-06)

Готовит «Исследование» по задаче автора (через Ядрышка). Только отчёт: ничего не переименовывал, журнал и Figma не трогал. Цитаты получены инструментом чтения страниц (малая модель): страница открыта, цитата выдана инструментом, дословность символ в символ не гарантируется. «Предложение» = моё, не из источников. Пишу «пользователь».

## Вывод (кратко)

1. **Устоявшихся имён для наших А, Б, В нет.** Каждое имя из источников закрывает кусок: «screen map / карта экранов» — экраны и связи без состояний; «wireflow» — экраны-макеты со стрелками; «design / prototype specification» — документ для разработки; «state matrix» — таблица состояний (только вендорский глоссарий).
2. **Б = wireflow** — самый авторитетный и точный термин (NN/g: «a design-specification format that combines wireframe-style page layout designs» с «flowchart-like way of representing interactions»); готовые макеты вместо каркасов русский источник называет «UI Flow» (vc.ru).
3. **В = «спецификация»** (IxDF «design specifications», NN/g «prototype specifications»); у NN/g сам wireflow называется форматом спецификации, поэтому Б и В частично один документ, различает их только наполнение (тексты, критерии приёмки).
4. **А = точного термина нет.** Ближайшие: «screen map / карта экранов» (DTF, архивная документация Android) — без состояний; «screen inventory (and sometimes states)» — список, не карта; «state matrix» — таблица. «Карта экранов с состояниями» — наша сборка из двух, **предложение**.
5. **Опасная путаница на собеседовании:** в Figma «flow» — это «collection of connected frames» (прототип), а наш «флоу» — путь пользователя; и мы сами используем «карта экранов» для А и для «карты с макетами» (Б).
6. **Расхождения в репозитории:** «карта экранов» назначена и А, и Б (PROCESS_GUIDE, шаг 6); «матрица» — в названии скилла и критериев; «тех. карта» осталась в журнале (§33, §117–§119), 30 файлах и Figma (8056:864, `tm/`); имена в Figma (8177:1789, `tm/`) не проверялись (раздел 5).

---

## Итог выбора автора (ЖР §131, 2026-11-06)

| Артефакт | Название у нас | Опора в источниках | Статус опоры |
|---|---|---|---|
| А. Колонки-экраны с состояниями, макетов нет | **карта состояний экранов** | точного термина нет; собрано из screen map / «карта экранов» (DTF, Android) и state matrix (Docsie) | наше имя, не термин из источников |
| Б. Макеты в ряд со стрелками-действиями, все состояния | **wireflow** | NN/g «Wireflows»: «a design-specification format that combines wireframe-style page layout designs» с «a simplified flowchart-like way of representing interactions» | термин подтверждён |
| В. Для разработчиков | **спецификация экранов** (автор не менял) | IxDF «Design Specifications»: «tend to consist of a minimum of annotated page or UI or component wireframes» | термин подтверждён |

«Карта экранов» больше не название ни А, ни Б. Замечание: у NN/g wireflow сам назван форматом спецификации, поэтому Б и В частично один документ; у Figma «flow» — другое («collection of connected frames»); наш «флоу» — user flow.

## 1. Что называем (описание, не названия)

- **А.** Колонки-экраны, под каждым все его состояния (что видит, куда ведёт, готов ли макет), основной путь стрелками между колонками. Макетов ещё нет.
- **Б.** Настоящие макеты экранов в ряд со стрелками-действиями, все состояния.
- **В.** То же для разработчиков: состояния, ошибки, переходы, тексты, критерии приёмки.

## 2. Термины → кто говорит → что это → чем подтверждено

Колонка «Определяет»: А / Б / В / нет (термин не определяет эти артефакты).

| Термин | Источник и URL | Дословная цитата (что определяет термин) | Определяет |
|---|---|---|---|
| **wireflow** | NN/g, Laubheimer, «Wireflows» — https://www.nngroup.com/articles/wireflows/ | «a design-specification format that combines wireframe-style page layout designs» с «a simplified flowchart-like way of representing interactions»; блок-схемы «lack the page context»; «they don't describe interaction well» (про каркасы) | **Б** (макеты + стрелки); частично В (NN/g называет его форматом спецификации) |
| wireflow (ещё) | Balsamiq, «Wireflows» (раннее чтение, `tech_map_form.md`, Е2); Uxcel — https://uxcel.com/glossary/wireflows | Uxcel: «Wireflows are diagrams that merge wireframes with flowcharts», «illustrating both the content of screens and the connections between them»; Balsamiq: «Focus on the screens where something in the interface changes» | Б; Balsamiq-совет о фокусе на изменяющихся экранах — близок к А |
| **UI flow** | vc.ru, «User Flow: всё, что нужно знать» — https://vc.ru/design/2860016-user-flow-v-ux-dizajne | «Wireflow — это гибрид User Flow и Wireframe.»; «UI Flow — это Wireflow с детализированными макетами (high-fidelity).»; автор пишет, что «существенной разницы между UI Flow и Wireflow нет» (пересказ инструмента); о состояниях статья не говорит | **Б** (готовые макеты); русский источник |
| **user flow** | NN/g, «User Journeys vs. User Flows» — https://www.nngroup.com/articles/user-journeys-vs-user-flows/ | «A set of interactions that describe the typical or ideal set of steps needed to accomplish a common task.»; wireflows «document the ideal or typical pathway through screens or pages» | нет (это наш **флоу**, не А/Б/В) |
| user flow (ещё) | Uxcel — https://uxcel.com/glossary/user-flow; Skillbox — https://skillbox.ru/media/design/user-flow-basics/ | Uxcel: «A user flow is a diagram that represents the path a user takes through a product to complete a specific task.»; «It shows each screen or state the user encounters, the actions they can take»; Skillbox: синонимы «user flow chart, user flow diagram, user interface flow, task flow diagram, UX flow, interaction flow», схема показывает экран, условия и действия (слова «состояния» нет) | нет (флоу); Uxcel допускает «экран или состояние» как узел |
| **screen map / карта экранов** | Android Developers (архивная копия), «Screen Planning» — https://stuff.mit.edu/afs/sipb.mit.edu/project/android/docs/training/design-navigation/screen-planning.html; DTF — https://dtf.ru/18185-karta-ekranov-v-razrabotke-igrovogo-interfeysa | Android: «a screen map, which shows all of your screens and their relationships»; «an arrow from one screen A to another screen B implies that screen B should be directly reachable»; DTF: «Карта экранов — это схематичное отображение всех экранов проекта и связей между ними.»; минусы: «Составление и поддержание карты в актуальном виде требует дополнительного времени и усилий», «При работе с особо большими проектами карта экранов становится громоздкой и теряет в эффективности». Пересказ DTF: на карте отмечают, какие экраны готовы, пометки и стикеры; очевидные переходы вроде «назад» не рисуют. О состояниях экрана ни Android, ни DTF не говорят | **А частично** (экраны и связи, без состояний); при готовых экранах — и Б (форма та же) |
| **screen flow diagram** | Creately — https://creately.com/guides/what-is-a-screen-flow-diagram/; RapidNative — https://www.rapidnative.com/blogs/screen-flow-diagrams | Creately: «A screen flow diagram is a visual representation that outlines how users navigate through different screens.»; в его таблице у screen flow фокус «The arrangement and transition of physical screens», визуал — «high-level placeholders or screenshots»; wireflow — «A combination of wireframes and flowchart logic»; RapidNative: «A screen flow diagram is a visual map of the screens, interactions, and decision points in a digital product.»; советует аннотировать стрелки и вести состояния loading, empty, error, success, abandon (пересказ). Вендорские блоги | А/Б (по наполнению: заглушки или скриншоты); «screen map» и «app map» RapidNative не определяет |
| **app map** | поиск: отдельного определения не нашёл | — | нет (**«нет»**) |
| **site map** | NN/g, «Information Architecture: Sitemaps» — https://www.nngroup.com/articles/information-architecture-sitemaps/ | «A sitemap is a visual representation of the organization of your site's content.»; «A sitemap is only one part of the site's information architecture.»; «The IA is an abstraction, while the sitemap is an artifact.» (пересказ) | **нет** (иерархия контента, не экраны с состояниями) |
| **screen inventory** | Cursa (учебная страница, авторитет низкий) — https://cursa.app/en/page/information-architecture-and-screen-inventory | «A screen inventory is a structured list of all screens (and sometimes states) your app will include»; «Turn each node in your sitemap into a row in your inventory.» | **А частично** (список экранов и иногда состояний, не карта со стрелками) |
| **state matrix** | Docsie, глоссарий «UI states» (вендор) — https://www.docsie.io/blog/glossary/ui-states/ | UI states — «The visual conditions and configurations of a user interface at specific moments»; «Create a comprehensive state matrix documenting every state variation, the conditions that trigger each state» и «the user actions available in each state»; «Share this matrix with development and QA teams.» | **А/В** (таблица состояний для разработчика); авторитет низкий |
| **state table (From State / Input / To State)** | freeCodeCamp, V. Shao — https://www.freecodecamp.org/news/designing-ui-states-and-communicate-with-developers-effectively-by-fsm-fb420ca53215/ | «State is in fact the output of a UI component after receiving an input.»; «There are three columns in the table: From State, Input, and To State.»; «most developers would be glad to receive this table.» | **В** для компонента (не экрана); блог |
| **UI stack / UI states экрана** | Hurff, «How to fix a bad user interface» (раннее чтение, `tech_map_form.md`, С8) и UI/UX Atlas — https://uiux-atlas.pages.dev/lessons/interaction-design/system-states-loading-skeleton-empty-error-and-success | Hurff: «Every screen you interact with in a digital product has multiple personalities.»; Atlas: «Before designing individual states, define the complete set of states your component or screen can be in.» | **А** по смыслу (состояния принадлежат экрану), без названия артефакта |
| **wireframe для каждого состояния** | IxDF, «Wireframe» — https://ixdf.org/literature/topics/wireframe | «Wireframes are basic visual representations of a user interface that outline the structure and layout of a webpage or app.»; «Annotations: These are notes that explain the functionality, behavior, or rationale behind certain design decisions.»; совет проектировать «one wireframe for each unique screen or significant state» | **Б** (макет на каждое состояние) |
| **design specification** | IxDF — https://ixdf.org/literature/topics/design-specifications | «Design specifications are detailed documents that outline essential requirements, constraints and specifications» «for products to adhere to.»; в UX они «tend to consist of a minimum of annotated page or UI or component wireframes», плюс user interaction flows и sitemap | **В** (и Б с аннотациями) |
| **prototype specification** | NN/g — https://www.nngroup.com/articles/prototype-specifications/ | «are a few lines of text written next to a prototype and describing details that may be ambiguous in the design»; примеры содержимого: «Different states of UI components», «The user flow for complex interactions»; «the context of your project and team determines whether you should include specification in your project.» | **В** (лёгкая форма) |
| **handoff / передача разработчику** | Figma, «Guide to developer handoff» — https://www.figma.com/best-practices/guide-to-developer-handoff/; текст UXPin-чеклиста, присланный автором (страница не открывалась) | Figma: «the component name, description, usage instructions, variants, and states all exist.»; чеклист: «Prototypes account for all interaction states, error states, and transitions between states.»; «Annotate prototypes with use cases, failure states, and interaction nuances.»; «Acceptance testing includes UX criteria based on the final prototype.» | **В** (состав: все состояния, переходы, аннотации, критерии приёмки) |
| **flow (Figma)** | Figma Help, «Create and manage prototype flows» — https://help.figma.com/hc/en-us/articles/360039823894 | «A flow is a collection of connected frames that make up a single prototype experience.»; «A flow starting point is where the flow begins.» | **нет** (инструмент прототипа; **не** наш «флоу»; конфликт имён) |

## 3. Что открылось, что нет

Открыто с цитатами: NN/g (wireflows, user flows, prototype specifications, sitemaps), IxDF (design specifications, wireframe; страница «user flow» определения не дала), Figma (Help про flows, Guide to developer handoff), Android Developers (архив), DTF, vc.ru, Skillbox, Uxcel, Creately, RapidNative, Cursa, Docsie, freeCodeCamp, UI/UX Atlas; раньше — Balsamiq, Hurff, NN/g «UX mapping»; текст UXPin-чеклиста от автора.

**Не открылось или определения нет:** Material Design 3 и Apple HIG (страницы вернули только заголовок); Atlassian (нашлись только страница о дизайн-системе и сторонний плагин Confluence, определений нет); Smashing Magazine (статьи не нашёл); UX Collective (403); Habr/Contented — прямых статей про «карту состояний» и «спецификацию экрана» не нашёл (Habr-статьи про состояния экрана открывал раньше: слово «спецификация экрана» они не определяют); IxDF «wireflow» — страницы нет. **Термины «state map», «UI states» как названия артефакта, «screen specification», «flow with states» в авторитетных источниках не подтвердил.** Если у автора есть тексты Material, Apple HIG, Atlassian — пришлёт, добавлю.

## 4. Как «карта экранов» (DTF) соотносится с А и Б

- Определение DTF и Android («все экраны и связи между ними») описывает **форму** — экраны-узлы, стрелки-переходы. Форма одна и та же у А, у Б и у карты из скриншотов.
- Различие А и Б — не в форме, а в **наполнении** узлов: у А узел — экран с карточками состояний, макета нет; у Б — готовый макет (Creately: «placeholders or screenshots»; vc.ru: «UI Flow»).
- DTF говорит о готовности экранов (пересказ) и пометках, но не о состояниях внутри экрана: **состояния — наше добавление**. Поэтому «карта экранов» из DTF покрывает **А частично** (без состояний) и **Б при готовых макетах**; полностью ни то, ни другое.
- Вывод: «карта экранов» — родовое имя формы, не имя артефакта; называть им и А, и Б нельзя без уточнения (в репозитории так и сделано, раздел 5).

## 5. Варианты названий (предложение, не из источников)

Устоявшегося названия нет — прямо: **«нет»** для А; для Б и В есть термины с оговорками.

**А (колонки-экраны + состояния, без макетов)**
1. «Карта экранов с состояниями» (screen map with states). Плюс: русский источник (DTF) + английский (Android «screen map»); без «матрицы» понятно. Минус: «с состояниями» — наше добавление, термином не является.
2. «Матрица состояний экранов» (state matrix). Плюс: термин встречается (Docsie); минус: вендорский глоссарий, у нас не матрица, а колонки с карточками.
3. «Инвентарь экранов и состояний» (screen inventory). Плюс: определён («list of all screens (and sometimes states)»); минус: список, не карта со стрелками; источник — учебная страница.

**Б (макеты в ряд со стрелками, все состояния)**
1. «Wireflow» (NN/g). Плюс: самый авторитетный; минус: у NN/g это каркасы, а у нас готовые макеты.
2. «UI flow» (vc.ru: wireflow с детализированными макетами). Плюс: точно по содержанию; минус: редкий, сам источник говорит, что разницы с wireflow нет.
3. «Карта экранов с макетами» (screen flow diagram со скриншотами, Creately). Плюс: понятно по-русски; минус: путает с А.

**В (для разработчиков)**
1. «Спецификация экранов» (design specification, IxDF). Плюс: определён состав (аннотированные макеты + флоу); минус: общее слово.
2. «Prototype specification» (NN/g). Плюс: авторитет; минус: у NN/g это короткие заметки рядом с прототипом.
3. «Handoff-документация». Плюс: устойчивый термин у Figma и в чеклистах; минус: про процесс передачи, не про документ.

## 6. Рекомендация автору (предложение, не из источников)

Для собеседования и подкрепления одной ссылкой: **А — «карта экранов с состояниями»** (термин «screen map»; ссылка: DTF «Карта экранов…» либо Android «Screen Planning»; у нас: колонки-экраны с карточками состояний до макетов); **Б — «wireflow»** (ссылка: NN/g «Wireflows»; у нас: макеты экранов во всех состояниях со стрелками-действиями; если спросят про готовый дизайн — «UI flow», vc.ru); **В — «спецификация экранов»** (термин «design specification»; ссылка: IxDF «Design Specifications»; у нас: Б плюс тексты, ошибки, переходы, критерии приёмки; состав подкрепляет чеклист передачи Figma/UXPin). Честно говорить: названий именно для А «с состояниями» в источниках нет, это сборка из screen map и state matrix; а слово «флоу» у нас — user flow по NN/g, не «flow» из Figma.

## 7. Где в репозитории названия расходятся (состояние на момент отчёта; после ЖР §131 приведены PROCESS_GUIDE, PROCESS_BRIEF, критерии, скилл `state-matrix-from-flow`, `flow-from-data`, `screen_map_*`, `tech_map_form`, `tech_map_validity`)

| Место | Что написано | Расхождение |
|---|---|---|
| `PROCESS_GUIDE.md`, шаг 5 (строка 42) и примечание «Заменено §124» (строка 51) | «Карта экранов (матрица «экран × состояния»)» | А назван и «картой экранов», и «матрицей» |
| `PROCESS_GUIDE.md`, шаг 6 | «карта экранов с экранами во всех состояниях / с макетами» | **то же слово «карта экранов» для Б**, что и для А (шаг 5) |
| `PROCESS_GUIDE.md`, шаг 8 | «спецификация экранов» | В; согласуется с IxDF |
| `PROCESS_GUIDE.md`, строка 33 | «карта экранов (состояния)» (после §124 заменено «тех. карта») | А; «тех. карта» убрана |
| `PROCESS_BRIEF.md`, строка 7 | «карта экранов (матрица «экран × состояния»)», «передача = спецификация экранов» | то же двойное имя А |
| `research/state_matrix_criteria.md`, заголовок | «Матрица состояний («Карта экранов»)» | в заголовке два имени для А |
| Скилл `state-matrix-from-flow`, имя и описание | «матрицу «экран × состояния» (карту экранов)» | в имени «matrix», в тексте «карта экранов» |
| Скилл `flow-from-data` (SKILL.md) | «карта экранов (матрица «экран × состояния», ЖР §124)» | то же |
| Файлы `research/screen_map_cards_clean.md`, `screen_map_pilot_onboarding.md` | «screen map» в имени, «карта экранов», «матрица» в тексте | английское имя файла — screen map (без «state»), содержимое — со состояниями |
| `research/tech_map_form.md`, `tech_map_validity.md`, `tech_map_template_dump.md` | «тех. карта» (с пометкой «заменено процессом §124») | старое имя А |
| `CASE_DECISION_LOG.md`: §33 (тех. карта состояний), §117–§119 (вид тех. карты), §124 (процесс после флоу), §125–§130 (карта экранов), §126 (матрица) | три имени подряд: «тех. карта» → «матрица» → «карта экранов» | история имён не сведена в одном месте |
| `research/flow_principles_and_audit.md` (Ф11, Ф15 и др.), `flows_redo_second_designer.md`, `flow_audit_2.md` и ещё около 25 файлов | «тех. карта» | старое имя; в критериях флоу ссылки на «тех. карту» не заменены на «карту экранов» |
| Figma 8056:864 «Схема · Тех. карта · Выпуск конфига после покупки · ред. 1» (карта второго дизайнера) | «Тех. карта» | старое имя у карты, которую мы взяли образцом |
| Figma: карта экранов онбординга 8165:1543 (принята автором, ЖР §126); фрейм 8177:1789; заглушки/блоки `tm/` (`tm/screen`, `tm/step`, `tm/link`, `tm/title`, `tm/lane`, `tm/map`, ЖР §119) | имена в Figma я не читал (правило: читает Дизайн) | **не проверено**: нужен список имён от Дизайна; блоки `tm/` названы по «тех. карте» |
| «флоу» и Figma «flow» | наш «флоу» (user flow, NN/g) ↔ Figma «flow» = «collection of connected frames» | один корень слова, разные вещи; риск на собеседовании |

## 8. Что не проверено

Material 3, Apple HIG, Atlassian, Smashing, UX Collective, Habr/Contented по терминам А/Б/В; «state map» как название; цитаты читал инструментом, не по оригиналу; Cursa, Docsie, Creately, RapidNative, Uxcel, freeCodeCamp — вендорские или учебные страницы, авторитет ниже NN/g, IxDF, Figma; DTF — игровая индустрия; архив Android-документации устарел (скопирован старой версии); имена в Figma не читал.
