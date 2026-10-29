/* ============================================================
   100 Days With You — Our Little Love Story
   script.js — interaksi ringan: reveal, hati beterbangan,
   lightbox, tombol pelukan, dan musik latar
   ============================================================ */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const HEART_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  /* ------------------------------------------------------------
     1. Reveal saat bagian muncul di layar
  ------------------------------------------------------------ */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -36px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------
     2. Penghitung hari — angka 100 sebagai elemen dekoratif
        (count-up lembut, bukan hitung mundur)
  ------------------------------------------------------------ */
  const dayNumber = $("#dayNumber");
  if (dayNumber) {
    if (reduceMotion || !("requestAnimationFrame" in window)) {
      dayNumber.textContent = "100";
    } else {
      const target = 100;
      const duration = 2100;
      const startTime = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        dayNumber.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ------------------------------------------------------------
     3. Floating hearts — sedikit, lambat, dan lembut
  ------------------------------------------------------------ */
  const heartsLayer = $("#floatingHearts");
  if (heartsLayer && !reduceMotion) {
    const TOTAL = 9;
    for (let i = 0; i < TOTAL; i++) {
      const heart = document.createElement("span");
      heart.className = "fh";
      heart.innerHTML = HEART_SVG;
      heart.style.setProperty("--x", (Math.random() * 96 + 2).toFixed(1) + "%");
      heart.style.setProperty("--d", (15 + Math.random() * 14).toFixed(1) + "s");
      heart.style.setProperty("--delay", (-Math.random() * 22).toFixed(1) + "s");
      heart.style.setProperty("--s", (0.45 + Math.random() * 0.85).toFixed(2));
      heart.style.setProperty("--o", (0.13 + Math.random() * 0.2).toFixed(2));
      heartsLayer.appendChild(heart);
    }
  }

  /* ------------------------------------------------------------
     4. Smooth scroll — tombol & tautan timeline
  ------------------------------------------------------------ */
  $$("[data-scroll], a[href^='#']").forEach((el) => {
    el.addEventListener("click", (event) => {
      const targetSel = el.getAttribute("data-scroll") || el.getAttribute("href");
      if (!targetSel || targetSel === "#") return;
      const target = $(targetSel);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", targetSel);
    });
  });

  /* ------------------------------------------------------------
     5. Lightbox — tekan gambar untuk melihat lebih besar
  ------------------------------------------------------------ */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxCaption = $("#lightboxCaption");

  const openLightbox = (src, caption) => {
    if (!lightbox || !src) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "Foto kenangan kita";
    lightboxCaption.textContent = caption || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const closeBtn = $("#lightboxClose");
    if (closeBtn) closeBtn.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  $$(".lightbox-trigger").forEach((figure) => {
    figure.setAttribute("role", "button");
    figure.setAttribute("tabindex", "0");

    const activate = () => {
      const img = figure.querySelector("img");
      if (!img) return;
      const caption =
        figure.getAttribute("data-caption") ||
        (figure.querySelector("figcaption")
          ? figure.querySelector("figcaption").textContent
          : "");
      openLightbox(img.currentSrc || img.src, caption);
    };

    figure.addEventListener("click", activate);
    figure.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest("#lightboxClose")) {
        closeLightbox();
      }
    });
  }

  /* ------------------------------------------------------------
     6. Tombol pelukan — animasi hati + pesan manis
  ------------------------------------------------------------ */
  const hugOverlay = $("#hugOverlay");
  const hugStage = $("#hugStage");
  const hugBtn = $("#hugBtn");
  const hugClose = $("#hugClose");

  const burstHearts = () => {
    if (!hugStage || reduceMotion) return;
    const TOTAL = 26;
    for (let i = 0; i < TOTAL; i++) {
      const heart = document.createElement("span");
      heart.className = "burst-heart";
      heart.innerHTML = HEART_SVG;
      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 190;
      heart.style.setProperty("--tx", (Math.cos(angle) * distance).toFixed(0) + "px");
      heart.style.setProperty("--ty", (Math.sin(angle) * distance * 0.75 - 70).toFixed(0) + "px");
      heart.style.setProperty("--rot", ((Math.random() * 50 - 25).toFixed(0)) + "deg");
      heart.style.setProperty("--dur", (1.7 + Math.random() * 1.7).toFixed(2) + "s");
      heart.style.setProperty("--delay", (Math.random() * 0.55).toFixed(2) + "s");
      heart.style.setProperty("--s", (0.35 + Math.random() * 0.85).toFixed(2));
      heart.addEventListener("animationend", () => heart.remove());
      hugStage.appendChild(heart);
    }
  };

  const openHug = () => {
    if (!hugOverlay) return;
    hugOverlay.classList.add("is-open");
    hugOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    burstHearts();
    if (hugClose) hugClose.focus();
  };

  const closeHug = () => {
    if (!hugOverlay) return;
    hugOverlay.classList.remove("is-open");
    hugOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (hugStage) hugStage.innerHTML = "";
    if (hugBtn) hugBtn.focus();
  };

  if (hugBtn && hugOverlay) {
    hugBtn.addEventListener("click", openHug);
    hugOverlay.addEventListener("click", (event) => {
      if (event.target === hugOverlay || event.target.closest("#hugClose")) {
        closeHug();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (lightbox && lightbox.classList.contains("is-open")) closeLightbox();
    if (hugOverlay && hugOverlay.classList.contains("is-open")) closeHug();
  });

  /* ------------------------------------------------------------
     7. Slot kenangan opsional — jika gambar tidak ada,
        tampilkan kartu "slot kenangan" yang tetap rapi
  ------------------------------------------------------------ */
  $$("img[data-optional]").forEach((img) => {
    const markEmpty = () => {
      const slot = img.closest(".memory-slot");
      if (slot) slot.classList.add("is-empty");
      img.remove();
    };
    if (img.complete && img.naturalWidth === 0) {
      markEmpty();
    } else {
      img.addEventListener("error", markEmpty);
    }
  });

  /* ------------------------------------------------------------
     8. Musik latar
        - Utamakan file lagu kalian: assets/audio/our-song.mp3
        - Jika belum ada, mainkan melodi music box lembut (Web Audio)
        - Tidak pernah autoplay bersuara; hanya lewat tombol
  ------------------------------------------------------------ */
  const musicBtn = $("#musicBtn");
  const SONG_PATH = "assets/audio/our-song.mp3";

  let songAudio = null;
  let musicMode = "none"; // "file" | "synth"
  let musicOn = false;
  let synth = null;

  const updateMusicBtn = () => {
    if (!musicBtn) return;
    musicBtn.classList.toggle("is-playing", musicOn);
    musicBtn.setAttribute("aria-pressed", musicOn ? "true" : "false");
    musicBtn.setAttribute(
      "aria-label",
      musicOn ? "Jeda musik latar" : "Putar musik latar"
    );
    musicBtn.setAttribute("title", musicOn ? "Jeda musik ♪" : "Putar musik ♪");
  };

  /* --- Music box lembut (melodi orisinal, waltz 3/4) --- */
  const createMusicBox = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const soften = ctx.createBiquadFilter();
    soften.type = "lowpass";
    soften.frequency.value = 2600;
    soften.connect(master);

    const noteFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
    const BEAT = 0.72; // detik per ketukan (~83 bpm)
    const LOOP_BEATS = 24;
    const LOOP_SEC = LOOP_BEATS * BEAT + 1.4; // jeda kecil sebelum mengulang

    // [nada MIDI, mulai (ketukan), panjang (ketukan)]
    const MELODY = [
      [76, 0, 1], [79, 1, 1], [84, 2, 1],
      [71, 3, 1], [74, 4, 1], [79, 5, 1],
      [69, 6, 1], [72, 7, 1], [77, 8, 1],
      [76, 9, 2], [72, 11, 1],
      [76, 12, 1], [79, 13, 1], [84, 14, 1],
      [74, 15, 1], [77, 16, 1], [81, 17, 1],
      [79, 18, 1], [76, 19, 1], [74, 20, 1],
      [72, 21, 3],
    ];
    const BASS = [
      [48, 0], [43, 3], [41, 6], [43, 9],
      [48, 12], [41, 15], [43, 18], [48, 21],
    ];

    const playNote = (freq, when, dur, vol) => {
      const env = ctx.createGain();
      env.connect(soften);
      env.gain.setValueAtTime(0.0001, when);
      env.gain.exponentialRampToValueAtTime(vol, when + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, when + dur * 1.6 + 0.7);

      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.connect(env);
      osc.start(when);
      osc.stop(when + dur * 1.6 + 0.8);

      // harmoni lembut ala kotak musik
      [[2, 0.28], [3, 0.1]].forEach(([mult, gain]) => {
        const harmonic = ctx.createGain();
        harmonic.gain.value = gain;
        harmonic.connect(env);
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = freq * mult;
        osc2.connect(harmonic);
        osc2.start(when);
        osc2.stop(when + dur * 1.6 + 0.8);
      });
    };

    let playing = false;
    let loopTimer = null;
    let nextLoopAt = 0;

    const scheduleLoop = (startAt) => {
      MELODY.forEach(([midi, beat, len]) =>
        playNote(noteFreq(midi), startAt + beat * BEAT, len * BEAT, 0.42)
      );
      BASS.forEach(([midi, beat]) =>
        playNote(noteFreq(midi), startAt + beat * BEAT, 1.7 * BEAT, 0.3)
      );
    };

    const start = () => {
      if (playing) return;
      playing = true;
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0.34, t + 0.9);
      nextLoopAt = t + 0.18;
      const runLoop = () => {
        scheduleLoop(nextLoopAt);
        nextLoopAt += LOOP_SEC;
        loopTimer = setTimeout(
          runLoop,
          Math.max(200, (nextLoopAt - ctx.currentTime - 0.4) * 1000)
        );
      };
      runLoop();
    };

    const stop = () => {
      if (!playing) return;
      playing = false;
      clearTimeout(loopTimer);
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0.0001, t + 0.45);
    };

    return { start, stop };
  };

  const startSynth = () => {
    if (!synth) synth = createMusicBox();
    if (!synth) return false;
    synth.start();
    musicMode = "synth";
    musicOn = true;
    updateMusicBtn();
    return true;
  };

  const toggleMusic = async () => {
    if (!musicBtn) return;

    if (musicMode === "file" && songAudio) {
      if (musicOn) {
        songAudio.pause();
        musicOn = false;
      } else {
        try {
          await songAudio.play();
          musicOn = true;
        } catch (err) {
          musicOn = false;
        }
      }
      updateMusicBtn();
      return;
    }

    if (musicMode === "synth" && synth) {
      if (musicOn) {
        synth.stop();
        musicOn = false;
      } else {
        startSynth();
      }
      updateMusicBtn();
      return;
    }

    // Pertama kali ditekan: coba file lagu kalian, jika gagal pakai music box
    songAudio = new Audio(SONG_PATH);
    songAudio.loop = true;
    songAudio.volume = 0.55;
    songAudio.preload = "auto";
    try {
      await songAudio.play();
      musicMode = "file";
      musicOn = true;
    } catch (err) {
      songAudio = null;
      startSynth();
    }
    updateMusicBtn();
  };

  if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic);
  }

  /* ------------------------------------------------------------
     9. Parallax sangat halus di hero (hanya desktop, pointer halus)
  ------------------------------------------------------------ */
  if (
    !reduceMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    const parallaxEls = $$(".hero [data-parallax]");
    let rafId = 0;
    window.addEventListener(
      "mousemove",
      (event) => {
        if (rafId) return;
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        rafId = requestAnimationFrame(() => {
          parallaxEls.forEach((el) => {
            const depth = parseFloat(el.getAttribute("data-parallax")) || 12;
            el.style.translate = `${(-nx * depth).toFixed(1)}px ${(-ny * depth).toFixed(1)}px`;
          });
          rafId = 0;
        });
      },
      { passive: true }
    );
  }
})();
