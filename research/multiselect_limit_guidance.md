# Выбор нескольких вариантов с лимитом: что говорят источники (2026-11-04)

Готовит «Исследование» по задаче Ядрышка (ЖР §47 п. 3, §72; гипотеза 2 в `research/onboarding_hypotheses_v3.md`). Только текст; Figma не трогал. **Выбор автора (ЖР §73): вариант (а)** — остальные цели неактивны, выбранную можно снять, при попытке выбрать сверх лимита пользователю сообщают, что для новой цели нужно снять любую из выбранных (текст подсказки определится позже). Основание автора: вариант контролируемее. Варианты (б), (в) и A/B не используются; документ оставлен как справка.

**Коротко.** Исследовательской статьи (NN/g, Baymard, Smashing, UX Collective, UX Stack Exchange), которая сравнивала бы варианты поведения при лимите («остальные неактивны» / «заменить последнюю» / «не ограничивать»), я не нашёл. Нашёл: два текста design-систем и примеров, прямо описывающие вариант (а); одну ветку форума, где упомянут вариант (б) и назван менее предпочтительным; один рабочий тикет Викимедии, где обсуждают вариант (в); общие правила NN/g про неактивные элементы. Прямых рекомендаций для (б) и (в) в источниках нет.

**Как читать пометки.**
- «Проверено на странице» — страницу открыл, цитата выдана инструментом WebFetch (малая модель), дословность глазами с оригиналом не сверена.
- «Не проверено» — страницу не удалось прочитать или поиск не вернул её текст; ничего из неё не приписываю.
- Перевод и пересказ пометил; цитаты на языке оригинала.

## 1. Что взято из гипотезы 2 и решений автора

- Гипотеза 2 (открыта): «Если пользователю понятно, сколько целей можно выбрать и сколько уже было выбрано, то после достижения лимита он реже попытается выбрать сверх него, потому что видит свой выбор». Решения: счётчик выбранных целей; после трёх остальные чипы неактивны, выбранную цель можно снять. Метрика: нажатия на неактивные цели на пользователя.
- ЖР §47 п. 3: решение про три цели не принято; автор склоняется к варианту «нажатие на другую цель заменяет последнюю», возможно A/B; сначала изучит конкурентов.
- Варианты для сравнения: (а) остальные чипы неактивны, выбранные можно снять; (б) нажатие на другую цель заменяет последнюю; (в) не ограничивать, предупреждать (меняет решение «максимум 3»).

## 2. Источники

### 2.1. Прямо про лимит выбора

**shadcn/ui, пример «Combobox with max selections limit».** https://www.shadcn.io/examples/ark/combobox-with-max-selections-limit — **проверено на странице.**
- Счётчик: «The button starts on Select interests... and then counts against the cap, as in 1/3 selected.»
- Неактивные: «At three picks, the other rows are disabled and a note says Maximum 3 selections reached.» и «When the cap is reached, every row that isn't picked is disabled.»
- Возврат: «The disabled rows come back as soon as the count drops below three.»
- Когда жёсткий лимит: «Use it where a hard limit applies, such as a plan limit or a top-three choice.»
- Замечание: это документация примера компонента, не исследование пользователей.

**Proximus Design System, Checkboxes (раздел States).** https://designsystem.proximus.com/pagesDS/21__Forms/Checkboxes/ — **проверено на странице.**
- «When maximum number of checkboxes to select is reached by the user, do set the others checkboxes on disabled state.»
- «When maximum number of checkboxes to select is reached by the user, don't set the others checkboxes on error state.»
- Замечание: правило design-системы телеком-компании; обоснования и данных проверки на странице нет.

**Adobe Experience League Community, «Forms - selecting a limited number of options».** https://experienceleaguecommunities.adobe.com/adobe-marketo-engage-general-27/forms-selecting-a-limited-number-of-options-196103 — **проверено на странице.**
- Вариант (а): автор принятого решения SanfordWhiteman называет его менее неожиданным: «[a] is less surprising behavior IMO.» и «(Recommendation: you disable the remaining checkboxes then they have reached their max.)»
- Вариант (б) упомянут в том же посте как альтернатива: «let them keep re-selecting past 3 and automatically unselect the -- first? last? -- one they checked.» Какую именно заменять, в посте не определено.
- Замечание: мнение одного ответившего на форуме, не исследование.

