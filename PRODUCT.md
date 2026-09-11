# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
All types of voters and election-information seekers, from experienced voters to first-timers, using the app to get election questions answered and find their polling information.

## Product Purpose
Election Assistant helps users find information about elections — polling locations, registration, and general election questions — through a conversational chat interface, so they can get grounded answers instead of hunting across scattered official sites.

## Positioning
Combines live official data (Google Civic Information API) with conversational AI (Gemini), personalized to the user's specific address, and positioned as a trusted, non-partisan source rather than generic search results.

## Operating Context
- Chat interface at `/chat`, backed by the `/api/chat` route.
- Users enter an address (Google Places Autocomplete or geolocation) to get address-specific polling locations and official links, rendered as structured cards.
- Users can sign in with Google (Firebase Auth) to upload documents/images/PDFs (Firebase Storage) that get inserted into the chat as links for context.
- Dark/light theme toggle; responsive, mobile-friendly layout (Tailwind CSS).

## Capabilities and Constraints
- Built with Next.js (App Router) and TypeScript.
- Depends on Google Civic Information API for polling/official data — effectively scoping coverage to where that API has data.
- Depends on Gemini for chat answers, Google Maps for address autocomplete/geocoding, and Firebase for auth + file storage.
- No hard constraints (e.g. non-partisanship policy, accessibility standard, geographic scope) have been formally set yet — open for future decision.

## Product Principles
1. Ground answers in live official data rather than generic AI knowledge alone.
2. Personalize by address so answers are locally relevant, not generic.
3. Stay a trusted, neutral source of election information.
4. Keep the interface simple and accessible to any type of user, not just power users.
