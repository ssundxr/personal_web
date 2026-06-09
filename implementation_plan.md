# The Sunder Journey: Architecture & CMS Plan

## 1. The CMS: Sanity.io
We will implement **Sanity.io** as the core CMS. It provides the "Portable Text" block-content structure needed to seamlessly embed Map Markers and Video checkpoints directly into your writing flow. You'll get a professional, enjoyable dashboard to write your journals while seeing the map context.

## 2. Platform Structure

### Experience A: The Professional Portfolio
We will strictly **maintain your current minimalist aesthetic**. The portfolio will act as the clean surface layer featuring:
1. **Hero:** Minimalist introduction.
2. **Projects:** Showcasing your software.
3. **Education & Experience**
4. **Achievements**
5. **Let's Connect**

*The Hook:* A micro-animated button "Enter the journey of Sunder" that transitions the user into the New World.

### Experience B: The Journal (The New World)
*   **Physics-Based Timeline:** We will use physics concepts (spring dynamics, inertia, gravity snap-points) via `Framer Motion` / `React Spring` for the timeline. Dragging and interacting with the timeline will feel organic and weighty, snapping to important life events which then link to the respective blogs.
*   **The Archive View:** Medium-style cards representing your journals.
*   **Scrollytelling Reading Experience:** 
    *   Left side: Blog text.
    *   Right side: The interactive map. 
    *   As the user scrolls, the map automatically flies to new coordinates matching the paragraph they are reading, and relevant media (images/videos) fade in and autoplay.

## Proposed Execution Steps
1. **Initialize Sanity:** Run `npm create sanity@latest` inside your monorepo to set up the admin studio.
2. **Define Schemas:** Create the specific data structures for `Journal`, `Timeline Events`, and the `MapMarker` block.
3. **Update Portfolio Surface:** Refactor the main landing page to include only the requested sections while keeping the exact current aesthetic.
4. **Build the Journal Interface:** Implement the scrollytelling logic, the physics-based timeline, and the Mapbox integration.

## User Review Required
The physics-based timeline and strict adherence to your current aesthetic have been integrated. 

Please approve this final plan, and I will execute **Step 1** (installing Sanity) and **Step 3** (updating your portfolio page structure) immediately.
