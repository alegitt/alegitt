// Step through the maze solver example. The robot is drawn like an iRobot Create 3.
(function () {
  const root = document.getElementById("maze-demo");
  if (!root) return;

  const S = 100, PAD = 30;          // cell size and padding in SVG units
  const BASE = [[2, 1, 0], [3, 2, 1], [4, 3, 2]];   // starting costs [row][col]
  const OUTER = [[0, 0, 3, 0], [3, 0, 3, 3], [0, 3, 3, 3], [0, 0, 0, 3]];
  const TRUE_WALLS = OUTER.concat([[2, 0, 2, 1], [1, 1, 2, 1], [1, 2, 2, 2], [2, 2, 2, 3]]);
  const HEAD = { N: 0, E: 90, S: 180, W: 270 };

  // Each frame: robot cell [col,row], heading, walls added this step, cost changes, caption
  const FRAMES = [
    { at: [0, 2], h: "N", add: [[0, 2, 0, 3]], text: "Start. The robot only knows the wall on its left. Every cell starts with its distance to the END as its cost." },
    { at: [0, 1], h: "N", add: [[0, 1, 0, 2]], text: "Forward and right both cost 3. On a tie it picks the leftmost path, so it moves forward." },
    { at: [0, 0], h: "N", add: [[0, 0, 0, 1], [0, 0, 1, 0]], text: "Another tie at cost 2. It moves forward again and senses two walls." },
    { at: [1, 0], h: "E", add: [[1, 0, 2, 0], [2, 0, 2, 1], [1, 1, 2, 1]], cost: { "0,0": 4, "1,0": 5 }, text: "It turns right toward the cheapest cell. Three new walls show this is a dead end, so the costs update and two cells go up (red)." },
    { at: [0, 0], h: "W", add: [], text: "The only way out is back. It turns around and returns to the corner." },
    { at: [0, 1], h: "S", add: [], text: "It heads down to the cell with cost 3." },
    { at: [1, 1], h: "E", add: [[1, 2, 2, 2]], text: "It turns toward the cheapest unvisited cell (cost 2) and senses a wall on its right." },
    { at: [2, 1], h: "E", add: [[3, 1, 3, 2]], text: "It moves forward to cost 1 and senses the wall in front of it." },
    { at: [2, 0], h: "N", add: [], text: "It turns toward cost 0 and reaches the END in 8 moves." },
  ];

  const size = S * 3 + PAD * 2;
  const P = (v) => PAD + v * S;

  function grid() {
    let g = "";
    for (let i = 1; i < 3; i++) {
      g += `<line x1="${P(i)}" y1="${P(0)}" x2="${P(i)}" y2="${P(3)}" stroke="#d3dde8" stroke-width="2"/>`;
      g += `<line x1="${P(0)}" y1="${P(i)}" x2="${P(3)}" y2="${P(i)}" stroke="#d3dde8" stroke-width="2"/>`;
    }
    return g + `<rect x="${P(0)}" y="${P(0)}" width="${S * 3}" height="${S * 3}" fill="none" stroke="#d3dde8" stroke-width="2"/>`;
  }
  const walls = (list) => list.map(([a, b, c, d]) =>
    `<line x1="${P(a)}" y1="${P(b)}" x2="${P(c)}" y2="${P(d)}" stroke="#1d2430" stroke-width="7" stroke-linecap="round"/>`).join("");
  const labels = () =>
    `<text x="${P(0) - 4}" y="${P(3) + 24}" font-size="17" fill="#1d2430">START</text>` +
    `<text x="${P(3) + 4}" y="${P(0) - 8}" font-size="17" fill="#1d2430" text-anchor="end">END</text>`;

  function robot(col, row, h) {
    const cx = P(col) + S / 2, cy = P(row) + S / 2;
    return `<g transform="translate(${cx} ${cy}) rotate(${HEAD[h]})">
      <circle r="36" fill="#f4f6f8" stroke="#1d2430" stroke-width="3"/>
      <path d="M -30 -18 A 35 35 0 0 1 30 -18" fill="none" stroke="#1d2430" stroke-width="6" stroke-linecap="round"/>
      <circle r="15" fill="#1d2430"/>
      <circle r="10" fill="none" stroke="#3fd27b" stroke-width="3"/>
      <circle cy="-27" r="4.5" fill="#eaaa00"/>
    </g>`;
  }

  function costsFor(i) {
    const c = BASE.map((r) => r.slice()), red = {};
    for (let k = 0; k <= i; k++) {
      const ch = FRAMES[k].cost || {};
      for (const key in ch) { const [x, y] = key.split(",").map(Number); c[y][x] = ch[key]; red[key] = true; }
    }
    return { c, red };
  }

  function mapSVG(i) {
    const f = FRAMES[i];
    const known = FRAMES.slice(0, i + 1).flatMap((fr) => fr.add);
    const { c, red } = costsFor(i);
    let nums = "";
    for (let r = 0; r < 3; r++) for (let col = 0; col < 3; col++) {
      if (col === f.at[0] && r === f.at[1]) continue;
      nums += `<text x="${P(col) + S / 2}" y="${P(r) + S / 2 + 10}" text-anchor="middle" font-size="30" font-weight="700" fill="${red[col + "," + r] ? "#c0392b" : "#003057"}">${c[r][col]}</text>`;
    }
    const here = c[f.at[1]][f.at[0]];
    const badge = `<text x="${P(f.at[0]) + S - 10}" y="${P(f.at[1]) + 24}" text-anchor="end" font-size="20" font-weight="700" fill="${red[f.at.join(",")] ? "#c0392b" : "#003057"}">${here}</text>`;
    return `<svg viewBox="0 0 ${size} ${size + 10}" role="img" aria-label="Robot's map, step ${i + 1}">
      ${grid()}${nums}${walls(known)}${robot(f.at[0], f.at[1], f.h)}${badge}${labels()}</svg>`;
  }

  const trueSVG = `<svg viewBox="0 0 ${size} ${size + 10}" role="img" aria-label="The actual maze">${grid()}${walls(TRUE_WALLS)}${labels()}</svg>`;

  root.innerHTML = `
    <div class="maze-panels">
      <div><div class="maze-title">What the robot knows</div><div class="maze-map"></div></div>
      <div><div class="maze-title">The actual maze</div>${trueSVG}</div>
    </div>
    <p class="maze-caption"></p>
    <div class="maze-controls">
      <button class="btn" data-step="-1">← Back</button>
      <span class="maze-count"></span>
      <button class="btn solid" data-step="1">Next →</button>
    </div>`;

  let i = 0;
  const map = root.querySelector(".maze-map"), cap = root.querySelector(".maze-caption"), cnt = root.querySelector(".maze-count");
  function show() {
    map.innerHTML = mapSVG(i);
    cap.textContent = FRAMES[i].text;
    cnt.textContent = `Step ${i + 1} of ${FRAMES.length}`;
    root.querySelector('[data-step="-1"]').disabled = i === 0;
    root.querySelector('[data-step="1"]').disabled = i === FRAMES.length - 1;
  }
  root.querySelectorAll("[data-step]").forEach((b) => b.addEventListener("click", () => {
    i = Math.min(FRAMES.length - 1, Math.max(0, i + Number(b.dataset.step))); show();
  }));
  show();
})();
