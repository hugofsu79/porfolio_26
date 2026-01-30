// ============================
// Boot Intro — Hugo Portfolio
// ============================

const lines: string[] = [
    "$ boot hugo-portfolio",
    "$ version 1.0.0 — production",
    "",
    "> initializing system",
    "├─ core",
    "│  ├─ identity.module",
    "│  │  ├─ role: UI / UX Designer",
    "│  │  ├─ focus: product, interfaces, systems",
    "│  │  └─ mindset: design × front-end",
    "│  ├─ interests.module",
    "│  │  ├─ music 🎶",
    "│  │  ├─ plants 🌱",
    "│  │  └─ experimental systems 💽",
    "│  └─ status: loaded",
    "│",
    "├─ projects",
    "│  ├─ rhizome.app",
    "│  ├─ siko-mobility.platform",
    "│  └─ oneiro.ai",
    "│",
    "└─ system status: ready",
    "",
    "> mounting interface…",
    "> waiting for user input, Merci :)",
];

const LINE_DELAY = 20; // ms between lines
const CHAR_DELAY = 9; // ms between characters
const END_RETENTION = 900; // ms pause at the end
const LOGO_DRAW_DURATION = 900; // ms (must match CSS animation)
const LOGO_DELAY_AFTER_TEXT = 120; // small delay after last char

let terminal: HTMLPreElement | null = null;
let intro: HTMLElement | null = null;
let index = 0;
let charIndex = 0;
let isRunning = false;

function printNextChar() {
    if (!terminal) return;

    const currentLine = lines[index];

    // écrire caractère par caractère
    if (charIndex < currentLine.length) {
        terminal.textContent += currentLine[charIndex];
        charIndex++;
        window.setTimeout(printNextChar, CHAR_DELAY);
        return;
    }

    // fin de ligne → saut de ligne
    terminal.textContent += "\n";
    charIndex = 0;
    index++;

    // passer à la ligne suivante ou terminer
    if (index < lines.length) {
        window.setTimeout(printNextChar, LINE_DELAY);
    } else {
        // last line finished → start logo draw
        window.setTimeout(() => {
            finishIntro();
        }, LOGO_DELAY_AFTER_TEXT);
    }
}

function startIntro() {
    if (!terminal || !intro || isRunning) return;

    isRunning = true;
    index = 0;
    charIndex = 0;

    terminal.textContent = "";
    intro.classList.remove("is-done");
    const logo = document.querySelector<SVGSVGElement>(".bootLogo");
    logo?.classList.remove("is-drawing");

    printNextChar();
}


function finishIntro() {
    if (!intro) return;

    isRunning = false;

    // Rétention finale (lecture du dernier état)
    window.setTimeout(() => {
        intro.classList.add("is-done");
        sessionStorage.setItem("bootSeen", "true");
    }, END_RETENTION + LOGO_DRAW_DURATION);
}

function initBootIntro() {
    terminal = document.querySelector<HTMLPreElement>("#terminal");
    intro = document.querySelector<HTMLElement>("#bootIntro");

    if (!terminal || !intro) return;

    startIntro();
}

// DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBootIntro, { once: true });
} else {
    initBootIntro();
}

// ============================
// DEV — Replay intro with R
// ============================
window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
        sessionStorage.removeItem("bootSeen");
        startIntro();
    }
});