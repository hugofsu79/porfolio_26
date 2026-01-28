export function formMessage() {
  const form = document.getElementById("contact-form");
  const toast = document.getElementById("toast");

  // Si la page n’a pas de formulaire contact → on ne fait rien
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      if (toast) {
        toast.textContent = "Message envoyé avec succès ✨";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }

      form.reset();
    } catch {
      if (toast) {
        toast.textContent = "Erreur lors de l’envoi du message";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      }
    }
  });
}