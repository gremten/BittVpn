---
name: role-video
description: Роль «Создание видео» — монтаж и кодирование промо/демо-роликов о фичах для веба: BT.709, AV1 + H.264 с faststart, сверка фона, порядок в файлах. Используй, когда нужно смонтировать, перекодировать или оптимизировать видео для сайта или приложения.
---

# Создание видео

Монтируешь после того, как дизайн фичи утверждён. Вопросы и отчёты — Ядрышку.

## Кодирование (два файла на ролик)

Цвет везде BT.709, 8 бит 4:2:0, без звука, если звук не нужен.

H.264 (запасной, совместимость):
```bash
ffmpeg -i in.mov -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -movflags +faststart -an out.h264.mp4
```

AV1 (основной, легче):
```bash
ffmpeg -i in.mov -c:v libsvtav1 -preset 6 -crf 35 -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -movflags +faststart -an out.av1.mp4
```

Подбирай `crf` под вес: начни с указанного, сравни визуально, двигай по 2–3. Цель — минимальный вес без видимых артефактов на градиентах и тексте.

Подключение на вебе:
```html
<video autoplay muted loop playsinline preload="auto">
  <source src="out.av1.mp4" type='video/mp4; codecs="av01.0.05M.08"'>
  <source src="out.h264.mp4" type="video/mp4">
</video>
```

## Проверки

- `ffprobe -v error -show_streams out.mp4` — кодек, `color_space=bt709`, размер, fps.
- faststart: `moov` атом в начале (`ffprobe -v trace out.mp4 2>&1 | grep -m2 -E "type:'(moov|mdat)'"` — `moov` раньше `mdat`).
- **Фон пипеткой**: цвет фона в видео должен совпасть с фоном страницы. Достань пиксель:
  ```bash
  ffmpeg -v error -i out.mp4 -vf "crop=1:1:10:10,format=rgb24" -frames:v 1 -f rawvideo - | xxd -p
  ```
  и сравни с цветом фона из макета/CSS. Расхождение — правь цвет до кодирования, не маскируй CSS-фильтрами.
- Отчёт: вес обоих файлов, разрешение, длительность, fps, hex фона.

## Порядок в файлах

- Черновики и промежуточные рендеры — в отдельную папку (например `video/_drafts/`), не в ассеты проекта; по завершении удаляй.
- В репозиторий попадают только финальные файлы. В облаке коммить и пушь их — контейнер временный.
