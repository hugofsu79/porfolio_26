document.querySelectorAll(".player").forEach((player) => {
    // 🔒 Sécurité : empêche double init
    if (player.dataset.playerInit === "true") return;
    player.dataset.playerInit = "true";

    const osc = player.querySelector(".osc");
    const playBtn = player.closest(".morceau")?.querySelector(".play");
    const src = player.dataset.audio;

    const BAR_COUNT = 18;
    const WAVEFORM_ANIM_DURATION = 800;
    const BEZIER = "cubic-bezier(0.22, 1, 0.36, 1)";

    const PLAY_ICON = `<img src="/public/icons/labo/player/player.svg" alt="Play" />`;
    const PAUSE_ICON = `<img src="/public/icons/labo/player/pause.svg" alt="Pause" />`;

    playBtn.innerHTML = PLAY_ICON;

    /* ─────────────────────────────
       AUDIO (UNE SEULE INSTANCE)
       ───────────────────────────── */
    const audio = new Audio(src);

    /* ─────────────────────────────
       STATE
       ───────────────────────────── */
    let bars = [];
    let waveformComputed = false;
    let waveformRevealed = false;
    let rafId = null;

    /* ─────────────────────────────
       1️⃣ Waveform à plat
       ───────────────────────────── */
    osc.innerHTML = "";

    for (let i = 0; i < BAR_COUNT; i++) {
        const bar = document.createElement("div");
        bar.className = "osc-bar";
        bar.style.height = "6px";
        bar.style.setProperty("--fill", "0%");
        bar.style.transition = `height ${WAVEFORM_ANIM_DURATION}ms ${BEZIER}`;
        osc.appendChild(bar);
        bars.push(bar);
    }

    /* ─────────────────────────────
       2️⃣ Calcul waveform (RMS — UNE FOIS)
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
            const rms = Math.sqrt(sum / slice);
            bar.dataset.h = 6 + rms * 80;
        });
    }

    /* ─────────────────────────────
       3️⃣ Reveal waveform (UNE FOIS)
       ───────────────────────────── */
    function revealWaveform() {
        if (waveformRevealed) return;
        waveformRevealed = true;

        bars.forEach((bar) => {
            bar.style.height = `${bar.dataset.h}px`;
        });
    }

    /* ─────────────────────────────
       4️⃣ Animation progression (SAFE)
       ───────────────────────────── */
    function animate() {
        if (audio.paused) {
            rafId = null;
            return;
        }

        const progress = audio.currentTime / audio.duration;

        bars.forEach((bar, i) => {
            const start = i / BAR_COUNT;
            const end = (i + 1) / BAR_COUNT;

            let fill = 0;
            if (progress >= end) fill = 100;
            else if (progress > start)
                fill = ((progress - start) / (end - start)) * 100;

            bar.style.setProperty("--fill", `${fill}%`);
        });

        rafId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (rafId !== null) return;
        animate();
    }

    function stopAnimation() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    /* ─────────────────────────────
       5️⃣ PLAY / PAUSE
       ───────────────────────────── */
    playBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        if (audio.paused) {
            await computeWaveform();
            revealWaveform();

            setTimeout(() => {
                audio.play();
                playBtn.innerHTML = PAUSE_ICON;
                startAnimation();
            }, WAVEFORM_ANIM_DURATION);
        } else {
            audio.pause();
            playBtn.innerHTML = PLAY_ICON;
            stopAnimation();
        }
    });

    /* ─────────────────────────────
       6️⃣ SEEK (zone waveform réelle)
       ───────────────────────────── */
    osc.addEventListener("click", (e) => {
        if (!waveformRevealed) return;

        const first = bars[0].getBoundingClientRect();
        const last = bars[bars.length - 1].getBoundingClientRect();

        if (e.clientX < first.left || e.clientX > last.right) return;

        const ratio = (e.clientX - first.left) / (last.right - first.left);
        audio.currentTime = ratio * audio.duration;
    });

    /* ─────────────────────────────
       7️⃣ Fin de lecture
       ───────────────────────────── */
    audio.addEventListener("ended", () => {
        playBtn.innerHTML = PLAY_ICON;
        bars.forEach((bar) => bar.style.setProperty("--fill", "0%"));
        stopAnimation();
    });
});