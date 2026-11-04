# Сценарии: другие источники, кроме Бирмана (2026-11-04)

Готовит «Исследование» по задаче Ядрышка. Только текст; Figma не трогал. Сравнение с Бирманом (`research/scenarios_birman_format.md`, `research/scenarios_birman_form.md`), шаблоном Б (ЖР §68) и чек-листом (`research/scenarios_check_criteria.md`) — в разделе 4; всё там — только предложения для автора.

**Как проверял.** Страницы скачал целиком (curl) и разобрал текст сам, поэтому цитаты **дословные из страницы**, не пересказ инструмента. «Проверено на странице» — страница открыта и цитата взята из её текста. «Не проверено» — страница не открылась или не прочитана. Цитаты на английском оставлены как в источнике (перевод мой, в скобках). «Пользователь», не «человек» (ЖР §60).

## 1. Источники

### 1.1. NN/g, «Turn User Goals into Task Scenarios for Usability Testing» (М. Маккласки, 12 января 2014)

https://www.nngroup.com/articles/task-scenarios-usability-testing/ — **проверено на странице**.

- **Что это.** Сценарий задачи для тестирования, не сценарий проектирования: «A task scenario is the action that you ask the participant to take on the tested interface.» (Сценарий задачи — действие, которое просят выполнить участника теста.)
- **Как записывается.** Одной короткой ситуацией и действием, текстом: «Rather than simply ordering test users to "do X" with no explanation, it's better to situate the request within a short scenario that sets the stage for the action and provides a bit of explanation and context for why the user is "doing X."»
- **Пример формы** (текст, одно-два предложения): «You're planning a vacation to New York City, March 3 − March 14. You need to buy both airfare and hotel. Go to the American Airlines site and jetBlue Airlines site and see who has the best deals.»
- **Правила, совпадающие с Бирманом:** «Task scenarios that include terms used in the interface also bias the users.» и пример: «Poor task: You want to see the results of your midterm exams. Go to the website, sign in, and tell me where you would click to get your transcript.» / «Better task: Look up the results of your midterm exams.»
- **Итоговый список:** «is realistic and typical for how people actually use the system when they are on their own time, doing their own activities», «encourages users to interact with the interface», «doesn’t give away the answer».
- **Важно:** это задача для теста, а не сценарий для проектирования; форма — текст из одного-двух предложений.

### 1.2. NN/g, «Scenario Mapping: Design Ideation Using Personas» (К. Флаэрти, 28 марта 2021)

https://www.nngroup.com/articles/scenario-mapping-personas/ — **проверено на странице**.

- **Что это.** «Scenarios used for ideation are brief stories about a person using your product or service to complete a specific task.» (Краткие истории о человеке, который пользуется продуктом, чтобы выполнить конкретную задачу.)
- **Структура.** «Scenarios are usually centered around one task that is key to your product and includes 5 elements: an actor, a motivator, an intention or intent, an action, a resolution» (актор, мотив, намерение, действие, результат).
- **Форма.** Связный текст, который затем разбирается на части: пример «Detailed Debbie is going on a business trip. She needs to book a hotel room that’s affordable and has good reviews. Debbie browses the site to find a hotel for her upcoming trip. She looks closely at the various hotels to find one that meets her needs. She considers price and user ratings heavily as she shops. Debbie selects a hotel and books a room.»; затем эти же пять элементов даны таблицей «Actor / Motivator / Intention / Action / Resolution». Для воркшопа сценарий режут на части: «break the rest of the scenario down into smaller parts across 4-6 sticky notes placing them horizontally across the wall».
- **Глубина:** «Keep scenarios high-level and avoid design specifics. Scenarios should inspire design ideas. Avoid injecting solutions too early».
- **Анти-пример источника:** «DON’T: Debbie goes to the Book a Hotel tab and uses the search bar to look for a hotel. She uses the left-side filter menu to filter the results.»
- **Отличие от Бирмана:** актор — персона («it’s best to use a specific persona as the actor»); Бирман персоны отвергает.

### 1.3. IxDF, «What are User Scenarios?» (обновлено 2026)

https://www.interaction-design.org/literature/topics/user-scenarios — **проверено на странице**.

- **Что это.** «User scenarios are detailed descriptions of a user – typically a persona – that describe realistic situations relevant to the design of a solution.»
- **Форма.** «Although usually textual, user scenarios paint a “rich picture” of important factors behind users’ needs and behaviors.» и «User scenarios are written as stories that are rich in detail. But be careful not to include too much in the way of extraneous information.»
- **Что описывать:** «For each scenario we need to describe not only the persona’s goal, but also the context in terms of the… Persona involved and their role (if relevant). Events leading up to the scenario, particularly those that created the need for this scenario to be realized. Environment in which the scenario is performed. Note that this is not only the physical environment, but also the social, legal and organizational environments.»
- **Расхождение с Бирманом:** на этой же странице в разделе вопросов: «In a technical document, explain user scenarios clearly by outlining the user's goals, actions, and the system's response. … Detail each step the user takes to accomplish the goal and note the system's interactions or responses at each stage.» (Бирман: реакции системы в сценарий не входят.) Различие с use case: «Use cases detail every alternative path… including all error conditions. User scenarios are not usually so detailed.»
- Образец-текст сценария на странице есть только в видео (в тексте страницы пример не приведён).

