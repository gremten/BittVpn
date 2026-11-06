# Шрифты в Figma-окружении MCP (проверено 2026-11-06, Дизайн)

**Martian Grotesk грузится**, если указывать правильное имя стиля. Прежние попытки падали из-за стиля: «Regular»/«Medium» не существуют.

## Что доступно (figma.listAvailableFontsAsync, всего 9014 шрифтов, Martian 72)
- family «**Martian Grotesk**» (именно такая; «Martian Grotesk VF» и «Martian Grotesk Std Rg» как family НЕ существуют): 63 стиля = ширина × насыщенность.
  - Ширины: `Cn`, `Nr`, `Std`, `sWd`, `Wd`, `xWd`, `uWd`.
  - Насыщенности: `Th`, `xLt`, `Lt`, `Rg`, `Md`, `Bd`, `xBd`, `Bl`, `Ult` (для `Cn`, `Nr`, `Std`, `Wd`, `sWd`, `uWd`, `xWd` все девять; у `Std` нет `Th`? есть: Std Th, xLt, Lt, Rg, Md, Bd, xBd, Bl, Ult).
  - Примеры: «Std Rg», «Std Md», «Std Bd», «Nr Rg», «Wd Md».
- family «Martian Mono»: Thin, ExtraLight, Light, Regular, Medium, SemiBold, Bold, ExtraBold, SemiExpanded Regular (обычные имена).

## Что грузится (loadFontAsync)
- `{family:'Martian Grotesk', style:'Std Rg'}` — OK; `{family:'Martian Grotesk', style:'Std Md'}` — OK.
- `style:'Regular'` — ошибка «The font "Martian Grotesk Regular" could not be loaded. Available styles for "Martian Grotesk": ["Cn Bd","Cn Bl",…]»; `family:'Martian Grotesk VF'` — «The font family "Martian Grotesk VF" does not exist».

## Где проверено в файле 5ks9FYkDbV4fcg60G4SLjf (страница «🐈 JTBD и гипотезы» 42:807)
- Тексты файла уже используют `Martian Grotesk | Std Md` (24 текста, например заголовок «Вход и подбор» в «Онбординг / по категориям» 7957:2436). Остальные шрифты в тексте файла: Golos UI Regular/Medium, Golos Text, Inter, Fira Sans, SF Pro.
- Локальные текстовые стили: `title/e-large` (Martian Grotesk Std Md 32/40), `title/large` (Std Md 24/32), `title/medium` (Std Md 20/28), `title/small` (Std Md 16/24), `title/accent` (Nothing Font 32/48); `body/l`, `body/m`, `body/m-medium`, `body/m-link`, `body/s`, `body/s-medium`, `body/caption`, `body/caption-link`, `body/caption-medium`, `body/caption-striked` — Golos UI (Regular/Medium) 12–20.

## Как писать код
`await figma.loadFontAsync({family:'Martian Grotesk', style:'Std Md'})` (заголовки), `Std Rg` для обычного; тексты и стили брать из файла: `setTextStyleIdAsync(styleId)`; на тексты, которым назначен стиль, шрифт и размер подтянутся из стиля, шрифт из стиля должен быть загружен заранее.

## Что применено
В секции «Тех. карта / блоки tm v1» (8141:2485), только в моих узлах-компонентах (57 текстов вне инстансов), назначены стили файла: `title/large` (имя экрана в заглушке), `title/medium` (название карты в плашке) — Martian Grotesk Std Md; остальные тексты — `body/m-medium`, `body/s`, `body/s-medium` (Golos UI, как в стилях файла). Прочие места в файле (карточки сценария и др.) не менялись.
