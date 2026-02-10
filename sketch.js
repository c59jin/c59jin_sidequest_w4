/*
Week 4 — Grid + JSON Levels + Loops + Auto Level Switch
Based on the professor’s static grid render example. :contentReference[oaicite:1]{index=1}

Controls:
- Arrow keys or WASD to move 1 tile at a time

Goal:
- Collect all WORD tiles, then step on GOAL to finish the level
- Level 2 loads automatically after Level 1 is finished
*/

const TS = 32; // tile size

// Tile IDs (legend)
const TILE = {
  FLOOR: 0,
  WALL: 1,
  WORD: 2,
  GOAL: 3,
};

// ---------- LEVEL DATA (JSON) ----------
const levels = [
  {
    name: "Level 1",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    // player start (grid coords)
    start: { r: 1, c: 1 },

    // OPTIONAL: words (text) are placed by reading WORD tiles in the grid.
    // We map each WORD tile found (in scan order) to one string.
    words: ["MAP", "KEY"],
  },

  {
    name: "Level 2",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
      [1, 2, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: { r: 9, c: 1 },
    words: ["TRUST", "WATERLOO"], // will be assigned to WORD tiles found
  },
];

// ---------- GAME STATE ----------
let levelIndex = 0;
let grid = null;
let player = { r: 1, c: 1 };
let wordTiles = []; // {r,c,text,collected}
let goalPos = { r: -1, c: -1 };
let statusText = "";

// movement throttling (avoid moving too fast while key is held)
let movedThisPress = false;

function setup() {
  textFont("sans-serif");
  textSize(14);
  noStroke();

  loadLevel(0);
}

function draw() {
  background(240);

  renderGrid();
  renderHUD();
  renderPlayer();

  // If level finished, show status and auto advance after a short pause
  if (statusText.startsWith("✅")) {
    // do nothing else (player can’t move once finished)
    return;
  }

  handleMovement();
}

function loadLevel(i) {
  levelIndex = i;
  const lvl = levels[levelIndex];

  grid = deepCopy2D(lvl.grid);

  // resize canvas to match grid
  createCanvas(grid[0].length * TS, grid.length * TS);

  // reset player
  player.r = lvl.start.r;
  player.c = lvl.start.c;

  // scan grid to find WORD tiles + GOAL tile (dynamic placement via loops)
  wordTiles = [];
  goalPos = { r: -1, c: -1 };

  let wordIndex = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === TILE.WORD) {
        const txt =
          lvl.words && lvl.words[wordIndex] ? lvl.words[wordIndex] : "WORD";
        wordTiles.push({ r, c, text: txt, collected: false });
        wordIndex++;
      }
      if (grid[r][c] === TILE.GOAL) {
        goalPos = { r, c };
      }
    }
  }

  statusText = `Collect all words, then reach the goal. (${lvl.name})`;
  movedThisPress = false;
}

function renderGrid() {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const t = grid[r][c];

      // base tile fill
      if (t === TILE.WALL) fill(30, 50, 60);
      else fill(230);

      rect(c * TS, r * TS, TS, TS);

      // extra visuals for WORD / GOAL (drawn with loops too)
      if (t === TILE.GOAL) {
        fill(255, 215, 0);
        rect(c * TS + 6, r * TS + 6, TS - 12, TS - 12, 6);
      }
    }
  }

  // draw word tiles + their text (only if not collected)
  for (const w of wordTiles) {
    if (w.collected) continue;

    // word tile marker
    fill(120, 180, 255);
    rect(w.c * TS + 4, w.r * TS + 4, TS - 8, TS - 8, 6);

    // word label
    fill(0);
    textAlign(CENTER, CENTER);
    text(w.text, w.c * TS + TS / 2, w.r * TS + TS / 2);
  }

  // reset alignment for HUD
  textAlign(LEFT, BASELINE);
}

function renderPlayer() {
  // player as a circle centered in the tile
  fill(200, 60, 80);
  circle(player.c * TS + TS / 2, player.r * TS + TS / 2, TS * 0.65);
}

function renderHUD() {
  fill(0);
  const lvlName = levels[levelIndex].name;
  const remaining = wordTiles.filter((w) => !w.collected).length;

  text(`${lvlName}`, 10, 18);
  text(`Words left: ${remaining}`, 10, 36);
  text(statusText, 10, 54);

  // small hint
  text("Move: Arrow keys / WASD", 10, height - 10);
}

function handleMovement() {
  const anyKeyDown =
    keyIsDown(LEFT_ARROW) ||
    keyIsDown(RIGHT_ARROW) ||
    keyIsDown(UP_ARROW) ||
    keyIsDown(DOWN_ARROW) ||
    keyIsDown(65) ||
    keyIsDown(68) ||
    keyIsDown(87) ||
    keyIsDown(83);

  if (!anyKeyDown) {
    movedThisPress = false;
    return;
  }
  if (movedThisPress) return;

  let dr = 0,
    dc = 0;

  // Arrow keys
  if (keyIsDown(LEFT_ARROW)) dc = -1;
  else if (keyIsDown(RIGHT_ARROW)) dc = 1;
  else if (keyIsDown(UP_ARROW)) dr = -1;
  else if (keyIsDown(DOWN_ARROW)) dr = 1;
  // WASD
  else if (keyIsDown(65))
    dc = -1; // A
  else if (keyIsDown(68))
    dc = 1; // D
  else if (keyIsDown(87))
    dr = -1; // W
  else if (keyIsDown(83)) dr = 1; // S

  tryMove(dr, dc);
  movedThisPress = true;
}

function tryMove(dr, dc) {
  const nr = player.r + dr;
  const nc = player.c + dc;

  // bounds check
  if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;

  // wall collision
  if (grid[nr][nc] === TILE.WALL) return;

  // move
  player.r = nr;
  player.c = nc;

  // collect word if standing on a WORD tile position
  for (const w of wordTiles) {
    if (!w.collected && w.r === player.r && w.c === player.c) {
      w.collected = true;
      statusText = `Picked up: ${w.text}`;
      break;
    }
  }

  // finish condition: all words collected + standing on GOAL
  const remaining = wordTiles.filter((w) => !w.collected).length;
  if (remaining === 0 && player.r === goalPos.r && player.c === goalPos.c) {
    finishLevel();
  } else if (
    player.r === goalPos.r &&
    player.c === goalPos.c &&
    remaining > 0
  ) {
    statusText = `Goal is locked. Collect all words first! (${remaining} left)`;
  }
}

function finishLevel() {
  statusText = `✅ Level complete! Loading next level...`;

  // auto-load next level
  const next = levelIndex + 1;
  if (next < levels.length) {
    setTimeout(() => loadLevel(next), 700);
  } else {
    statusText = `✅ All levels complete!`;
  }
}

// Utility: safe copy of 2D array
function deepCopy2D(arr) {
  return arr.map((row) => row.slice());
}
