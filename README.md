# Interactive Portfolio

Responsive React portfolio inspired by the Apple Watch honeycomb app grid. It uses floating circular project bubbles, a frosted-glass detail panel, editable placeholder data, and a clean contact section.

## Stack

- React
- Vite
- Tailwind CSS

## Project structure

- `src/App.jsx`: main layout and interaction logic
- `src/data/projects.js`: editable placeholder content for projects and categories
- `src/index.css`: Tailwind entry file
- `public/headshot_chris.jpg`: profile image used in the center bubble

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL Vite prints in the terminal.

## Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Edit the content

- Update project titles, roles, tools, descriptions, and category assignments in `src/data/projects.js`.
- Replace `public/headshot_chris.jpg` with your preferred headshot.
- Update the contact and resume links in `src/App.jsx`.

## Deploy to Vercel

1. Push this project to GitHub.
2. In Vercel, choose **Add New Project**.
3. Import the repository.
4. Keep the default settings for a Vite app:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**.

For future updates, push new commits to the connected branch and Vercel will redeploy automatically.
