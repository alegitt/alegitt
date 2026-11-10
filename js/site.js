// Shared header, footer and mobile menu for every page.
// Change your name, email and links here once and every page updates.
const SITE = {
  name: "Your Name",
  email: "you@gatech.edu",
  linkedin: "https://www.linkedin.com/in/your-profile",
  github: "https://github.com/alegitt",
};

const PAGES = [
  ["index.html", "Home"],
  ["about.html", "About Me"],
  ["projects.html", "Projects"],
  ["resume.html", "Resume"],
  ["goals.html", "Career Goals"],
];

(function () {
  const here = location.pathname.split("/").pop() || "index.html";
  const current = here.startsWith("project-") ? "projects.html" : here;

  const header = document.querySelector(".site-header");
  if (header) {
    const links = PAGES.map(([href, label]) =>
      `<a href="${href}"${href === current ? ' class="active"' : ""}>${label}</a>`).join("");
    header.innerHTML = `
      <nav class="nav">
        <a class="nav-brand" href="index.html">${SITE.name}</a>
        <button class="nav-toggle" aria-label="Open menu">Menu</button>
        <div class="nav-links">${links}</div>
      </nav>`;
    header.querySelector(".nav-toggle").addEventListener("click", () =>
      header.querySelector(".nav-links").classList.toggle("open"));
  }

  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML = `
      <h2>Let's Connect</h2>
      <p>I am always happy to talk about projects, internships and research.</p>
      <div class="links">
        <a href="mailto:${SITE.email}">${SITE.email}</a>
        <a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a>
      </div>
      <small>&copy; ${new Date().getFullYear()} ${SITE.name}. Georgia Institute of Technology.</small>`;
  }

  document.querySelectorAll("[data-site]").forEach((el) => {
    el.textContent = SITE[el.dataset.site];
  });
  document.title = document.title.replace("Your Name", SITE.name);
})();
