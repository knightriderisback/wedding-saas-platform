# 👑 ÉTERNITÉ — Ultra-Luxury Interactive Wedding Invitation SaaS Platform

> **The Haute Couture of Indian Wedding Tech & Client Operating System**  
> Inspired by palatial Udaipur destination weddings, Bliss & Bone typography, and TyingKnot seamless guest workflows. Built with Next.js 14 App Router, Tailwind CSS, Firebase, Framer Motion, HTML5 Canvas, and jsPDF.

---

## ✨ Features & Innovations

### 1. 💌 Luxury Guest Microsite (`/[weddingSlug]?guest=GuestName`)
- **3D Royal Boxed Envelope:** Unboxing animation featuring watercolor floral liner, gold filigree, and personalized vellum belly band (`"Special Invitation for [GuestName]"`).
- **Interactive 3D Wax Seal:** Broken with realistic wax crackle sound and golden/rose confetti burst.
- **Procedural Sitar & Bansuri Flute Synth:** Classical Indian wedding ambiance synthesized on the fly via Web Audio API (no heavy MP3 lag).
- **Gold Foil Canvas Scratch-to-Reveal Card:** Guests interactively scratch the foil to reveal the wedding date followed by confetti celebration.
- **"Phoolon Ki Barkat" Rose & Marigold Petal Shower:** Floating interactive button releasing fluttering petals across the viewport.
- **Interactive Rasam Cards:** Detailed cards for Haldi, Royal Mehendi, Sacred Pheras, and Imperial Reception with dress palettes, Google Calendar sync, and Google Maps venue link.
- **"How We Met" Story Slider & Couple Trivia:** Interactive milestones slider and 3-question trivia quiz.
- **Pre-Wedding DJ Song Request Box:** Direct crowd song submission stored directly in Firestore.
- **Voice Blessing Recorder:** Microphone recording with instant playback and direct upload to Firebase Cloud Storage.
- **VIP RSVP & Digital Boarding Pass:** Instant boarding pass generation with dynamic QR Code for check-in.

### 2. 📱 Client Management Portal (`/portal/[clientId]`)
- **Web Contact Picker API:** 1-tap phonebook contact import directly from mobile devices (`navigator.contacts.select`).
- **1-Click WhatsApp Dispatch:** Launch personalized `wa.me` invitation link and automatically track sent status.
- **Live DJ Setlist Manager:** View song requests with guest names and phone numbers.
- **1-Click DJ Playlist PDF Export:** Generates letterpress formatted PDF using `jsPDF` for instant WhatsApp sharing with the DJ.
- **Voice Blessings Hub:** Audio player to listen to voice notes recorded by wedding guests.
- **Content & Media Editor:** Edit couple bio, events, dress codes, menus, and upload photos to Cloud Storage.

### 3. 🛡️ Super-Admin Control Center (`/admin`)
- **Client Onboarding:** Create new wedding projects with custom slugs (e.g. `/rohit-weds-priya`).
- **Access Token Generator:** Auto-generates unique client access tokens.
- **Shadow Access (Impersonation Engine):** "Login As Client" 1-click button to directly access and manage any client's portal.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router), React 18
- **Styling:** Tailwind CSS, Custom Royal Alabaster & 24K Gold Foiling tokens
- **Animations:** Framer Motion, HTML5 Canvas, Canvas Confetti
- **Audio:** Web Audio API Procedural Sitar & Bansuri Flute Synthesizer
- **PDF Generation:** jsPDF
- **Backend / Database:** Firebase Firestore & Cloud Storage (with local sync fallback)
- **Deployment:** Vercel & GitHub

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/knightriderisback/wedding-saas-platform.git

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
npm run start
```

---

## 📜 License

Private & Proprietary — ÉTERNITÉ Luxury Wedding Tech.
