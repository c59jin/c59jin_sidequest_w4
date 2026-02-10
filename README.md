## Project Title

GBDA302 Week 4 Example 1: Grid + Static Maze

---

## Authors

Catarina Jin - c59jin - 21077832

---

## Description

Gridbound is a tile-based navigation game built using p5.js. The player moves through a grid-based level using keyboard controls, collects word tokens, and reaches a goal tile to complete each level.

The game uses structured level data stored in JSON format, allowing dynamic placement of tiles, obstacles, and words using loops. This approach makes the game scalable and modular.

Core mechanics include: Grid-based movement, Collision detection (walls), Collectible word tiles, Goal unlocking condition (all words must be collected), Automatic loading of a second level

The player experience focuses on: Spatial awareness, Sequential task completion. Increasing challenge across levels, Simple, accessible interaction design

The second level increases complexity by introducing tighter pathways and more strategic word placement.

---

## Setup and Interaction Instructions

How to Run:

Open the project folder in Visual Studio Code.

Use Live Server or open index.html in a browser.

The game will load automatically.

Controls:

Arrow Keys (↑ ↓ ← →)
or

WASD keys

Move one tile at a time on the grid.

Objective:

Collect all word tiles.

Once all words are collected, move to the goal tile.

The next level loads automatically.

Complete both levels to finish the game.

---

## Iteration Notes

a. Post-Playtest: Changes Made

Based on peer playtesting feedback, the following changes were implemented:

Improved Goal Feedback
Players were confused about why the goal did not activate. A message was added to clearly indicate that all words must be collected before unlocking the goal.

Adjusted Player Visibility
The player color was modified for stronger contrast against floor tiles to improve visual clarity.

Reduced Movement Speed
Movement was restricted to one tile per key press to prevent accidental overshooting.

---

b. Post-Showcase: Planned Improvements

Add Visual Progress Indicator
A visual progress bar or collection counter UI element will be added for better feedback.

Add Sound Feedback
Sound effects will be implemented for word collection and level completion to enhance player engagement.

---

## Assets

The code was written by me but they used GenAI to write the comments.

---

## References

Friedman, B., Hendry, D. 2019. Value Sensitive Design: Shaping Technology with Moral Imagination. MIT Press.

---