### 1.4. Digital.gov (правительство США), «User interactions» (метод «User scenarios»)

https://digital.gov/guides/research-collaboration/designing/user-interaction — **проверено на странице**. (Адрес usability.gov перенаправляет сюда.)

- **Что это.** «A user scenario tells a story about how users interact with your product, service, or website. User scenarios provide context for personas’ experience in a narrative form.»
- **Форма.** История со структурой: «Put the details you came up with in step 2 into a story format that includes: Who they are (persona or user type); Why they are using your site (motivations); Where they are (context); What they need to do (goal); How they go about accomplishing the goal (tasks)».
- **Отличие от флоу:** «A task flow analysis differs from a user scenario, which is a narrative story that provides context for a persona.»
- Примеров текста сценария на странице нет.

### 1.5. Cockburn, «Basic Use Case Template» (TR 96.03a, версия 2 от 26 октября 1998)

Копия документа: https://www.cs.helsinki.fi/u/mluukkai/ohmas09/usecase.pdf — **проверено на странице** (PDF прочитан). Страница alistair.cockburn.us по адресу, который я пробовал, вернула 404; сам первоисточник на сайте автора не открывал.

- **Что это.** Use case — не сценарий пользователя, а описание цели с шагами. Разделы шаблона: «name (which is the goal), goal in context, scope, level, trigger, pre- and postconditions, main course, extensions, sub-variations».
- **Форма.** Нумерованные шаги плюс ветки по номеру шага: «MAIN SUCCESS SCENARIO: <put here the steps of the scenario from trigger to goal delivery, and any cleanup after> <step #> <action description>» и «EXTENSIONS: <step altered> <condition> : <action or sub.use case>». Рядом: «Primary Actor», «Trigger», «Success End Condition», «Failed End Condition».
- **Пример из документа «Buy Goods»:** главный сценарий — семь нумерованных шагов («1. Buyer calls in with a purchase request. … 7. Buyers pays invoice.»), ветки «3a. Company is out of one of the ordered items: 3a1. Renegotiate order.», «7a. Buyer returns goods:», подвариации «7. Buyer may pay by cash or money order / check / credit card».
- **Связь с Бирманом.** Язык предметной области, без интерфейса — совпадает; форма (нумерация, ветки) — другая; сбои и исключения в записи есть (у Бирмана их нет).

### 1.6. Job stories (Intercom, Алан Клемент): Mountain Goat Software

https://www.mountaingoatsoftware.com/blog/job-stories-offer-a-viable-alternative-to-user-stories — **проверено на странице**. Оригиналы Intercom и Клемента открыть не удалось (страницы вернули 404 и не открылись), цитаты ниже — со страницы Mountain Goat, не первоисточника.

- **Что это.** «A job story is focused less on the user performing some function than on the job to be done by that story. Job stories originated at Intercom and were best explained by Alan Klement.»
- **Форма:** три части — «situation» (после «when»), «motivation» (после «I want to») и «expected outcome» (после «so I can»). Пример со страницы: «When it’s dinner time tonight, I want to have pizza so I can easily feed my friends.»
- **Что отличает от истории пользователя:** «Second, the job story is better because it provides more context about when this is happening.» и «Who is performing the action (the search in this case) is not important».
- **Связь с шаблоном Б:** «Когда [обстоятельство], пользователь хочет [задача], чтобы [результат]» — по форме то же самое: situation / motivation / outcome.

### 1.7. Netology (рус.): «Пользовательские сценарии: что это такое, как и для чего их нужно строить»

https://netology.ru/blog/users-scenarios — **проверено на странице** (эксперт Денис Нарижный, «Студия F1»).

- **Что это.** «Сценарии описывают пользовательские истории и взаимосвязи между ними.»
- **Форма:** «Единой формы для разработки пользовательских сценариев не существует. Поэтому итоговый результат может сильно отличаться.» и «Единого подхода к построению пользовательских сценариев нет. Можно использовать несколько инструментов: писать на бумажках и наклеивать их на стену или маркерную доску, заполнять ячейки в Excel или Google Таблицы, моделировать в Bizagi…»
- **Четыре группы по детализации:** пользовательские истории, концептуальные сценарии, конкретные сценарии, сценарии использования («Опишите пользовательский опыт по шагам: кто, каким образом и в какой последовательности делает»).
- Часть примеров — картинки (скринкасты, слайды), их текст не читается.

