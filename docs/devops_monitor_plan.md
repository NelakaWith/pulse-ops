# 🚀 DevOps Monitor Dashboard

A modern **Next.js (App Router)** dashboard visualizing **GitHub repository metrics** such as deployments, commits, and workflow runs.  
Built with **TypeScript, Tailwind CSS, shadcn/ui, lucide-react, and Recharts** to demonstrate real-world frontend architecture.

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| Framework | **Next.js 15 (App Router)** | Routing, SSR/ISR, API routes |
| Language | **TypeScript** | Type safety and scalability |
| Styling | **Tailwind CSS + shadcn/ui** | Modern responsive UI |
| Icons | **lucide-react** | Lightweight, clean icon set |
| Charts | **Recharts** | Data visualization |
| API | **GitHub REST API** | Fetch workflow runs, commits, and repo stats |

---

## 🎯 Features

- 📊 **Metrics Overview** – Cards showing stars, forks, latest deployment status, and CI results.  
- 🧠 **Repository Insights** – Charts for commit activity and workflow success rate.  
- 🔄 **Recent Deployments** – Table of latest workflow runs fetched from the GitHub Actions API.  
- 🌗 **Dark/Light Mode** – Seamless theming powered by shadcn/ui and Tailwind.  
- ⚡ **Server-Side Data Fetching** – Uses Next.js server components and caching for fast loads.  
- 🧱 **Modular Architecture** – Reusable UI components for cards, charts, and tables.

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   └── github/
│   │       └── route.ts          # Proxy to GitHub REST API
│   └── dashboard/
│       ├── page.tsx              # Main dashboard page
│       ├── components/
│       │   ├── MetricsCards.tsx
│       │   ├── DeploymentsTable.tsx
│       │   ├── CommitChart.tsx
│       │   └── RepoSelector.tsx
│       └── hooks/
│           └── useGithubData.ts
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── ThemeToggle.tsx
├── lib/
│   ├── github.ts                  # API logic
│   └── utils.ts
├── styles/
│   └── globals.css
├── types/
│   └── github.ts                  # TypeScript interfaces
└── env.d.ts
```

---

## ⚙️ API Integration

### 🔗 GitHub REST Endpoints
Fetch data using a **personal access token** (PAT) stored in `.env.local`:

```
GITHUB_TOKEN=ghp_your_token_here
```

#### Example Endpoints:
- **Repo Details:** `GET /repos/{owner}/{repo}`
- **Commits:** `GET /repos/{owner}/{repo}/commits`
- **Workflow Runs:** `GET /repos/{owner}/{repo}/actions/runs`

These will be proxied via `/api/github/*` to keep tokens safe.

---

## 💅 UI Design
- **Sidebar Layout**: Navigation for Dashboard, Repositories, and Settings.  
- **Dashboard Grid**: 2x2 layout for metric cards and charts.  
- **Color Palette**: Tailwind’s neutral + emerald tones for tech feel.  
- **Icons**: lucide-react for consistent line icons.  
- **Charts**: Recharts LineChart + BarChart components with smooth transitions.

---

## 🔄 Data Flow

```
Client (React Components)
↓
useGithubData Hook
↓
Next.js API Route (/api/github)
↓
GitHub REST API
↓
Cache & render in Server Components
```

---

## 🧠 Future Enhancements

- 🧩 Add multiple repo support (dropdown selection)
- 📈 Add pipeline duration trend graph
- 🔔 Integrate notifications for failed workflows
- 💾 Add local caching with Zustand or React Query
- 🧭 Expand to include Railway or Vercel deployment metrics

---

## 🧰 Setup

```bash
# 1. Create the project
npx create-next-app@latest devops-monitor --typescript --tailwind

# 2. Install dependencies
cd devops-monitor
npm install recharts lucide-react @radix-ui/react-icons class-variance-authority tailwind-variants
npx shadcn-ui@latest init

# 3. Add shadcn components
npx shadcn-ui add card table button chart tabs theme-toggle

# 4. Add environment variable
echo "GITHUB_TOKEN=ghp_xxx" > .env.local

# 5. Run the dev server
npm run dev
```

---

## 📸 Demo Goals

The final project should:

* Load real GitHub data (commits, runs, etc.)
* Render server-side charts and cards
* Include dark mode + responsive layout
* Showcase clean, scalable code and API integration

---

## 🧾 Licensing & Credit

* Icons: [lucide.dev](https://lucide.dev)
* Charts: [Recharts](https://recharts.org/)
* UI: [shadcn/ui](https://ui.shadcn.com/)