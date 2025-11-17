# Dream Palette

A simple web app to capture and visualize your dreams.

## Getting Started

### Installation

First, install the dependencies:

```bash
npm install
```

### Setting Up Your API Key

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your OpenAI API key:
   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Create a new API key
   - Copy the key

3. Open the `.env` file and replace `your_api_key_here` with your actual API key:
   ```
   VITE_OPENAI_API_KEY=sk-your-actual-key-here
   ```

**Important:** Never commit your `.env` file to git! It's already in `.gitignore`.

### Running the App

Start the development server:

```bash
npm run dev
```

Then open your browser and visit the URL shown in the terminal (usually `http://localhost:5173`).

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

- `src/App.tsx` - Main app component with the input form
- `src/components/NightCard.tsx` - Component that displays the generated night card
- `src/api/analyzeNight.ts` - API function that calls OpenAI to analyze dreams
- `src/types.ts` - TypeScript type definitions
- `src/main.tsx` - Entry point of the application
- `index.html` - HTML template
- `.env.example` - Example environment file (copy to `.env` and add your API key)