### 1.8. Patton, user story mapping — страница подкаста Mind the Product

https://mindtheproduct.com/getting-started-with-user-story-mapping-jeff-patton — **проверено на странице** (интервью, не книга). Страницы книги на O'Reilly вернули 403 (не открылись). 

- Дословно: «the idea of doing a left to right flow that tells a story of what your customers or users are doing with your product isn't a super new» (идея потока слева направо, рассказывающего, что делает пользователь, не нова — Паттон о происхождении карты историй).
- Форма карты — не сценарий, а выровненная по порядку шагов карта; прямых слов о форме записи сценария пользователя на странице я не нашёл.

### 1.9. Не открыл или не нашёл

| Источник | Что вышло |
|---|---|
| Алан Купер, «About Face» (контекстные и ключевые сценарии) | Книги в открытом доступе нет; поиск дал только конспекты и пересказы (одна страница конспекта не открылась из-за сетевых ограничений сессии). Утверждений о Купере в выводе нет. **Не проверено** |
| Intercom (оригинал о job stories), Алан Клемент | Страница Intercom вернула 404, страница jtbd.info не открылась. **Не проверено** |
| Боб Моеста (JTBD, «Demand-Side Sales») | Страницу автора с описанием формы записи сценария не нашёл. **Не проверено** |
| Лидия Яркова | Поиск материалов под этим именем ничего не дал. **Не найдено** |
| Cockburn, сайт alistair.cockburn.us | Страница вернула 404. Использована копия PDF с другого сайта (см. 1.5) |
| Patton, jpattonassociates.com, книга | 403 / не открылись. **Не проверено** |
| Другие русскоязычные авторы | Открыта только Netology; Unisender, Kokoc, Skyeng, Хабр — в прежнем отчёте `research/scenario_vs_flow.md` (там же цитаты); здесь заново не открывал |

## 2. Примеры: проверка на годность

Критерии автора: (а) формат близок к Бирману (язык задачи пользователя, без интерфейса); (б) показаны цель, триггер, шаги, развилки, результат; (в) источник открыт, не пересказ; (г) применим к приложению с оплатой и подключением.

### 2.1. Годные (с оговорками)

| Пример | (а) | (б) | (в) | (г) | Оговорка |
|---|---|---|---|---|---|
| NN/g «Detailed Debbie» (1.2), текст сценария бронирования отеля | да: нет интерфейса, язык задачи | цель, триггер («going on a business trip»), действия и результат есть; развилок нет | да | частично: бронирование есть, оплата подразумевается, подключения нет | Актор — персона; развилки отсутствуют |
| Cockburn «Buy Goods» (1.5) | язык задачи и предметной области, без интерфейса; форма — нумерованные шаги и ветки, не абзац | триггер, цель, шаги, развилки (extensions), результат (end condition) — все есть | да (PDF прочитан) | частично: оплата и возврат есть («Buyer pays invoice», «Buyer returns goods»), подключения нет | Форма не Бирмана; это use case |

### 2.2. Отброшено: 6

| Пример | Почему отброшен |
|---|---|
| NN/g «You're planning a vacation to New York City…» (1.1) | Это задача для теста, называет конкретные сайты («American Airlines site and jetBlue Airlines site»), нет развилок и результата. Не сценарий проектирования |
| NN/g «Look up the results of your midterm exams» (1.1) | Короткая тестовая задача, не сценарий: нет триггера, шагов, развилок |
| Mountain Goat «When an order is submitted, I want to see a warning message so I can avoid resubmitting the order.» (1.6) | Содержит элемент интерфейса («warning message»), нет шагов и развилок |
| Mountain Goat «When it’s dinner time tonight, I want to have pizza…» (1.6) | Одна фраза, нет шагов, развилок, оплаты и подключения; годен как образец формата «когда-хочу-чтобы», не как сценарий |
| Netology «Пользователь готовит деньги заранее, ищет через форму поиска… в корзину…» (1.7) | Содержит интерфейсные слова («форму поиска», «корзину»), нет триггера и результата |
| Netology «Через месяц у нас юбилей свадьбы, я отложил деньги…» (1.7) | Пользовательская история в сыром виде: нет шагов, развилок и результата; другие примеры статьи — картинки, их текст не читается |

**Итог:** из 8 проверенных примеров годны 2 с оговорками, отброшено 6 (тестовые задачи, фразы без шагов и развилок, интерфейсные слова, картинки). Образцов для оплаты и подключения в духе Бирмана найти не удалось, как и в прошлый раз.

## 3. Сводка по форме

