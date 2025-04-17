# To-do App Project
- proov 12.53
## Projektist

See projekt sisaldab täisfunktsionaalset To-do rakendust:

- Backend: Node.js + Express + SQLite
- Frontend: React
- Töövood: GitHub Actions (DigitalOcean, Azure, GitHub Pages)

## Käsud arendamiseks

### Lokaalne käivitamine (eeldab Dockerit)

```bash
docker-compose up --build
```

### React frontendi ehitamine

```bash
cd frontend-react
npm install
npm run build
```

## GitHub Actions

Kasutatakse kolme töövoogu:

- `deploy-do.yml` – DockerHub + DigitalOcean App Platform
- `deploy-azure.yml` – Azure Functions
- `deploy-pages.yml` – GitHub Pages (React buildist)

## AI kasutamine

Näited küsimustest:

- "Koosta API päring React komponendis fetch() abil."
- "Lisa kood, mis märgistab to-do tehtuks."
- "Loo testid sqlite CRUD funktsioonidele."

## Hindamine

Hindamine toimub juhendmaterjalis toodud kriteeriumite põhjal.

## Näidispromptid AI-le

Soovin luua õpilastele õppematerjali pööratud klassiruumi põhimõttel. Teemaks on lihtsa To-do rakenduse loomine, kus backend on Node.js + Express + SQLite, frontend on React (lihtne, ühe komponendiga). Rakendus peab toetama GitHub Actions CI/CD lahendusi ning olema võimalik juurutada kolmel moel:

- DigitalOcean App Platform (konteinerid, DockerHub)
- Azure Functions + GitHub Pages
- Kombineeritud (DO backend, GH frontend)

Soovin, et koostad:

- Juhenddokumendi Markdown formaadis
- Koodibaasi ZIP-failina (backend, frontend, docker-compose, workflows)
- README fail õpilastele, mis juhendab, kuidas seda kasutada
- Näited AI abil õppimise ja programmeerimise toetamiseks
- SQLite baasi kasutamine backendis
- Palun kujunda õppematerjal nii, et see sobib hästi kutseõppe tasemele. Hindamiskriteeriumid võiksid sisaldada projektistruktuuri, lokaalse testimise võimekust, CI/CD toimivust, pilvedeploy toimimist ja AI kasutamise refleksiooni.
- Palun tee frontend väga lihtsaks – üks komponent, sisestusvälja ja nupuga, mis kasutab fetch() API-t.

Testin CI/CD