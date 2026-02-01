export function player() {
  const players = document.querySelectorAll(".player");
  if (!players.length) return;

  /* ─────────────────────────────
     GLOBAL PLAYER STATE
     ───────────────────────────── */
  let ACTIVE_AUDIO = null;
  let ACTIVE_MORCEAU = null;
  let ACTIVE_RAF = null;
  let ACTIVE_PLAY_BUTTON = null;

  players.forEach((player) => {
    if (player.dataset.playerInit === "true") return;
    player.dataset.playerInit = "true";

    const morceau = player.closest(".morceau");
    if (!morceau) return;

    const playBtn = morceau.querySelector(".play");
    const osc = player.querySelector(".osc");

    const volumeBar = morceau.querySelector(".volume-bar");
    const volumeLevel = morceau.querySelector(".volume-level");
    const volumeToggle = morceau.querySelector(".volume-toggle");
    const volumeMax = morceau.querySelector(".volume-max");

    if (!playBtn || !osc || !volumeBar || !volumeLevel || !volumeToggle || !volumeMax) {
      return;
    }

    const src = player.dataset.audio;
    if (!src) return;

    const audio = new Audio(src);

    const BAR_COUNT = 18;

    const PLAY_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="23" fill="none">
    <path fill="currentColor"
        d="M18.935 9.377c1.42.82 1.42 2.868 0 3.688l-15.74 9.088C1.774 22.973 0 21.948 0 20.31V2.133C0 .493 1.774-.531 3.194.288l15.741 9.089Z" />
</svg>
`;

    const PAUSE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#currentColor">
    <path
        d="M0 1a1 1 0 0 1 1-1h6.431a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1ZM10.594 1a1 1 0 0 1 1-1h6.432a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1h-6.432a1 1 0 0 1-1-1V1Z" />
</svg>`;
    const VOLUME_OFF_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" fill="none">
    <g clip-path="url(#a)">
        <path fill="currentColor"
            d="M4.644 1.072 2.385 2.984a.32.32 0 0 1-.208.077H.642A.641.641 0 0 0 0 3.703V6.3c0 .356.288.642.642.642h1.535a.32.32 0 0 1 .208.077l2.259 1.912a.643.643 0 0 0 1.059-.49v-6.88a.643.643 0 0 0-1.059-.49Z" />
    </g>
    <defs>
        <clipPath id="a">
            <path fill="currentColor" d="M0 0h12.723v10H0z" />
        </clipPath>
    </defs>
</svg>`;
    const VOLUME_MUTE_ICON = `<svg xmlns="http://www.w3.org/2000/svg"  width="13" height="10" fill="#currentColor">
  <path
    d="m6.18 7.99 2.17-2.18v2.63c0 .54-.65.84-1.06.49l-1.11-.94ZM10.21 2.54 3.82 8.93c-.1.1-.23.15-.36.15-.12 0-.25-.05-.35-.15-.2-.19-.2-.51 0-.7L4.4 6.94H3.29c-.36 0-.65-.29-.65-.64V3.7c0-.36.29-.64.65-.64h1.53c.08 0 .15-.03.21-.08l2.26-1.91a.641.641 0 0 1 1.06.49v1.43l1.16-1.16c.19-.19.51-.19.7 0 .2.2.2.51 0 .71Z"
    />
</svg>`;

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
      bars.forEach((bar) => {
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
      if (ACTIVE_AUDIO && ACTIVE_AUDIO !== audio) {
        ACTIVE_AUDIO.pause();
        ACTIVE_AUDIO.currentTime = 0;

        if (ACTIVE_PLAY_BUTTON) {
          ACTIVE_PLAY_BUTTON.innerHTML = PLAY_ICON;
        }

        ACTIVE_MORCEAU?.classList.remove("is-active");
        cancelAnimationFrame(ACTIVE_RAF);
      }

      if (!audio.paused) {
        audio.pause();
        playBtn.innerHTML = PLAY_ICON;
        morceau.classList.remove("is-active");
        cancelAnimationFrame(rafId);
        return;
      }

      audio.play();
      playBtn.innerHTML = PAUSE_ICON;
      morceau.classList.add("is-active");

      ACTIVE_AUDIO = audio;
      ACTIVE_MORCEAU = morceau;
      ACTIVE_PLAY_BUTTON = playBtn;

      if (!rafId) animate();

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
}