# Darias Design Dashboard - Creative Event Management Console

<p align="center">
  <img src="assets/banner.svg" alt="dariasdesign-dashboard Banner" width="100%">
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react" alt="React 19"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS"></a>
  <a href="https://headlessui.com"><img src="https://img.shields.io/badge/Headless_UI-2.x-66E3FF?style=for-the-badge&logo=headlessui" alt="Headless UI"></a>
  <a href="https://www.radix-ui.com"><img src="https://img.shields.io/badge/Radix_UI-1.x-black?style=for-the-badge&logo=radix-ui" alt="Radix UI"></a>
  <a href="https://turbo.build"><img src="https://img.shields.io/badge/Turbopack-Enabled-0070F3?style=for-the-badge&logo=vercel" alt="Turbopack"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License"></a>
</p>

---

## 📖 Overview

**dariasdesign-dashboard** is Darias Design Dashboard (`dariasdesign-dashboard`) is an administrative management console developed with Next.js 15 Turbopack, React 19, Headless UI, and Radix UI. Built for event organizers and workshop hosts, the console facilitates masterclass event creation, ticket inventory monitoring, attendee roster management, and order analytics.

---

## ⚡ Key Features

- 📅 **Workshop & Event Administration:** Create, publish, and edit creative workshop listings, venue details, and itineraries.
- 🎟️ **Ticket Inventory Controls:** Configure early-bird, VIP, and general admission tiers with dynamic stock quotas.
- 👥 **Attendee Registry & Check-In:** Monitor attendee registrations, download participant manifests, and verify ticket validity.
- 📊 **Financial & Sales Analytics:** Overview of ticket sales, revenue projections, and capacity utilization rates.
- 🎨 **Modern Dashboard UX:** Built with Headless UI dialogs and menus, Radix UI modals, and Lucide React iconography.
- 🛡️ **Admin Role Guards:** Protected dashboard layouts ensuring restricted access to administrative controls.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    AdminUser[Workshop Host / Admin] -->|Next.js App Router| RootLayout[Dashboard App Router]

    subgraph Auth ["Authentication Guard"]
        RootLayout --> AuthLayout['(auth)' Login & Recovery]
        RootLayout --> DashLayout['(dashboard)' Protected Shell]
    end

    subgraph Management ["Administrative Consoles"]
        DashLayout --> Overview[Overview & Revenue Metrics]
        DashLayout --> EventMgmt[Workshop Event CRUD]
        DashLayout --> TicketMgmt[Ticket Inventory & Pricing]
        DashLayout --> AttendeeMgmt[Attendee Manifest & Check-In]
    end

    subgraph API ["Backend Connectivity"]
        DashLayout --> REST[Darias Design Backend REST API]
    end
```

---

## 📂 Directory Structure

```text
.
├── src/
│   ├── app/
│   ├── components/
│   └── ...
├── assets/
│   └── banner.svg
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

---

## 🛠️ Tech Stack & Dependencies

| Layer / Library | Version | Description |
|---|---|---|
| **Next.js** | `v15.2 (Turbopack)` | Modern App Router framework |
| **React** | `v19.x` | Concurrent React component engine |
| **Tailwind CSS** | `v3.4` | Modern design system utility styles |
| **Headless UI** | `v2.2` | Accessible UI components for dropdowns and popovers |
| **Radix UI** | `v1.2` | High-fidelity accordion, dialog, and avatar primitives |
| **Lucide React** | `v1.x` | Modern minimalist iconography |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root based on the provided sample:

```bash
cp .env.example .env
```

Configurable variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME="Darias Design Dashboard"
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or higher recommended)
- Package Manager (`npm`, `yarn`, or `pnpm`)

### Installation

```bash
# Clone repository
git clone https://github.com/shahjalal-labs/dariasdesign-dashboard.git
cd dariasdesign-dashboard

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
# or for backend services
npm run start:dev
```

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