**Qualtrics Community, «Gray out after multiple select limit reached?».** https://community.qualtrics.com/survey-platform-54/gray-out-after-multiple-select-limit-reached-26733 — **проверено на странице.**
- Автор вопроса: «After a user selects 3 choices, I want to gray out the other choices.» и «they have to go to the next page button before it tells them their limit is reached, and it's a poor experience.»
- Принятый ответ не делает неактивными, а показывает предупреждение и снимает лишние выборы; второй ответ делает неактивными оставшиеся чекбоксы (код `cbs.not(":checked").prop("disabled",true);`).
- Замечание: это жалоба одного пользователя форума, не исследование.

**Wikimedia Phabricator T432811 (онбординг: выбор интересов).** https://phabricator.wikimedia.org/T432811 — **проверено на странице.**
- «during account setup we capped at 3 and we're thinking about inline validation.» (AAlhazwani-WMF, 27 июля 2026)
- «Let's limit errors and warnings as much as possible.» и предложение «users can continue to add up to 10 interests (or whatever limit engineers think we need to set)». (KStoller-WMF, 27 июля 2026)
- «i'd wait on the final eng recommendation to set the final design.» (AAlhazwani-WMF, 28 июля 2026)
- Замечание: рабочий тикет, итоговое решение на странице не записано. Годится как пример обсуждения варианта (в) в онбординге, не как рекомендация.

**Setproduct, «Checkbox UI design».** https://www.setproduct.com/blog/checkbox-ui-design — **проверено на странице.**
- «Determine the optimal number of checkboxes that users should reasonably select», «clearly mention any restrictions upfront», «Set appropriate constraints on the number of checkboxes selection to prevent decision fatigue.»
- Замечание: блог студии; про превышение лимита страница ничего не говорит (инструмент: «does not describe feedback for exceeding a selection limit»).

### 2.2. Общие правила, к которым можно приложить вариант (а)

**NN/g, Dropdowns: Design Guidelines.** https://www.nngroup.com/articles/drop-down-menus/ — **проверено на странице.**
- «Gray out any unavailable options instead of removing them: any items that cannot be selected should remain in view.»
- «consider showing a short balloon help message if users hover over a grayed-out option for more than a second, explaining why that option is disabled and how to make it active.»
- Замечание: сказано про выпадающие меню, не про чипы и не про лимит выбора; перенос на чипы мой.

**NN/g, Button States: Communicate Interaction.** https://www.nngroup.com/articles/button-states-communicate-interaction/ — **проверено на странице.**
- «This state indicates that the button's action is unavailable»; «When a user clicks the disabled button, nothing happens, as it's unavailable.»
- «you don't want the contrast to be as high as to trick people into thinking the button is clickable.»; «it's a good idea to test them with real users to make sure they are usable and visually distinct.»
- Страница, по инструменту, не объясняет, нужно ли пояснять причину неактивности.
- Замечание: про кнопки; перенос на чипы мой.

**NN/g, User Control and Freedom (heuristic 3).** https://www.nngroup.com/articles/user-control-and-freedom/ — **проверено на странице.**
- «Users should be able to quickly correct mistakes or backtrack on choices made.» и «Conversely, when the UI doesn't support these actions, users feel trapped and typically report dissatisfaction.»
- Замечание: общий принцип; про лимиты выбора не написано. Можно соотнести с возможностью снять выбранную цель в варианте (а).

### 2.3. Источники из списка, где подходящего не нашёл

| Источник | Что сделал | Результат | Пометка |
|---|---|---|---|
| NN/g | поиск по сайту, 4 страницы выше | статьи про лимит выбора нет | проверено на странице (что нет — по поиску и выбранным страницам) |
| Baymard Institute | поиск по сайту | результаты про фильтры: множественный выбор нужен; про лимит и неактивные варианты ничего | не проверено (страницы не открывал) |
| Smashing Magazine, UX Collective | общий поиск | не вернул страниц этих сайтов | не проверено |
| UX Stack Exchange | поиск с фильтром по домену | результатов нет | не проверено |
| GOV.UK Design System | страница Checkboxes | про лимит выбора, неактивные чекбоксы и ошибки при превышении — «Not covered»; есть только подсказка «Select all that apply» и ошибка при сочетании «none» с другим вариантом | проверено на странице |
| Material Design 3 (chips, selection) | открыл страницы | текста в ответе нет, только заголовок | не проверено |
| Apple HIG | поиск по developer.apple.com | про лимит выбора ничего | не проверено |
| Carbon Design System | поиск | у Carbon React MultiSelect в найденных описаниях нет свойства лимита | не проверено (страницу Carbon про multiselect не открывал) |
| Atlassian Design System | поиск и открытие страницы Checkbox select | в описании лимита нет; страница в ответе пуста | не проверено |

