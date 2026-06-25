const header = document.querySelector(".site-header");
const root = document.documentElement;
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealTargets = document.querySelectorAll(
  ".intro, .story, .proof-strip, .store-release, .showcase, .features, .audiences, .waldemar, .city-band, .partners, .ads, .team, .contact, .support-faq"
);
const motionTargets = {
  hero: document.querySelector(".hero"),
  showcase: document.querySelector(".showcase"),
  waldemar: document.querySelector(".waldemar"),
  city: document.querySelector(".city-band"),
};
let ticking = false;

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const getSectionProgress = (element) => {
  if (!element) {
    return 0;
  }

  const rect = element.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const total = viewport + rect.height;
  return Math.min(1, Math.max(0, (viewport - rect.top) / total));
};

const updateScrollMotion = () => {
  ticking = false;
  updateHeader();

  if (motionQuery.matches) {
    return;
  }

  const heroProgress = getSectionProgress(motionTargets.hero);
  const showcaseProgress = getSectionProgress(motionTargets.showcase);
  const waldemarProgress = getSectionProgress(motionTargets.waldemar);
  const cityProgress = getSectionProgress(motionTargets.city);

  root.style.setProperty("--hero-shift", `${heroProgress * 34}px`);
  root.style.setProperty("--hero-scale", `${1 + heroProgress * 0.055}`);
  root.style.setProperty("--hero-content-shift", `${heroProgress * -22}px`);
  root.style.setProperty("--showcase-shift", `${(0.5 - showcaseProgress) * 58}px`);
  root.style.setProperty("--showcase-x", `${(showcaseProgress - 0.5) * 20}px`);
  root.style.setProperty("--showcase-bg-x", `${(0.5 - showcaseProgress) * 10}px`);
  root.style.setProperty("--showcase-bg-y", `${(showcaseProgress - 0.5) * 14}px`);
  root.style.setProperty("--showcase-scale", `${0.965 + showcaseProgress * 0.085}`);
  root.style.setProperty("--showcase-rotate", `${(0.5 - showcaseProgress) * 2.2}deg`);
  root.style.setProperty("--waldemar-shift", `${(0.5 - waldemarProgress) * 48}px`);
  root.style.setProperty("--waldemar-x", `${(0.5 - waldemarProgress) * 18}px`);
  root.style.setProperty("--waldemar-scale", `${0.965 + waldemarProgress * 0.075}`);
  root.style.setProperty("--waldemar-rotate", `${(waldemarProgress - 0.5) * 2}deg`);
  root.style.setProperty("--city-shift", `${(0.5 - cityProgress) * 30}px`);
};

const requestScrollMotion = () => {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(updateScrollMotion);
  }
};

revealTargets.forEach((target) => target.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((target) => observer.observe(target));
updateScrollMotion();
window.addEventListener("scroll", requestScrollMotion, { passive: true });
window.addEventListener("resize", requestScrollMotion);
motionQuery.addEventListener?.("change", requestScrollMotion);

window.addEventListener(
  "pointermove",
  (event) => {
    if (motionQuery.matches) {
      return;
    }

    root.style.setProperty("--spotlight-x", `${(event.clientX / window.innerWidth) * 100}%`);
    root.style.setProperty("--spotlight-y", `${(event.clientY / window.innerHeight) * 100}%`);
  },
  { passive: true }
);

const navToggle = document.querySelector(".nav-toggle");
navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Menü öffnen");
  });
});

document.querySelector("[data-ad-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const button = form.querySelector(".form-submit");
  const status = form.querySelector("[data-form-status]");
  const originalButtonText = button.textContent;

  button.disabled = true;
  button.textContent = "Wird gesendet...";
  status.textContent = "";
  status.classList.remove("is-success", "is-error");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "Die Anfrage konnte nicht gesendet werden.");
    }

    form.reset();
    status.textContent = result.message || "Danke, deine Werbeanfrage wurde gesendet.";
    status.classList.add("is-success");
  } catch (error) {
    status.textContent = error.message || "Die Anfrage konnte nicht gesendet werden.";
    status.classList.add("is-error");
  } finally {
    button.disabled = false;
    button.textContent = originalButtonText;
  }
});

(function initTilt() {
  if (motionQuery.matches) return;
  if (window.matchMedia("(hover: none)").matches) return;

  const cards = document.querySelectorAll(
    ".feature-grid article, .audience-grid article, .team-grid article"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transition = "box-shadow 220ms ease, border-color 220ms ease";
    });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 220ms ease, border-color 220ms ease";
      card.style.transform = "";
    });
  });
}());

document.querySelectorAll(".faq-q").forEach((btn) => {
  const answer = document.getElementById(btn.getAttribute("aria-controls"));
  const isInitiallyOpen = btn.getAttribute("aria-expanded") === "true";

  if (answer) {
    answer.hidden = !isInitiallyOpen;
  }

  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const answer = document.getElementById(btn.getAttribute("aria-controls"));
    const isOpen = item.classList.contains("is-open");
    const shouldOpen = !isOpen;

    item.classList.toggle("is-open", shouldOpen);
    btn.setAttribute("aria-expanded", String(shouldOpen));

    if (answer) {
      answer.hidden = !shouldOpen;
    }
  });
});
