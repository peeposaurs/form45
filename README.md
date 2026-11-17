# Form - 45 (Pakistani Election Night Horror)

A 90s PS1-style 3D survival-horror browser game built with Three.js and Web Audio.

Survive from **10:00 PM to 06:00 AM** across three constituencies (**NA-47 Islamabad**, **NA-128 Lahore**, **NA-241 Karachi**): scan and upload all 30 Form-45s while defending the polling station against Khaki and Babu, keeping Chacha Chowkidar awake with chai, and repairing power/Wi-Fi sabotage.

## Files
- `index.html` — Game shell, CRT/HUD styling, menus, settings, pause modal, and wire/router minigames
- `world3d.js` — Three.js 3D polling station, CCTV zones, props, and character models
- `game.js` — Core game loop, AI pathing, Form-45 scanning/stamping/uploading, CCTV, and cutscenes
- `audio.js` — Web Audio synthesizer, spatial footsteps, Urdu voice lines, and media volume/pause controls
- `audio_catalog.js` & `audio.html` — Soundboard & audio asset catalog
- `icons.js` — Inline SVG HUD icons
- `assets/` — Audio, video cutscenes, and textures

## Running Locally
Run any static HTTP server in this folder (required for `fetch` / Web Audio / videos):

```bash
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080` (or the port printed by `serve`).

## Controls
- **Mouse / Touch Swipe:** Look around the office (Left Door / Desk / Right Window)
- **`Q` / `E`:** Left Door Light / Right Window Light
- **`1` / `2`:** Toggle Left Iron Door / Right Window Shutter
- **`Space`:** Open / Close CCTV Monitor
- **`Esc` / `P`:** Pause / Resume
- **`H`:** Toggle In-Game HUD
- **`F9`:** Start / Stop Screen Recording
- **Click / Hold 3D Objects:** Grab Form-45 from ballot box, stamp (Level 3), scan on left desk, brew chai, or use the wall hammer to repair barriers

## Contributing
Pull requests and issues are welcome! Fork the repo, make your changes on a branch, and open a Pull Request.

## License
Licensed under the [MIT License](LICENSE).
