# Cloudflare Workers: развёртывание из GitHub

Репозиторий `gremten/BittVpn` — React-приложение. `wrangler.jsonc` публикует папку `build` как Worker Static Assets и включает SPA fallback. Имя Worker в Cloudflare должно совпадать с `name` в конфигурации (`bittvpn`).

1. Сначала закоммитьте и отправьте изменения приложения и `wrangler.jsonc` в ветку GitHub, которую выберете для деплоя.
2. В Cloudflare откройте **Workers & Pages → Create application → GitHub**, подключите `gremten/BittVpn` и задайте имя `bittvpn`. Для уже созданного Worker: **Settings → Builds → Connect**.
3. Укажите **Build command:** `CI=false npm run build`; **Deploy command:** `npx wrangler deploy`; **Preview command:** `npx wrangler preview`; корневая директория — корень репозитория. `CI=false` нужен из-за существующих предупреждений Create React App, которые иначе рассматриваются как ошибки в CI. Зависимости Workers Builds устанавливает автоматически.
4. В **Settings → Builds → Branch control** выберите production-ветку. Каждый push в неё создаёт production deployment; Preview builds создают отдельные превью для остальных веток.
5. Нажмите **Deploy / Save and Deploy**, проверьте лог сборки и откройте выданный адрес. Для публичного доступа оставьте Cloudflare Access выключенным, как на скриншоте.

Для подключения существующего Worker его имя должно совпадать с `name` в `wrangler.jsonc`. Создание подключения само по себе не загружает локальные незакоммиченные изменения. Не помещайте токены в репозиторий.

Документация: https://developers.cloudflare.com/workers/ci-cd/builds/ и https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/.