## 3. Сравнение вариантов поведения при лимите

| Вариант | Что говорят источники | Чего источники не говорят |
|---|---|---|
| (а) остальные неактивны, выбранные можно снять | shadcn/ui: неактивные строки, счётчик, пояснение «Maximum 3 selections reached», возврат при снятии. Proximus: «do set the others checkboxes on disabled state», не ошибкой. Adobe: «less surprising behavior». NN/g (меню): «Gray out any unavailable options instead of removing them». NN/g (общее): возможность вернуть выбор | Данных о том, понимают ли пользователи причину неактивности чипов, в источниках нет. Для чипов на мобильном правил нет |
| (б) нажатие на другую цель заменяет последнюю | Adobe: упомянут как альтернатива, какую заменять («first? last?») не определено; автор принятого решения предпочёл (а). Qualtrics: принятый ответ снимает лишние выборы и показывает предупреждение (близко к (б), но не то же) | Рекомендаций в пользу (б) и проверок нет. Источники не описывают, как показать пользователю, что одна цель заменилась |
| (в) не ограничивать, предупреждать | Викимедия: обсуждали разрешить до 10 при «limit errors and warnings as much as possible», решение на странице не записано. Qualtrics: жалоба на то, что лимит выясняется только на следующем шаге | Рекомендаций в пользу (в) нет. Setproduct общего вида: «Set appropriate constraints ... to prevent decision fatigue» (в пользу какого-то лимита) |

**Что применимо к экрану выбора целей онбординга (мой вывод, не цитата).**
- Единственный вариант с прямой поддержкой в документации — (а). Он совпадает с текущим решением гипотезы 2. Из источников к нему добавляется пояснение у лимита («Maximum 3 selections reached», счётчик «1/3»): у нас счётчик уже входит в гипотезу.
- Для (б) готовых практик в источниках нет; единственный упомянутый довод (Adobe) против. Выбор (б) придётся проверять самим, как автор и предполагал (A/B, ЖР §47 п. 3).
- (в) меняет решение «максимум 3» и метрику гипотезы 2 (нажатия на неактивные цели). Пример Викимедии показывает, что такой вариант обсуждают в онбординге, но исхода там нет.

## 4. Варианты для автора (выбор за автором)

1. **(а) + пояснение у лимита.** После третьей цели остальные неактивны, выбранные можно снять, рядом счётчик и короткое пояснение. Опора: shadcn/ui, Proximus, Adobe, NN/g (меню). Риск: чип без пояснения может выглядеть сломанным; данных по чипам на мобильном в источниках нет.
2. **(б) замена последней, проверка A/B.** Ничем не подкреплён в источниках; вывод об удобстве можно получить только своим тестом. Что именно считать «последней» (последнюю выбранную или первую), источники не решают (Adobe: «first? last?»). Решение за автором и разработкой теста.
3. **(в) мягкий лимит.** Лимит не блокирует, при превышении предупреждение. Меняет решение «максимум 3», формулировку и метрику гипотезы 2. Опора слабая: тикет Викимедии без итога.

## 5. Что не проверено

- Цитаты выданы WebFetch (малой моделью); с оригиналом глазами не сверял. Последняя цитата Setproduct выдана инструментом с оговоркой в написании («checkboxes selection» против «checkbox selections»); в тексте оставлена форма из выдачи.
- Material Design, Apple HIG, Carbon, Atlassian, Baymard, Smashing, UX Collective, UX Stack Exchange: текста по теме не получил (см. таблицу 2.3).
- Мой вывод в разделе 3 про перенос правил для меню, кнопок и чекбоксов на чипы не проверен ни на пользователях, ни источниками.
- Данных о том, как пользователи реагируют на (а), (б), (в), в найденных источниках нет.
