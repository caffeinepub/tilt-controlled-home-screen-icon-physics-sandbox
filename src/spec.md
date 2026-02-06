# Specification

## Summary
**Goal:** Build a single-page, in-browser “home screen” physics sandbox where app icons fall, tip, slide, and roll based on device tilt (or equivalent desktop controls).

**Planned changes:**
- Render a home-screen-like simulation area with a wallpaper background and a grid of app icons.
- Implement lightweight 2D physics for icons: tilt-derived gravity, screen-bound constraints, edge collisions, and icon-to-icon collisions with damping.
- Add DeviceOrientation tilt input on supported mobile/tablet browsers, including an iOS/iPadOS permission request flow and a clear denied/unavailable state.
- Provide desktop controls to set the tilt/gravity direction (without sensors) plus a Reset action to re-center tilt and restore icons to the initial grid.
- Apply a coherent visual theme across the simulation and controls, avoiding a blue/purple-dominant palette.
- Add and load generated static assets (wallpaper + a small set of app icons) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can open a web page that looks like a phone home screen and watch the icons roll around realistically when they tilt their device (or adjust tilt on desktop), with a Reset button to restore the neat grid.
