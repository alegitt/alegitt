// Shared header, footer and mobile menu for every page.
// Change your name, email and links here once and every page updates.
const SITE = {
  name: "Alessandro De Cesare",
  email: "aledece60@gmail.com",
  linkedin: "https://www.linkedin.com/in/alessandro-de-cesare-a4843a303",
  github: "https://github.com/alegitt",
};

const PAGES = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["projects.html", "Projects"],
  ["goals.html", "Career Goals"],
  ["resume.html", "Resume", "cta"],
];

(function () {
  const here = location.pathname.split("/").pop() || "index.html";
  const current = here.startsWith("project-") ? "projects.html" : here;

  const header = document.querySelector(".site-header");
  if (header) {
    const links = PAGES.map(([href, label, cls]) => {
      const classes = [cls, href === current ? "active" : ""].filter(Boolean).join(" ");
      return `<a href="${href}"${classes ? ` class="${classes}"` : ""}>${label}</a>`;
    }).join("");
    header.innerHTML = `
      <nav class="nav">
        <a class="nav-brand" href="index.html">${SITE.name}<span>.</span></a>
        <button class="nav-toggle" aria-label="Open menu">Menu</button>
        <div class="nav-links">${links}</div>
      </nav>`;
    header.querySelector(".nav-toggle").addEventListener("click", () =>
      header.querySelector(".nav-links").classList.toggle("open"));
  }

  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <h2>Let's connect</h2>
          <p>Always happy to talk about projects, internships and research.</p>
          <p>${SITE.email}</p>
        </div>
        <div class="links">
          <a href="mailto:${SITE.email}">Email</a>
          <a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
      <small>&copy; ${new Date().getFullYear()} ${SITE.name} · Georgia Institute of Technology</small>`;
  }
})();
