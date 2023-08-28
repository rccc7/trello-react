# Trello - React.

A Trello like app with functionality to create tasks and categorize them in three different categories: To Do, In progress, and Done. The user can add and/or delete the tasks in each category as well as move the tasks among the categories according the their state with Drag and Drop functionality powered by [beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd). The tasks, their categories, and their order are stored in a database powered by
[https://cloud.appwrite.io/](AppWrite Cloud).

See it: https://trello-react-psi.vercel.app/

## Screenshots:

<div align="center">
  <img src="screenshots/Trello-React.jpg" alt="screenshot" width="700" style="width:700px;"/>
</div>

## Technologies:

The following technologies, dependencies, and services were used to make this app:

- ReactJS.
- NextJS.
- TailwindCSS.
- [AppWrite Cloud](https://cloud.appwrite.io/). A secure open-source backend platform which provides a set of secure APIS, tools and a management console UI to help build apps quickly. Features used: database and file storage.
- [React-Beautiful-DND](https://github.com/atlassian/react-beautiful-dnd). A beatiful and accessible drag and drop library for lists with React.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
