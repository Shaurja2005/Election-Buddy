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

Create a `.env.local` file in the project root with the following variables:

```
# Gemini (chat AI)
GEMINI_API_KEY=your_gemini_api_key_here

# Google Civic Information API (polling locations and official links)
GOOGLE_CIVIC_API_KEY=your_google_civic_api_key_here

# Google Maps (address autocomplete and geocoding, optional but recommended)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Firebase (Auth + Storage)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

> Note: `.env.local` is ignored by git. Do not commit it.

#### Firebase Setup (Auth + Storage)

1. Create a Firebase project in the Firebase console.
2. Add a Web App and copy the config values into the `NEXT_PUBLIC_FIREBASE_*` keys above.
3. Enable **Authentication**:
	 - Go to Authentication -> Sign-in method -> Enable **Google** provider.
	 - Add `http://localhost:3000` to Authorized domains for local dev.
4. Enable **Storage**:
	 - Go to Storage -> Create a bucket.
	 - For local development, use test mode or add rules that allow authenticated users to upload.
5. Restart the dev server after updating `.env.local`.

#### Other API Keys

- **Gemini API**: Create a key at https://aistudio.google.com/app/apikey and set `GEMINI_API_KEY`.
- **Google Civic Information API**:
	1. Create or select a Google Cloud project.
	2. Enable the *Google Civic Information API*.
	3. Create an API key and set `GOOGLE_CIVIC_API_KEY`.
- **Google Maps API** (optional but recommended for autocomplete):
	1. Enable the *Maps JavaScript API* and *Geocoding API*.
	2. Create an API key and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

See [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for a quick reference list.

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

## Core Functionality Guide

1. **Enter an address**
	- The address bar uses Google Places Autocomplete when a Maps key is configured.
	- You can also use the geolocate button to reverse-geocode your current location.
2. **Ask election questions**
	- Messages are sent to the `/api/chat` route.
	- The server pulls live Civic API data when available, then uses Gemini to answer.
3. **View official links and polling locations**
	- If the Civic API returns links or polling locations, the UI renders them as structured cards.
4. **Sign in with Google**
	- Auth is handled through Firebase Authentication.
	- Sign-in status is shown in the header and used for uploads.
5. **Upload documents**
	- Signed-in users can upload images or PDFs to Firebase Storage.
	- Uploaded files are inserted into the chat input as a link.

## Project Structure

- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`: Reusable React components (Chat bubbles, Address inputs, Sidebar, etc.).
- `src/hooks/`: Custom React hooks (e.g., `useChatHistory`).
- `src/types/`: TypeScript definitions.

## License

This project is licensed under the MIT License.
