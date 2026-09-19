# ReVive AI Assistant

Build a stunning, premium, mobile-first web app UI for a product called “ReVive”.

ReVive is an AI-powered DIY repair assistant web app that helps users troubleshoot broken household products and electronics such as phones, kettles, lamps, fans, and other common items. The app should feel polished, modern, highly engaging, and app-like, with a premium glassmorphism aesthetic.

IMPORTANT GOAL:

Design an exceptional UI/UX that feels like a high-end startup product, with smooth flows and beautiful visuals. The design should feel modern, youthful, clean, and memorable. Make it feel like a web app people would want to save to their home screen and use often.

DESIGN STYLE:

- Premium glassmorphism UI

- Frosted glass cards

- Soft gradients in the background

- Elegant blur, transparency, subtle borders, and layered depth

- Rounded corners and smooth shadows

- Clean typography

- Minimal but visually rich

- Apple-like / modern startup vibe

- Smooth micro-interactions and hover/tap states

- Dark theme by default with beautiful accent colors

- Optional light mode support if easy, but prioritize dark mode polish

BRAND:

- App name: ReVive

- Tagline: “Fix smarter. Waste less.”

- Theme keywords: sustainable, smart, modern, repair, eco-tech, premium

CORE PRODUCT IDEA:

Users can:

1. Select or describe a broken product

2. Upload an image or choose a product category

3. Get AI-generated repair guidance

4. See a repair safety level (safe / caution / do not DIY)

5. Follow step-by-step guidance

6. Save repair attempts

7. View repair history

8. Optionally install the app to home screen

TARGET EXPERIENCE:

- Feels like a real startup MVP

- Mobile-first, but responsive on desktop

- Should look amazing on iPhone and Android screens

- Must look like a proper app, not a generic website

MAKE THIS A PWA:

This is a web app that should be installable / addable to the home screen.

Please structure the project and UI to support PWA expectations:

- App-like layout

- Mobile shell / app container feel

- Include support for a manifest

- Include service worker setup placeholder / structure

- Include install experience UI

- Add an “Install App” or “Add to Home Screen” prompt/button in the UI

- Consider top safe areas / bottom safe areas for mobile

- Use a standalone app-like navigation structure

- The app should feel natural when opened from home screen

INFORMATION ARCHITECTURE / SCREENS:

Create the following polished pages/screens:

1. Landing / Welcome screen

- Beautiful hero section

- App name ReVive

- Short description of the product

- CTA buttons:

  - “Start Repair”

  - “Install App”

- Premium glass visual design

- Small trust badges like:

  - “AI-guided”

  - “Repair smarter”

  - “Reduce waste”

2. Home / Dashboard

- Friendly greeting

- Search or input bar: “What needs fixing?”

- Quick category chips/cards:

  - Phone

  - Kettle

  - Fan

  - Lamp

  - Blender

  - Other

- “Recent repairs”

- “Suggested repairs”

- “Repair safety tips”

- Bottom navigation for mobile

3. Repair Diagnosis Flow

- Step-based flow

- Step 1: choose category

- Step 2: describe problem

- Step 3: upload image

- Step 4: AI analysis loading state

- Step 5: result screen

The flow should feel intuitive and premium.

4. AI Result Screen

Show:

- Product name

- Detected issue

- Safety level:

  - Safe to try

  - Caution

  - Avoid DIY / seek professional help

- Step-by-step repair guidance

- Estimated difficulty

- Time estimate

- Tools needed

- Sustainability impact card, e.g. “Repairing instead of replacing helps reduce waste”

- CTA buttons:

  - “Save Repair”

  - “Start Over”

  - “Install App”

5. Repair History Screen

- List of previous repair attempts

- Each item in a glass card

- Product icon/image

- Date

- Status

- Tap for details

6. Safety / Help Screen

- Clear warning UI

- Explain that dangerous electrical or battery-related issues should not be attempted at home

- Nicely designed alert cards

- FAQ section

7. Profile / Settings Screen

- User avatar placeholder

- Theme toggle

- Notification preferences placeholder

- Install App section

- About ReVive

- Terms / disclaimer placeholder

PWA / INSTALL UX:

Include a polished “Install ReVive” card or modal:

- Explain benefits:

  - Quick access

  - App-like experience

  - Faster reopen

- CTA button: “Add to Home Screen”

- For iPhone, include a small helper card explaining how to add to home screen if needed

- Include install banner placeholder logic/UI

MOBILE NAVIGATION:

Use a beautiful bottom navigation with icons:

- Home

- Repair

- History

- Safety

- Profile

COMPONENTS TO INCLUDE:

- Glass cards

- Gradient buttons

- Beautiful inputs

- Upload area

- Progress indicators

- Loading skeletons / AI analysis loader

- Empty states

- Toast / notification style

- Friendly microcopy

MICROCOPY TONE:

- Friendly

- Reassuring

- Smart

- Modern

- Slightly youthful

- Clear and simple

Do not sound overly robotic.

TECH / IMPLEMENTATION PREFERENCES:

- Build as a responsive React-style modern web app UI

- Use reusable components

- Keep the code clean and structured

- Prioritize frontend UI and UX

- Use placeholder/demo data where necessary

- Keep architecture ready for future backend integration

- Do not overcomplicate backend logic

- Focus on polished UI, UX, component structure, and app shell

IMPORTANT VISUAL DETAILS:

- Dark premium background with layered gradients

- Frosted panels with subtle border and blur

- Smooth, elegant spacing

- Rich but not cluttered

- High-quality iconography

- Mobile screens should feel immersive and polished

- The final result should look like a product from a funded startup

PLEASE GENERATE:

- A fully designed frontend web app UI

- Multiple screens/pages/components

- Mobile-first responsive layout

- PWA-ready structure and install UI

- Beautiful glassmorphism design system

- High-end polished presentation

Do not make it look like a generic admin dashboard.

Do not make it plain or boring.

Make it feel premium, engaging, app-like, and memorable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9fe52ee9-c7be-4c15-9230-e8142ccc0a4b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
