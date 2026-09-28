# ForgeFit Gym Workout App

A responsive gym and workout web application with:

- Exercise library by category
- Guided workout screen with step-by-step instructions
- Timed exercise and rest modes
- Stopwatch session tracking
- Set/reps progress tracking
- Daily streak badge and workout history
- Local storage persistence

## Run locally

Open `index.html` directly in a browser or use a simple local web server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Tech used

- HTML5
- Tailwind CSS
- Vanilla JavaScript

## Project structure

```text
gym-workout-app/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Notes

This version stores workout history and streak data in `localStorage` for quick offline use. It is ready for future upgrade to React/Next.js or a backend database like Supabase or Firebase.
