# Шаблон оформления тех. карты (read-only дамп, 2026-11-06)

Источник: файл 5ks9FYkDbV4fcg60G4SLjf, узел 8138:44198 (GROUP «Group 1», 3930×2352, на холсте x=45445, y=-1900; страницу не определял). Пояснение автора: «по автолейаутам типа так быстрее типовые блоки собирать, оценить». Ничего не менялось, только чтение через Plugin API (дерево до глубины 4–6, свойства инстансов, заливки/стили/переменные). Скриншот просмотрен.

## 1. Что это
Пример флоу экранов «Пополнение хранилища» (в чужом продукте: скины/предметы, шрифты Fira Sans + SF Pro Display, не BittVPN) в виде горизонтальной ленты: телефонные макеты (рамки 402×874) чередуются с текстовыми блоками-подписями шага. Не набор компонентов и не FigJam: это Figma Design, обычные фреймы с auto-layout + инстансы библиотечных компонентов. Коннекторов (CONNECTOR) нет: «стрелкой» служит текстовый блок-подпись с линией. Размер: 123 узла на глубину ≤4.

## 2. Дерево верхнего уровня (Group 1)
| Тип | Имя | id | x,y (внутри группы) | размер |
|---|---|---|---|---|
| FRAME | `t-winners \| large` (образец-«эталон» отдельно) | 8135:42457 | 882, 1478 (абс. x46327 y-422) | 402×874 |
| FRAME | `flow` | 8135:42496 | 0, 124 (абс. x45445 y-1776) | 3930×874 |
| GROUP | `plank` | 8135:42902 | 0, 0 | 3929.7×92 |
| FRAME | `text` (вертикальный вариант подписи) | 8135:42905 | 882, 998 | 402×480 |

## 3. Блок `flow` (8135:42496): лента шагов
Auto-layout H, gap 0, padding 0, primary hug-ish (AM), counter центр. 9 детей слева направо, подряд без зазоров:
x0 `t-profile | large | history` (402×874) → x402 `text` (480×754) → x882 `t-winners | large` → x1284 `text` (480×414) → x1764 `t-winners | large` → x2166 `text` (480×802) → x2646 `t-winners | large` → x3048 `text` (480×802) → x3528 `t-profile | large | history`.
Итого 5 экранов + 4 подписи. Экраны в flow: fillH=Fixed.

## 4. Типовой блок «экран» (`t-<тип> | large[ | вариант]`), 402×874
Имя экрана: `t-winners | large`, `t-profile | large | history` (префикс t- = тип экрана, large = размер устройства, третий сегмент = вариант/состояние). Рамка: fill нет, stroke #e9f0f3 @40% 1px, радиус 44, clip.
Слои внутри (порядок снизу вверх по дереву):
1. `screen` — FRAME 402×874, auto-layout H, gap 10, padding 59/20/34/20 (top/right/bottom/left), primary Fixed-Start, counter Fixed-Middle; заливка #0e1526 (стиль `bg/page`), радиус 44.
   - `safearea` — FRAME 370×781, красная заливка #ff0202 @10%, hidden, fill-width: подсказка безопасной зоны, скрыта.
   - `content` — FRAME auto-layout V, gap 24, padding top 61, fill-width/hug-height (362×525 у winners, 362×675 у profile). Внутри winners: `title` (V gap 4, 362×76: TEXT `title` + TEXT `subtitle`), `group cards` (H gap 8, 362×364, 9 карточек `itemCard`). Внутри profile: `profile data` → `avatar` 106 + `text` (name «Имя пользователя», id «ID: 4583110»); `data` → `balance` (title «Баланс» + `value` + button «Пополнить»), `settings` (exchange link field + 2 icnButton); `items ` → `tab` (3 мастер-вкладки «Инвентарь», «Хранилище», «История») + `group cards` (2 × `card history` 362×92).
