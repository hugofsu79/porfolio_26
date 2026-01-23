/* ─────────────────────────────
   GLOBAL PLAYER STATE
   ───────────────────────────── */
let ACTIVE_AUDIO = null;
let ACTIVE_MORCEAU = null;
let ACTIVE_RAF = null;
let ACTIVE_PLAY_BUTTON = null;

document.querySelectorAll(".player").forEach((player) => {
  if (player.dataset.playerInit === "true") return;
  player.dataset.playerInit = "true";

  const morceau = player.closest(".morceau");
  const playBtn = morceau.querySelector(".play");
  const osc = player.querySelector(".osc");

  const volumeBar = morceau.querySelector(".volume-bar");
  const volumeLevel = morceau.querySelector(".volume-level");
  const volumeToggle = morceau.querySelector(".volume-toggle");
  const volumeMax = morceau.querySelector(".volume-max");

  const src = player.dataset.audio;
  const audio = new Audio(src);

  const BAR_COUNT = 18;

  const PLAY_ICON = `<img src="/public/icons/labo/player/player.svg" alt="Play" />`;
  const PAUSE_ICON = `<img src="/public/icons/labo/player/pause.svg" alt="Pause" />`;
  const VOLUME_OFF_ICON = `<img src="/public/icons/labo/player/Volume_off.svg" alt="Volume" />`;
  const VOLUME_MUTE_ICON = `<img src="/public/icons/labo/player/Volume_mute.svg" alt="Mute" />`;

  playBtn.innerHTML = PLAY_ICON;
  volumeToggle.innerHTML = VOLUME_OFF_ICON;

  /* ─────────────────────────────
     STATE
     ───────────────────────────── */
  let bars = [];
  let waveformComputed = false;
  let waveformRevealed = false;
  let rafId = null;

  let lastVolume = 0.5;
  let isMuted = false;

  /* ─────────────────────────────
     AUDIO / VOLUME
     ───────────────────────────── */
  audio.volume = 0.5;
  volumeLevel.style.width = "50%";

  function setVolume(v) {
    const value = Math.min(Math.max(v, 0), 1);
    audio.volume = value;
    volumeLevel.style.width = `${value * 100}%`;

    if (value === 0) {
      isMuted = true;
      volumeToggle.innerHTML = VOLUME_MUTE_ICON;
    } else {
      isMuted = false;
      lastVolume = value;
      volumeToggle.innerHTML = VOLUME_OFF_ICON;
    }
  }

  volumeBar.addEventListener("click", (e) => {
    const rect = volumeBar.getBoundingClientRect();
    setVolume((e.clientX - rect.left) / rect.width);
  });

  volumeToggle.addEventListener("click", () => {
    setVolume(isMuted ? lastVolume || 0.5 : 0);
  });

  volumeMax.addEventListener("click", () => setVolume(1));

  /* ─────────────────────────────
     WAVEFORM INIT (FLAT)
     ───────────────────────────── */
  const WAVEFORM_DURATION = 420;
  const WAVEFORM_BEZIER = "cubic-bezier(0.22, 1, 0.36, 1)";

  osc.innerHTML = "";
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement("div");
    bar.className = "osc-bar";
    bar.style.height = "6px";
    bar.style.setProperty("--fill", "0%");
    bar.style.transition = `height ${WAVEFORM_DURATION}ms ${WAVEFORM_BEZIER}`;
    osc.appendChild(bar);
    bars.push(bar);
  }

  /* ─────────────────────────────
     COMPUTE WAVEFORM (ASYNC)
     ───────────────────────────── */
  async function computeWaveform() {
    if (waveformComputed) return;
    waveformComputed = true;

    const ctx = new AudioContext();
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(buf);

    const data = audioBuffer.getChannelData(0);
    const slice = Math.floor(data.length / BAR_COUNT);

    bars.forEach((bar, i) => {
      let sum = 0;
      for (let j = i * slice; j < (i + 1) * slice; j++) {
        sum += data[j] ** 2;
      }
      bar.dataset.h = 6 + Math.sqrt(sum / slice) * 140;
    });
  }

  function revealWaveform() {
    if (waveformRevealed) return;
    waveformRevealed = true;
    bars.forEach(bar => {
      bar.style.height = `${bar.dataset.h}px`;
    });
  }

  /* ─────────────────────────────
     PROGRESSION (RAF)
     ───────────────────────────── */
  function animate() {
    if (audio.paused) {
      rafId = null;
      return;
    }

    const p = audio.currentTime / audio.duration;

    bars.forEach((bar, i) => {
      const a = i / BAR_COUNT;
      const b = (i + 1) / BAR_COUNT;
      let fill = 0;

      if (p >= b) fill = 100;
      else if (p > a) fill = ((p - a) / (b - a)) * 100;

      bar.style.setProperty("--fill", `${fill}%`);
    });

    rafId = requestAnimationFrame(animate);
    ACTIVE_RAF = rafId;
  }

  /* ─────────────────────────────
     SEEK ON WAVEFORM CLICK
     ───────────────────────────── */
  osc.addEventListener("click", (e) => {
    // Only allow seek on active track
    if (ACTIVE_AUDIO !== audio) return;

    const rect = osc.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.min(Math.max(x / rect.width, 0), 1);

    audio.currentTime = ratio * audio.duration;
  });

  /* ─────────────────────────────
     PLAY / PAUSE (INSTANT + GLOBAL)
     ───────────────────────────── */
  playBtn.addEventListener("click", () => {
    // stop other track
    if (ACTIVE_AUDIO && ACTIVE_AUDIO !== audio) {
      ACTIVE_AUDIO.pause();
      ACTIVE_AUDIO.currentTime = 0;

      if (ACTIVE_PLAY_BUTTON) {
        ACTIVE_PLAY_BUTTON.innerHTML = PLAY_ICON;
      }

      ACTIVE_MORCEAU.classList.remove("is-active");
      cancelAnimationFrame(ACTIVE_RAF);
    }

    // toggle same track
    if (!audio.paused) {
      audio.pause();
      playBtn.innerHTML = PLAY_ICON;
      morceau.classList.remove("is-active");
      cancelAnimationFrame(rafId);
      return;
    }

    // play instantly
    audio.play();
    playBtn.innerHTML = PAUSE_ICON;
    morceau.classList.add("is-active");

    ACTIVE_AUDIO = audio;
    ACTIVE_MORCEAU = morceau;
    ACTIVE_PLAY_BUTTON = playBtn;

    if (!rafId) animate();

    // waveform after play (non blocking)
    if (!waveformComputed) {
      computeWaveform().then(revealWaveform);
    }
  });

  audio.addEventListener("ended", () => {
    playBtn.innerHTML = PLAY_ICON;
    morceau.classList.remove("is-active");
    cancelAnimationFrame(rafId);

    if (ACTIVE_AUDIO === audio) {
      ACTIVE_AUDIO = null;
      ACTIVE_MORCEAU = null;
      ACTIVE_PLAY_BUTTON = null;
    }
  });
});