# 3D Space Folio 🌌

A fully immersive 3D portfolio themed around space: a scroll-driven flight from Earth to Neptune, one planet per section. Built with React + WebGL/Three.js.

- Live: [3d-space-folio.vercel.app](https://3d-space-folio.vercel.app) 🚀
- My main (fast, mobile-friendly) portfolio: [matmuszarski.space](https://www.matmuszarski.space)

## Navigating the experience

- Mouse wheel / trackpad, arrow keys, Page Up / Page Down, Space, Home / End
- Swipe up and down on touch screens (landscape works best on phones)
- The bottom navigation jumps straight to any section, the top bar has the CV and the contact form
- In the projects section, scrolling, swiping or ← / → go through the project cards first

## Development

```bash
yarn
yarn dev          # http://localhost:5173 (add #debug to the URL for the Leva panel and r3f-perf)
yarn build
yarn lint
yarn translate    # extract and compile the Lingui catalogs (src/locales)
```

Content (experience, certificates, projects, links) lives in `src/lib/constants.tsx`, the camera stops and navigation chapters in `src/lib/sections.ts`.

### Fonts

The emoji font is subset to the emojis used in `src/`, the 3D title font to its letters. After adding a new emoji or changing the 3D title, regenerate them:

```bash
pip install fonttools brotli lxml
python scripts/subset-fonts.py
```

## Acknowledgements

- [Three.js](https://threejs.org/)
- [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [React Three Drei](https://drei.docs.pmnd.rs/getting-started/introduction)
- [React Three Postprocessing](https://react-postprocessing.docs.pmnd.rs/introduction)
- [React](https://react.dev/)
- [GSAP](https://gsap.com/)
- [EmailJS](https://emailjs.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Lingui](https://lingui.dev/)
- [Vite](https://vite.dev/)
- [Tailwind](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## License

[MIT](https://choosealicense.com/licenses/mit/)
