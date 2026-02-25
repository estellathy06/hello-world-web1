---
name: UI Development
description: Guidelines and instructions for generating and editing User Interface components, styles, and layouts.
---

# UI Skills Document

## Overview
This document outlines the styling principles, color palettes, typography, and animation standards for the Estella Tang Portfolio project. The overarching aesthetic is a **"Hacker / Mathematical Terminal"**—resembling an interactive UNIX-style command line with high-contrast, multi-coded outputs.

## Core Aesthetic Principles
1. **Authentic Terminal Feel**: The user experience should mimic a real command line. Hidden input fields are used alongside custom-rendered pseudo-cursors. Command history persists upwards.
2. **Minimalist & High Contrast**: A near-black background combined with bright, distinct terminal colors (green, cyan, yellow, magenta).
3. **Immersive Effects**: Subtle visual distortions (like CRT scanlines and screen flickers) trick the user into feeling like they are looking at physical retro hardware.

## Tech Stack & Approach
- **Framework**: React + Vite
- **Styling**: Pure **Vanilla CSS** (`index.css` and `App.css`). Do *not* use utility frameworks like Tailwind or heavy component libraries like Material UI.
- **Variables**: Rely on native CSS custom properties (variables) defined in `:root` for maintaining the color palette.

## Color Palette
Defined as CSS variables in `index.css`:
- **Background**: `--bg-color` (`#0d0d0d`) - Deep almost-black.
- **Primary Text**: `--text-primary` (`#00ff00`) - Classic Hacker Green.
- **Secondary Text**: `--text-secondary` (`#aaaaaa`) - Muted grey for descriptions.
- **Highlights**:
  - Cyan: `--text-cyan` (`#00ffff`) - Used for prompts and structural dividers.
  - Yellow: `--text-yellow` (`#ffff00`) - Used for key terms and command accents.
  - Magenta: `--text-magenta` (`#ff00ff`) - Used for identity tags and contact labels.
  - Red: `--text-red` (`#ff3333`) - Used for error messages.
  - Blue: `--text-blue` (`#3388ff`) - Used for headers and interactive links.

## Typography
- **Monospace Required**: The primary font is **Fira Code**, which supports coding ligatures.
- **Base Style**: Hardcoded to `16px` font-size, `1.5` line-height, with absolutely no browser-default margins or paddings on `body` or `*`.

## Components & Visual Effects
1. **The CRT Overlay**: 
   - A `::after` pseudo-element on `body` provides a fixed, transparent linear-gradient scanline pattern using `pointer-events: none`.
2. **Flicker Animation**:
   - The `#root` element has a subtle CSS keyframe opacity animation (`0.15s` infinite) to simulate electron beam inconsistency.
3. **The Cursor**:
   - Rendered using a `<span>` styled as a block (`width: 10px`, `height: 1.2em`) that blinks using step-end keyframes (`0% to 100%`).
4. **Scrollbars**:
   - Customized `::-webkit-scrollbar` matching the terminal color scheme (black track, green thumb that turns cyan on hover).

## UI Development Rules
- **No pure white text by default**: Default text is always `--text-primary`. Switch to white only for specific output data values using `.text-white`.
- **Links**: Anchor tags (`<a>`) inside the terminal should not use standard underlines. They should use a dashed bottom border matching `--text-blue` and visually invert colours on hover.
- **Layouts**: Use Flexbox extensively (`display: flex`) for maintaining linear, history-based command rendering. Vertical scrolling is handled strictly by the main `#root` inner container.
