# Cognifer


Cognifer is a lightweight, explainable financial intelligence app for SACCOs and fintechs. This repo contains a FastAPI backend and a React/Next frontend.


## 1) Project layout
## 2) Run locally


### Backend (FastAPI)


```bash
cd app
python -m venv .venv
. .venv/bin/activate # on Windows use `.venv\Scripts\activate`
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 10000
```
The backend exposes endpoints under /api (e.g. /api/book-call). Set env vars listed in .env.example before running.

### Frontend (Next.js or React)
```cd frontend
npm ci
npm run dev
# or for a production build
npm run build
npm run start
```
### Deployment
- Frontend: Vercel (connect GitHub repo, point project root to /frontend).
- Backend: Render (create Web Service, point to /app, start command uvicorn app.main:app --host 0.0.0.0 --port 10000).
- Domain: register a .co.ke or .com domain; use Cloudflare for DNS; add records to point www to Vercel and api to Render.
- Email: Use Brevo / SendGrid for transactional emails (set BREVO_API_KEY in your host's env vars).

### CI

This repo includes a basic GitHub Actions workflow at .github/workflows/ci.yml that installs dependencies and runs frontend build + backend tests.

### Contact

Project owner: David (Cognifer) Email: info@cognifer.co.ke 

---


## 4) `LICENSE` (MIT)


```text
MIT License


Copyright (c) 2025 Cognifer


Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.