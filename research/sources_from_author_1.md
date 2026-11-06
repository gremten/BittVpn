# Источники, присланные автором (тексты, не открывались Research)

Статус: текст прислал автор в чат 2026-11-06; страницы Research не открывал. Ниже выдержки дословно (англ.), без перевода.

## S1. Apple HIG, «Loading» (developer.apple.com/design/human-interface-guidelines/loading)
- «The best content-loading experience finishes before people become aware of it.»
- «Show something as soon as possible. If you make people wait for loading to complete before displaying anything, they can interpret the lack of content as a problem with your app or game. Instead, consider showing placeholder text, graphics, or animations as content loads, replacing these elements as content becomes available.»
- «Let people do other things in your app or game while they wait for content to load.»
- «If loading takes an unavoidably long time, give people something interesting to view while they wait.»
- «Clearly communicate that content is loading and how long it might take to complete.» Определённый индикатор, когда время известно; неопределённый, когда нет.
- watchOS: «avoid showing a loading indicator... In situations where content needs a second or two to load, it's better to display a loading indicator than a blank screen.»
Применимость: правила для состояния «загрузка» (скелетон вместо пустоты). Артефакты А/Б не определяет.

## S2. Чек-лист передачи дизайна разработке (текст со ссылками на uxpin.com; заголовок страницы автор не прислал, вероятно «Design Handoff Checklist» UXPin — сверить)
Planning:
- «Ensure developers (or at least the development lead) attends the kickoff.»
- «Walkthrough user flows and lo-fi prototypes for developer feedback on feasibility.»
Prototyping:
- «Prototypes account for all interaction states, error states, and transitions between states.»
- «Prototypes account for data extremes (e.g., short and long last names, phone number formats, non-US postcodes).»
- «Hold a 30-minute to an hour review of final approved mockups alongside the prototype: walkthrough project goals, user stories, interactions, states, and failure states.»
Documentation:
- «Annotate prototypes with use cases, failure states, and interaction nuances.»
- «Annotate the full code snippet (or classes in frameworks) next to every element.»
- «Use an inspection tool to auto-generate visual specs... Avoid redlining as much as possible.»
- «Ensure all documentation stays updated to reflect the final system as it evolves. Developers will refer to the documentation... using the final prototype as a reference for acceptable behaviors.»
After handoff:
- «Designers perform an "implementation audit" of each build during the QA process against the final prototype.»
- «Acceptance testing includes UX criteria based on the final prototype.»
Visual hygiene и assets (кратко): удалять неиспользуемые слои, имена по UI-модулям, общее именование с разработчиками, версии v.1/v.2 вместо FINAL, SVG, 2x для растра.
Применимость: подтверждает, что в Б входят все состояния (взаимодействия, ошибки, переходы между состояниями), крайние данные, аннотации «случаи использования и состояния сбоя», критерии приёмки по финальному прототипу. Закрывает пробел Research «анимации/критерии приёмки не нашёл» частично: критерии приёмки есть (UX-критерии по прототипу); анимации прямо не названы, только «transitions between states».