2. `bezel` — FRAME 402×874, hidden; внутри RECTANGLE «iPhone 17 Pro - Deep Blue - Portrait» 450×920, заливка IMAGE (рамка телефона, по умолчанию выключена).
3. `header` — INSTANCE (set `header`, свойство `state=hide`), 402×92; внутри `blur layer` (fill #fff@0, BACKGROUND_BLUR 2, 402×108) и инстанс `Header TMA (iOS)` (set `Header old (iOS)`, `View=Header full screen (iOS)`; Content → Status Bar/iOS, Dynamic Island, Time «9:41», Header Contents → 2 × Button 83×32 / 81×32 из `.../master` fill #413f40@40%, radius 32, BACKGROUND_BLUR 10) — это хром Telegram/iOS, как в AGENTS.md в наш продукт его тащить нельзя.
4. `tabbar` — либо INSTANCE `tabbar` (set `tabbar`, 402×172, `type=button`, булевы: `show upperbar#22406:6=false`, `show vertical btn group#23002:0=false`, `isButtonOnly?#22034:0=true`, `isButtonGroup?#22034:5=false`, `show subtle#20081:0=true`), либо собственный FRAME `tabbar` 402×184 (V gap 16, внутри V gap 16 padding 20/20/32/20, fill #262c3b @30%, BACKGROUND_BLUR 22.4) с детьми `group button` (H gap 8, 302×52 `button` + 52×52 `icnButton`, hidden), `Frame…` (подпись «Как это работает?» 12/16 SF Pro, стиль `body/caption-link`, fill `text/secondary` #878b93; строка «Получишь на баланс» Fira Sans 16/20 `body/m` + value) и `wrapper` (362×72 → `button` 362×52, fill #55f0f4 `bg/action/accent/default`, radius 999).
5. `indicator` — INSTANCE (set `Home Indicator`, `Device=iPhone, Orientation=Portrait`, булево `Show Home Indicator#5707:0=true`), 402×34; внутри RECTANGLE 144×5 радиус 100, fill #fff (`icon/primary`).
6. Опционально поверх: `bottom sheet body` (INSTANCE, `type=default`, 402×874, clip): `overlay` RECTANGLE #000 @60% (`bg/overlay`), `wrapper` → `container` (V, padding top 12 / bottom 34, fill #1d2333 `bg/surface`, переменная maxHeight=`layout/dBottomSheet/maxHeight`; SLOT `bottomSheetKB slot` с контентом, `grabber` 402×24 → RECTANGLE 36×4 r6 `bg/action/neutral`), `HomeIndicator`. Или `toast` (INSTANCE `type=success`, 362×48, H gap 16 padding 12/16/12/16: иконка `icn_m_circle_success` 24 + TEXT `subtitle` «Предметы в хранилище, огоньки на балансе» + декор GROUP `visual affair accent` из 13 эллипсов).

Слоты экранов: заглушек нет — в `content` лежат реальные макеты (карточки `itemCard` = инстансы мастера `_/🔒 master card_item`, 114–116 px, fill #262c3b + линейный градиент, обводка #fff 1px, r12, эффект NOISE; кнопки, вкладки, карточки истории). Рамки телефона (bezel) выключены (hidden), отдельно лежит безэкранная заготовка `t-winners | large` 8135:42457 как образец типового блока.

## 5. Типовой блок «подпись шага» (`text`)
Горизонтальный (между экранами, 480×N): FRAME `text` auto-layout V, gap 32, padding 0, primary Fixed-Middle, counter Fixed-Center, fill-width/Fixed-height (высота = высоте контента: 754, 414, 802, 802 — подобрана вручную под положение текста). Внутри: FRAME `text` (V gap 16, 480×20, clip) → TEXT `label` (Fira Sans Regular 16/20, стиль `body/m`, fill `text/primary` #fff, выравнивание LEFT, ширина 320, fill-width) и VECTOR `line` (480×0, stroke #fff 3 px, fill-width) — горизонтальная «стрелка» под подписью. Стрелочных наконечников и коннекторов нет.
Вертикальный вариант (8135:42905, 402×480): FRAME `text` H gap 32, primary Fixed-Center: `wrapper` 201×480 (H gap 10 → VECTOR `line` 0×480, stroke #fff 3) + `text` 169×40 (V gap 16 → TEXT `label`, 169×40, те же стили). Стоит под лентой для экрана-«подшаблона» (bottom sheet).

## 6. Блок `plank` (8135:42902)
GROUP → FRAME `frame` 3929.7×92, auto-layout V gap 16, padding 32/60/32/60, центр; fill #0e1526 (`bg/page`), радиус 20, clip; внутри TEXT `title` Fira Sans SemiBold 20/28, стиль `title/medium`, fill `text/primary`, hug: «Пополнение хранилища». Заголовок всей карты, лежит над лентой, ширина = ширине ленты.

## 7. Стили и переменные
- Цвета-стили: `bg/page` #0e1526, `bg/surface` #1d2333, `bg/elevated` #303643, `bg/overlay` #000@60%, `bg/action/accent/default` #55f0f4, `bg/action/neutral` / `bg/action/neutral/default` #fff, `text/primary` #fff, `text/secondary` #878b93, `icon/primary` #fff; переменная цвета `Accent/Black` (Dynamic Island).
- Текстовые стили: `title/cp-large` (Fira Sans SemiBold 28/36), `title/medium` (20/28), `body/m` (Fira Sans Regular 16/20), `body/s` (SF Pro Display Regular 14/18), `body/caption-link` (SF Pro Display Regular 12/16). Переменные: `font`, `font size/title/large|medium`, `line height/title/large|medium`, `font size/body/small|medium|caption`, `line height/body/small|medium|caption`, `layout/dBottomSheet/maxHeight`, радиусы 6px.
- Другие инстансы: `button` `size=small, color=neutral, type=primary, state=default, form=circle`; `icnButton` `size=large, type=primary, color=neutral, state=default`; `exchange link field` `state=default` (`is detached?=true`); `_/🔒master tab` `state=default`.

## 8. Тексты на схеме дословно
- Заголовок плашки: «Пополнение хранилища».
- Подписи шагов (label): «Нажимает на добавить в хранилище», «Выбирает предметы», «Нажимает на продолжить», «Нажимает на подтвердить», вертикальная: «Нажимает на “Как это работает”».
- Тексты экранов: «Выбери предметы», «Открой кейс без пополнения баланса Получи до 50% за скин от $50», «Как это работает?», «Получишь на баланс», «Имя пользователя», «ID: 4583110», «Баланс», «Инвентарь», «История», «Предметы в хранилище, огоньки на балансе»; на скриншоте видны также «Пополнить», вкладка «Хранилище», «Добавить в хранилище», «Продолжить», «Подтвердить», «Понятно» (внутри инстансов, не читались построчно).

## 9. Что отсюда следует для оформления
Блоки «экран» и «подпись шага» — это пара повторяющихся единиц одной ширины 402+480 по горизонтали, собираются auto-layout H без зазоров; подпись одинарная (одна строка «Действует глагол + объект») и привязана к переходу линией, а не коннектором. Файл не содержит узлов-стрелок, ромбов, овалов: оформление флоу-схемы (FigJam) отсутствует.
