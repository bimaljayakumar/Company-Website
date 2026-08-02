# 🚀 Company Website — DO Company

A modern, high-performance **3D company website** built with **React**, **TypeScript**, **Three.js**, **GSAP**, and **WebGL**.

> Live preview: https://www.redoyanulhaque.me/

---

## ✨ Highlights

- 3D / WebGL experience powered by **Three.js**
- Smooth animations with **GSAP**
- Modern **React + TypeScript** codebase
- Fast, responsive UI (desktop + mobile)
- AI chat integration via **Groq API**
- Contact form via **Web3Forms**

---

## 🧰 Tech Stack

React · TypeScript · Three.js · GSAP · TailwindCSS · Vite · Vercel

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/bimaljayakumar/Company-Website.git
cd Company-Website
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Fill in your actual API keys in .env
```

### 4. Run locally

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and set your keys:

| Variable | Description |
|---|---|
| `VITE_WEB3FORMS_ACCESS_KEY` | Web3Forms access key for contact form |
| `GROQ_API_KEY` | Groq API key for AI chat (server-side only) |

> ⚠️ Never commit `.env` — it is already in `.gitignore`

---

## 🧩 Customize

- **Company info** → `src/config.ts`
- **Projects list** → `src/config.ts` → `projects`
- **Social links** → `src/config.ts` → `contact`
- **SEO meta** → `index.html`

---

## 🪪 License

MIT License — see [LICENSE](LICENSE)
