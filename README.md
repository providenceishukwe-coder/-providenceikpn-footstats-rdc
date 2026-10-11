# Providenceikpn FootStats RDC — Version 2

## Ce qui est prêt
- Site responsive en français, adapté au mobile.
- Tableau de bord pour matchs, filtres (aujourd'hui, en direct, à venir, terminés) et classements.
- Emplacements pour fiches de matchs.
- Gestion d'erreur si l'API n'est pas configurée.
- Exemples visuels clairement marqués comme fictifs.

## Important
Le site n'affiche pas de scores réels tant qu'une clé API valide et un serveur ne sont pas configurés. Ne remplacez pas les exemples fictifs par des données non vérifiées. Cette version est destinée aux statistiques et à l'information sportive, pas aux paris.

## Source de données suggérée
La documentation officielle de football-data.org décrit les endpoints `/v4/matches`, `/v4/competitions/{id}/standings` et `/v4/matches/{id}` :
https://www.football-data.org/documentation/quickstart
Vérifiez les compétitions couvertes, les limites, les délais de mise à jour et les conditions de licence de votre compte avant de choisir le fournisseur. Certaines ligues locales en RDC peuvent ne pas être couvertes.

## Démarrer localement
1. Installer Node.js 18 ou plus récent.
2. Ouvrir un terminal dans ce dossier.
3. Exécuter `npm init -y`
4. Exécuter `npm install express dotenv`
5. Créer un fichier `.env` contenant `FOOTBALL_DATA_TOKEN=VOTRE_CLE_API`
6. Lancer `node server.js`
7. Ouvrir `http://localhost:3000`

Ne publiez jamais votre clé API dans le HTML, un dépôt public ou une capture d'écran. Le serveur la conserve côté serveur.

## Mise en ligne — méthode simple
1. Choisir un hébergeur Node.js qui prend en charge les variables d'environnement et HTTPS.
2. Envoyer `index.html`, `server.js` et `package.json` (généré par npm) dans un dépôt privé ou dans l'espace de déploiement.
3. Dans les paramètres de l'hébergeur, ajouter `FOOTBALL_DATA_TOKEN` comme variable secrète. Ne pas envoyer le fichier `.env` en ligne.
4. Définir la commande de démarrage `node server.js`.
5. Activer HTTPS, puis tester `/api/matches` et `/api/standings?competition=PL`.
6. Vérifier les fuseaux horaires, les limites d'API, les erreurs et la date de dernière mise à jour.
7. Avant de partager le site, tester sur un téléphone et expliquer clairement les compétitions couvertes.

## Pour une version de production
- Mettre en cache les réponses (par exemple 30–60 secondes pour les scores, plus longtemps pour les classements) afin de respecter les limites du fournisseur.
- Ajouter une page de fiche de match qui appelle `/api/match/:id`.
- Ajouter des tests et une surveillance des erreurs.
- Vérifier les droits d'utilisation des logos, noms, photos et données sportives.
- Afficher la source et l'heure de la dernière mise à jour sur chaque vue.


## Déploiement guidé sur Render
1. Créez un compte sur Render et un compte auprès de football-data.org. Vérifiez la couverture des compétitions, les limites du forfait et les conditions d'utilisation.
2. Sur votre ordinateur, décompressez le ZIP. Créez un dépôt Git privé et ajoutez les fichiers du dossier, sauf `.env` (ce fichier ne doit jamais être publié).
3. Sur Render, choisissez **New + → Web Service**, connectez votre dépôt Git, puis indiquez `npm install` comme commande de construction et `npm start` comme commande de démarrage. Le fichier `render.yaml` peut aussi servir de référence.
4. Dans les variables d'environnement du service Render, ajoutez `FOOTBALL_DATA_TOKEN` avec votre clé API. Ne la partagez pas dans un message ou une capture d'écran.
5. Lancez le déploiement. Quand Render fournit l'URL HTTPS, ouvrez-la et testez le tableau de bord, puis `/api/matches`, `/api/standings?competition=PL` et une fiche de match.
6. Si l'API répond par une erreur, consultez les journaux Render, confirmez que la clé est valide et que le forfait donne accès à l'endpoint demandé.
7. Vérifiez les données avant d'annoncer publiquement que les scores sont en direct. Le service gratuit et les limites du fournisseur peuvent entraîner des délais ou des interruptions.

**Limite importante :** je ne peux pas créer les comptes, accepter les conditions d'un hébergeur, obtenir votre clé API, ni appuyer sur le bouton de publication à votre place depuis cette conversation. Il faut que vous réalisiez ces étapes dans vos propres comptes. Ne transmettez pas votre mot de passe ni votre clé secrète à un tiers.
