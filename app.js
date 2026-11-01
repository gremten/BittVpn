(() => {
  "use strict";

  const REFERRAL_URL = "https://bitt.io/r/45454522";
  const app = document.getElementById("app");
  const screens = [...document.querySelectorAll(".screen")];
  const history = ["main"];
  let toastTimer = null;

  function currentName() {
    const active = screens.find(s => !s.hidden);
    return active?.dataset.screen || "main";
  }

  function showScreen(name, push = true) {
    const current = currentName();
    if (current === name) return;
    if (push && current) history.push(current);

    screens.forEach(screen => {
      const active = screen.dataset.screen === name;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
      if (active) screen.scrollTop = 0;
    });
    requestAnimationFrame(updateRainClip);
  }

  function goBack() {
    const previous = history.pop() || "main";
    screens.forEach(screen => {
      const active = screen.dataset.screen === previous;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
    requestAnimationFrame(updateRainClip);
  }

  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      event.preventDefault();
      showScreen(nav.dataset.nav);
      return;
    }
    if (event.target.closest("[data-back]")) {
      event.preventDefault();
      goBack();
      return;
    }
  });

  const mainReferralEntry = document.getElementById("main-referral-entry");
  const openReferral = (event) => {
    if (event?.target?.closest("[data-stop-nav],button")) return;
    showScreen("referral");
  };
  mainReferralEntry.addEventListener("click", openReferral);
  mainReferralEntry.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && !e.target.closest("button")) {
      e.preventDefault();
      showScreen("referral");
    }
  });

  document.querySelectorAll(".referral-link-zone").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      showScreen("referral");
    });
    if (el.getAttribute("role") === "button") {
      el.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showScreen("referral");
        }
      });
    }
  });

  function showToast(message = "Скопировано в буфер обмена") {
    const toast = document.getElementById("toast");
    document.getElementById("toast-text").textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  async function copyText(text, message) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      showToast(message);
    } catch {
      showToast("Не удалось скопировать");
    }
  }

  document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", e => {
      e.stopPropagation();
      copyText(REFERRAL_URL, "Скопировано в буфер обмена");
    });
  });
  document.querySelector(".copy-id")?.addEventListener("click", () => {
    copyText("id65436565", "ID скопирован");
  });

  async function shareReferral(e) {
    e?.stopPropagation();
    const data = {
      title: "BittVPN",
      text: "BittVPN — приглашение по моей ссылке",
      url: REFERRAL_URL
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (window.Telegram?.WebApp?.openTelegramLink) {
        const shareUrl = "https://t.me/share/url?url=" +
          encodeURIComponent(REFERRAL_URL) +
          "&text=" + encodeURIComponent(data.text);
        window.Telegram.WebApp.openTelegramLink(shareUrl);
      } else {
        await copyText(REFERRAL_URL, "Ссылка скопирована — можно отправить");
      }
    } catch (err) {
      // User cancelling native share is normal: do not show an error.
      if (err?.name && err.name !== "AbortError") showToast("Не удалось открыть отправку");
    }
  }
  document.querySelectorAll(".share-button").forEach(btn => btn.addEventListener("click", shareReferral));

  /* bitmap_matrix_rain
     Natural source size: 600 × 440.
     Exact animation clock: 300 frames × 30 ms = 9000 ms.
     The canvas is a separate media layer; clipping is handled by #rain-clip. */
  const canvas = document.getElementById("bitmap-matrix-rain");
  const ctx = canvas.getContext("2d");
  const FRAME_COUNT = 300;
  const FRAME_MS = 30;
  let frame = 0;
  let timer = null;

  // Deterministic stream setup, so frame 0 after frame 299 is an exact cycle.
  const streams = Array.from({length: 58}, (_, i) => {
    const x = 6 + (i * 41) % 594;
    const base = ((i * 83) % 520) - 160;
    const speed = 1 + ((i * 7) % 5) * 0.23;
    const len = 5 + (i * 11) % 13;
    const alpha = .20 + ((i * 17) % 55) / 100;
    return {x, base, speed, len, alpha, seed:i * 19 + 7};
  });
  const glyphs = ["·","×","⌁","⌇","∴","┊","0","1","•","╎","⁝","⌗"];

  function drawRain(f) {
    ctx.clearRect(0, 0, 600, 440);
    ctx.save();
    ctx.font = '8px "SFMono-Regular", Consolas, monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (const s of streams) {
      // Periodic position: each stream returns to exactly the same state at f=300.
      const travel = 610;
      const phase = ((f * s.speed * 2.05 + s.base + 800) % travel) - 145;
      for (let j = 0; j < s.len; j++) {
        const y = phase - j * 10;
        if (y < -12 || y > 452) continue;
        const idx = (s.seed + j * 5 + Math.floor(f / 10)) % glyphs.length;
        const fade = 1 - j / (s.len + 1);
        const a = Math.max(.035, s.alpha * fade);
        ctx.fillStyle = `rgba(233,240,243,${a})`;
        ctx.fillText(glyphs[idx], s.x + Math.sin((f + s.seed + j*9) * .06) * .6, y);
      }
    }
    ctx.restore();
  }

  function startRain() {
    if (timer) return;
    drawRain(frame);
    timer = setInterval(() => {
      frame = (frame + 1) % FRAME_COUNT;
      drawRain(frame);
    }, FRAME_MS);
  }

  function stopRain() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  function motionPreference() {
    if (reduced.matches) {
      stopRain();
      frame = 0;
      drawRain(0);
    } else {
      startRain();
    }
  }
  reduced.addEventListener?.("change", motionPreference);
  motionPreference();

  /* Clip boundary always follows the bottom of stats — no hard-coded pixel mask. */
  function updateRainClip() {
    const screen = document.getElementById("screen-referral");
    const stats = document.getElementById("referral-stats");
    const clip = document.getElementById("rain-clip");
    if (!screen || !stats || !clip || screen.hidden) return;
    const s = screen.getBoundingClientRect();
    const b = stats.getBoundingClientRect();
    // Include stats exactly; nothing from the media layer can render below this boundary.
    clip.style.height = `${Math.max(0, b.bottom - s.top)}px`;
  }

  window.addEventListener("resize", updateRainClip, {passive:true});
  new ResizeObserver(updateRainClip).observe(document.getElementById("referral-stats"));
  requestAnimationFrame(updateRainClip);

  // Expose tiny debug API for QA.
  window.BittVPNPrototype = {
    showScreen,
    goBack,
    referralUrl: REFERRAL_URL,
    animation: {width:600, height:440, frames:FRAME_COUNT, frameMs:FRAME_MS, cycleMs:FRAME_COUNT*FRAME_MS}
  };
})();
