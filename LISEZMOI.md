# Course de 30 foulées

## Mettre en ligne sur Netlify (sur un ordinateur)

1. Décompressez ce dossier.
2. Ouvrez le Terminal (Mac) ou l'Invite de commandes (Windows) dans le dossier `course-30-foulees`.
3. Tapez `npm install`, puis Entrée.
4. Tapez `npx netlify-cli deploy --prod`, puis Entrée.
5. Connectez-vous à Netlify quand la page s'ouvre, puis choisissez de créer un nouveau site.

Le glisser-déposer de Netlify (Netlify Drop) ne fait pas fonctionner l'envoi des résultats.

## En classe

- Le tableau : `https://votre-site.netlify.app`
- Les élèves : ils scannent le code QR affiché au tableau (adresse `https://votre-site.netlify.app/?eleve`).

## Fichiers

- `index.html` : la page (tableau et écran élève)
- `netlify/functions/resultats.mjs` : reçoit et renvoie les résultats
- `netlify.toml`, `package.json` : configuration Netlify
