# WnetrzeAI — AI Virtual Staging

Jedyne polskojęzyczne narzędzie do AI virtual stagingu dla agentów nieruchomości.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI Pipeline**: Replicate (Flux Kontext Pro → FLUX Fill Pro → polish → Real-ESRGAN)
- **Image Processing**: sharp
- **Analytics**: Vercel Analytics
- **Deploy**: Vercel

## Funkcje

- AI Virtual Staging — dodawanie mebli do zdjęć pustych wnętrz
- 6 stylów wnętrz (nowoczesny, skandynawski, klasyczny, industrialny, minimalistyczny, boho)
- 8 typów pomieszczeń
- Before/After slider
- Refinement (poprawki po generacji)
- Feedback loop (JSONL)
- Portfolio gallery z filtrami
- Dark/Light theme
- Free tier (3 rendery/miesiąc) z watermarkiem

## Uruchomienie

```bash
npm install
npm run dev
```

## Zmienne środowiskowe

```
REPLICATE_API_TOKEN=...
DEMO_MODE=true  # opcjonalne, zwraca sample images
```

## Domena

[wnetrzeai.pl](https://wnetrzeai.pl)