| Источник | Что такое | Форма | Интерфейс/реакции системы |
|---|---|---|---|
| Бирман | Инструмент понимания задачи | Связный абзац; варианты — маркированный список подсценариев | Нет |
| NN/g, task scenarios | Задача для теста | Одно-два предложения | Не должно быть подсказок интерфейса |
| NN/g, scenario mapping | Короткая история о задаче | Связный текст + 5 элементов; режется на 4–6 частей | Не должно быть дизайн-деталей |
| IxDF | Подробный рассказ с контекстом | Обычно текст, «истории» | В технической документации — описывать реакции системы |
| Digital.gov | История с контекстом | Текст по пунктам: кто, почему, где, что нужно, как | Нет |
| Cockburn | Use case (цель) | Шаблон, нумерованные шаги, ветки | Нет интерфейса, но есть шаги системы и сбои |
| Job story (Intercom/Mountain Goat) | Работа, которую надо сделать | Одна фраза «когда—хочу—чтобы» | Нет |
| Netology | Описание пользовательской истории и связей | «Единой формы не существует» | Зависит от группы |

## 4. Сравнение с Бирманом, шаблоном Б и чек-листом (предложения)

### 4.1. Что совпадает

- Язык задачи и контекста, без интерфейса: NN/g («Task scenarios that include terms used in the interface also bias the users»), Digital.gov, job story. Подтверждает правила Б1 и В1 чек-листа.
- Сценарий вокруг одной ключевой задачи: NN/g — «centered around one task that is key to your product». Подтверждает Е8 («один сценарий — одна задача»), которое я записал как свою идею; теперь есть цитата.
- Контекст: IxDF («Events leading up to the scenario… Environment…»), NN/g (motivator), Digital.gov («Where they are (context)»). Подтверждает А2 (обстоятельство) и А3.
- Шаблон Б по форме совпадает с job story: situation / motivation / expected outcome ≈ «Когда / хочет / чтобы». Бирман такой фразы не даёт; в нашем шаблоне она из job story.
- Форма — текст: NN/g, IxDF («Although usually textual»), Digital.gov («narrative form»).

### 4.2. Чем отличается

- **Актор.** NN/g, IxDF, Digital.gov строят сценарий на персоне; Бирман отвергает персоны. В нашем шаблоне роль берётся из триггеров джобов, персон нет.
- **Реакции системы.** IxDF советует в технической документации писать реакции системы; Бирман — нет. У Cockburn система действует в шагах.
- **Сбои.** Cockburn описывает их ветками по номеру шага; Бирман — подсценариями-событиями («Принтер сломался…»).
- **Форма.** Cockburn — нумерованные шаги; NN/g — абзац и таблица из пяти элементов; Бирман — абзац и список подсценариев.

### 4.3. Предложения для шаблона Б (ЖР §68) — на решение автора

1. **Оставить Б как есть.** Он совпадает с job story по форме; источников, которые требовали бы больше полей, не найдено.
2. **Необязательно: отдельная строка «Если не удалось» (результат при неудаче).** У Cockburn это «Failed End Condition»; у Бирмана и NN/g такого поля нет. Для нашего проекта часть этого уже в подсценариях («оплатил, а доступ не появился»). Цена: усложняет шаблон, который автор намеренно упростил.
3. **Необязательно: привязка подсценария к месту основного хода.** У Cockburn ветка называет номер шага; у Бирмана нет. Шаблон Б этого не требует.

### 4.4. Предложения для чек-листа (`research/scenarios_check_criteria.md`) — на решение автора

1. **Е8 подтвердить цитатой NN/g**: основание — «centered around one task that is key to your product» (сейчас помечено как моё предложение).
2. **Добавить критерий «не слишком много деталей»** (NN/g: «Include only a few general references to the personas’ needs and priorities. … be careful to avoid too many specifics and superfluous details»; IxDF: «be careful not to include too much in the way of extraneous information»). Совпадает с А7 (глубина), уточняет его.
3. **Добавить критерий «в сценарии нет названий конкретных функций»** (NN/g: «DON’T: Debbie goes to the Book a Hotel tab and uses the search bar»). Частично покрыт Б1; пример из источника можно использовать как пример нарушения.
4. Расхождение IxDF и Бирмана по реакциям системы в чек-лист не добавлять: наш проект следует Бирману (ЖР §68).

## 5. Что не проверено

- Купер, Яркова, Моеста, оригиналы Intercom и Клемента, книги Паттона и Cockburn (кроме копии шаблона) — не открыты.
- Другие русскоязычные источники (Unisender, Kokoc, Skyeng, Хабр) заново не открывал; их цитаты — в `research/scenario_vs_flow.md`.
- Картинки-примеры на Netology не читались.
- Все предложения раздела 4 не проверялись на практике.
