export function formMessage() {
  const showToast = (message, type = "success") => {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  };

  const form = document.getElementById("contact-form");
  if (!(form instanceof HTMLFormElement)) {
    console.warn("[contact] missing form");
    return;
  }

  // éviter double bind (navigation Astro)
  form.dataset.bound ||= "false";
  if (form.dataset.bound === "true") return;
  form.dataset.bound = "true";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[contact] submit");

    showToast("Envoi en cours…", "success");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });

      const text = await res.text();
      console.log("[contact] response", res.status, text);

      let json = null;
      try {
        json = JSON.parse(text);
      } catch {}

      if (res.ok && json?.success) {
        showToast("Message envoyé, très bonne journée !", "success");
        form.reset();
      } else {
        showToast(json?.error ?? "Erreur lors de l’envoi", "error");
      }
    } catch (err) {
      console.error("[contact] fetch error", err);
      showToast("Erreur réseau : impossible d’envoyer.", "error");
    }
  });
}