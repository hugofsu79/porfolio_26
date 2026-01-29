// ============================
// Page transition — Solution 2 (SPA-like "éventration")
// ============================

const DURATION = 800; // must match CSS clip-path transition

function isInternalLink(link: HTMLAnchorElement, e: MouseEvent): boolean {
    if (link.target === "_blank") return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    const href = link.getAttribute("href");
    if (!href) return false;
    if (href.startsWith("#")) return false;
    if (href.startsWith("http")) return false;
    return true;
}

async function loadNextPage(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, { headers: { "X-Requested-With": "fetch" } });
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

function extractPageContent(html: string): HTMLElement | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.querySelector("main.page");
}

function animateExit(page: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
        page.classList.add("is-exiting");
        setTimeout(resolve, DURATION);
    });
}

function animateEnter(page: HTMLElement): void {
    page.classList.remove("is-exiting");
}

function bindLinks(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>("a[href]");

    links.forEach((link) => {
        link.addEventListener("click", async (e: MouseEvent) => {
            if (!isInternalLink(link, e)) return;

            e.preventDefault();

            const page = document.querySelector<HTMLElement>("main.page");
            if (!page) return;

            const url = link.href;

            // 1. Fetch next page
            const html = await loadNextPage(url);
            if (!html) {
                window.location.href = url;
                return;
            }

            const nextPage = extractPageContent(html);
            if (!nextPage) {
                window.location.href = url;
                return;
            }

            // 2. Animate current page (éventration)
            await animateExit(page);

            // 3. Swap content
            page.innerHTML = nextPage.innerHTML;

            // 4. Update URL
            window.history.pushState({}, "", url);

            // 5. Reveal new page
            animateEnter(page);

            // 6. Rebind links for new content
            bindLinks();
        });
    });
}

export function pageTransition(): void {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindLinks, { once: true });
    } else {
        bindLinks();
    }
}

// Handle back / forward navigation
window.addEventListener("popstate", () => {
    window.location.reload();
});