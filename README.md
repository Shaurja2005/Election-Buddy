# Election Assistant

Election Assistant is a web application built with [Next.js](https://nextjs.org/) to help users find information about elections, including polling locations and general election queries through an intuitive chat interface.

## Features

- **Interactive Chat Interface**: Ask questions about elections, voting processes, and candidates.
- **Polling Locations**: Enter your address to find your designated polling stations and voting information.
- **Dark/Light Mode**: Built-in theme toggling for accessibility and user preference.
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: React Hooks & functional components

## Getting Started

### Prerequisites

- Node.js 18.x or later installed on your machine.
- npm, yarn, or pnpm package manager.

### Installation

1. Clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd Election-Assistant
```

2. Install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

This project requires certain API keys to function correctly (e.g., for the chat bot backend and polling location data). 

Please see the [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) file in the root directory for detailed instructions on how to acquire and configure your environment variables securely.

### Running the Development Server

Start the application in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The chat interface can be accessed directly or via the `/chat` route.

## Project Structure

- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`: Reusable React components (Chat bubbles, Address inputs, Sidebar, etc.).
- `src/hooks/`: Custom React hooks (e.g., `useChatHistory`).
- `src/types/`: TypeScript definitions.

## License

This project is licensed under the MIT License.
