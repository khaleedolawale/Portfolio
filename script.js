// ── CURSOR GLOW ──
const glow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ── FADE IN ON SCROLL ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add("visible"), i * 80);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

// ── SKILL BARS ──
const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll(".skill-bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
        barObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll("#skills").forEach((el) => barObserver.observe(el));

// ── GITHUB REPOS ──
async function loadGitHubRepos() {
  const grid = document.getElementById("projectsGrid");
  const loading = document.getElementById("ghLoading");
  try {
    const res = await fetch(
      "https://api.github.com/users/khaleedolawale/repos?sort=updated&per_page=6"
    );
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();
    loading.remove();

    if (!repos.length) return;

    repos.slice(0, 4).forEach((repo) => {
      if (repo.fork) return;
      const tags = [repo.language, ...(repo.topics || [])]
        .filter(Boolean)
        .slice(0, 4);
      const card = document.createElement("div");
      card.className = "project-card fade-up";
      card.innerHTML = `
            <div class="project-card-inner">
              <div class="project-card-top">
                <div class="project-icon">📁</div>
                <div class="project-links">
                  <a href="${repo.html_url}" target="_blank" rel="noopener">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.68.82.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    GitHub
                  </a>
                  ${
                    repo.homepage
                      ? `<a href="${repo.homepage}" target="_blank" rel="noopener">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Live
                  </a>`
                      : ""
                  }
                </div>
              </div>
              <h3>${repo.name.replace(/-/g, " ")}</h3>
              <p>${
                repo.description ||
                "A project by Khaleed — see GitHub for details."
              }</p>
              <div class="project-tags">
                ${tags
                  .map((t) => `<span class="project-tag">${t}</span>`)
                  .join("")}
                <span class="project-tag">★ ${repo.stargazers_count}</span>
              </div>
            </div>`;
      grid.appendChild(card);
      observer.observe(card);
    });
  } catch {
    loading.innerHTML = `<span style="color:var(--text3);font-size:12px">
          Could not load GitHub repos. <a href="https://github.com/khaleedolawale" target="_blank" style="color:var(--accent)">View directly on GitHub →</a>
        </span>`;
  }
}

loadGitHubRepos();

// ── CONTACT FORM (SPA feedback — Netlify handles the real POST) ──
const form = document.querySelector(".contact-form");
const status = document.getElementById("formStatus");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector("button[type=submit]");
  btn.textContent = "Sending…";
  btn.disabled = true;
  try {
    const data = new FormData(form);
    const res = await fetch("/", { method: "POST", body: data });
    if (res.ok) {
      status.className = "form-status success";
      status.textContent = "✓ Message sent! I'll get back to you soon.";
      form.reset();
    } else throw new Error();
  } catch {
    status.className = "form-status error";
    status.textContent =
      "✗ Something went wrong. Please try emailing me directly.";
  }
  btn.textContent = "Send Message";
  btn.disabled = false;
});
