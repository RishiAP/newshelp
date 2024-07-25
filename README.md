# News Website

A modern and responsive news website built with Next.js, MongoDB, and Bootstrap.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [License](#license)

## Demo

Check out the live demo: [News Website](https://your-live-demo-link.com)

## Features

- 📰 Fetch and display the latest news articles
- 🔍 Search functionality
- 📅 Filter articles by date
- 🖼️ Display articles with images and summaries
- 📱 Fully responsive design
- ⚡ Fast performance with Next.js SSR and SSG
- 🎨 Styled with Bootstrap

## Technologies Used

- [Next.js](https://nextjs.org/) - React Framework
- [MongoDB](https://www.mongodb.com/) - NoSQL Database
- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Vercel](https://vercel.com/) - Deployment platform

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/news-website.git
    cd news-website
    ```

2. Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:

    Create a `.env.local` or `.env` file in the root directory and add your MongoDB connection string and other necessary environment variables:

    ```env
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    NEXT_PUBLIC_API_KEY=your_api_key
    ```

4. Run the development server:

    First, run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- **Home Page**: Displays the latest news articles.
- **Search**: Use the search bar to find specific articles.
- **Article Page**: Click on an article to view the full content.
- **Archive Page**: Click on archive links to view archives of a months in that year
- **Admin Panel**: (*Only for Authors or Admins*) Log in to manage articles and content.

## Folder Structure
<details>
<summary>Click to view folder structure</summary>

```
.
├── public
├── src
│   ├── app
│   │   ├── [newsSlug]
│   │   │   └── page.tsx
│   │   ├── admin
│   │   │   └── page.tsx
│   │   ├── admin-login
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── admin-signup
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   ├── admin-login
│   │   │   │   └── route.ts
│   │   │   ├── admin-signup
│   │   │   │   └── route.ts
│   │   │   ├── admin-signup-verify
│   │   │   │   └── route.ts
│   │   │   ├── author_profile
│   │   │   │   └── route.ts
│   │   │   ├── category
│   │   │   │   └── route.ts
│   │   │   ├── create-author
│   │   │   │   └── route.ts
│   │   │   ├── create-category
│   │   │   │   └── route.ts
│   │   │   ├── edit_news
│   │   │   │   └── route.ts
│   │   │   ├── forget-pass
│   │   │   │   └── route.ts
│   │   │   ├── get_archives
│   │   │   │   └── route.ts
│   │   │   ├── get_articles
│   │   │   │   └── route.ts
│   │   │   ├── get_author_articles
│   │   │   │   └── route.ts
│   │   │   ├── get_headlines
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   ├── reset-pass
│   │   │   │   └── route.ts
│   │   │   └── search_articles
│   │   │       └── route.ts
│   │   ├── archives
│   │   │   └── [year]
│   │   │       └── [month]
│   │   │           ├── layout.tsx
│   │   │           └── page.tsx
│   │   ├── categories
│   │   │   └── [category]
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── privacy-policy
│   │   │   └── page.tsx
│   │   ├── reset-pass
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── terms-of-services
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminNavbar.tsx
│   │   ├── AuthorUpdateModal.tsx
│   │   ├── BootstrapClient.tsx
│   │   ├── ContentLoadSpinner.tsx
│   │   ├── CreateCategoryModal.tsx
│   │   ├── EmailTemplate.tsx
│   │   ├── Footer.tsx
│   │   ├── ImageCropper.tsx
│   │   ├── ImageHandleModal.tsx
│   │   ├── LogoutModal.tsx
│   │   ├── MainWindow.tsx
│   │   ├── Navbar.tsx
│   │   ├── NewsCard.tsx
│   │   ├── NewsCRUDComponent.tsx
│   │   ├── NewsItem.tsx
│   │   ├── SearchModal.tsx
│   │   ├── SideElement.tsx
│   │   ├── SuperAdminCreateModals.tsx
│   │   ├── ThemeChanger.tsx
│   │   └── TopNews.tsx
│   ├── database
│   │   └── dbConfig.ts
│   ├── helpers
│   │   ├── common_func.ts
│   │   ├── mailer.ts
│   │   └── sanity.ts
│   ├── models
│   │   ├── AuthorModel.ts
│   │   └── NewsModel.ts
│   └── middleware.ts
├── .env
├── .eslintrc.json
├── .gitignore
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```
</details>