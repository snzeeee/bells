# BELLS — Build Handoff

> **Document autonome pour une session Claude Code fraîche.** Lis-le en entier
> avant d'écrire la moindre ligne. Tout le contexte nécessaire est ici ; tu n'as
> besoin d'aucun autre fichier du labo pour commencer.
>
> Date : 23 juillet 2026. Auteur : session de cadrage avec Tommy.
> Nom validé par Tommy : **Bells**. Vérifier la disponibilité du domaine et des
> handles au moment du lancement (bells.xyz, getbells.xyz, etc. — proposer des
> options si le premier choix est pris).

---

## 1. Le produit en dix secondes

> **Une cloche unique est mise aux enchères chaque jour.
> Quand l'enchère se termine, la cloche sonne.
> Une cloche = une voix.
> Les membres votent ce que la trésorerie achète : des Stock Tokens
> (TSLA, AAPL, SPY…) sur Robinhood Chain.**

Tagline : **« One bell rings every day. »** — écho direct à la cloche
d'ouverture de Wall Street, le rituel boursier que tout le monde connaît.

C'est un **rebrand pur et dur de Nouns** (https://nouns.wtf/) : on reprend le
produit complet — enchère quotidienne, NFT génératif, gouvernance, trésorerie,
exécution onchain — on change l'identité et une poignée de surfaces, et on
oriente la trésorerie vers l'achat de Stock Tokens sur Robinhood Chain.

Le spectacle appartient déjà au produit source : l'objet du jour en immense, le
compte à rebours, les enchères qui tombent, la trésorerie publique. On ne
reconstruit rien de ce cœur.

## 2. Décisions verrouillées (ne pas rediscuter)

1. **Rebrand pur** : le monorepo Nouns est la base. On ne réécrit ni les
   contrats, ni le frontend. On configure, on rebrand, on ajoute une couche
   mince. Toute envie de « refaire proprement » un module qui marche est une
   erreur.
2. **Testnet Robinhood Chain uniquement.** Aucun déploiement mainnet.
3. **Stock Tokens simulés, clairement étiquetés.** Voir §3.
4. **Le nom est Bells.** L'objet génératif est une cloche.
5. **La DA change légèrement** : nouvelle identité (nom, logo, palette,
   typographie, traits de l'objet génératif), mais la structure des pages et
   les layouts de nouns.wtf sont conservés.
6. **Budget zéro hors gas testnet.** Pas d'API payante, pas de cloud payant.
   Vercel free tier pour le front, machine locale ou process node pour
   l'indexeur.

## 3. Cadre légal et honnêteté — À RESPECTER STRICTEMENT

- Les vrais Stock Tokens Robinhood sont juridiquement des instruments donnant
  une exposition économique à des actions (https://robinhood.com/rhj/stocktokens/).
  Une communauté qui en achète collectivement via une trésorerie gouvernée
  ressemble à un véhicule d'investissement → **interdiction absolue de
  lancement public mainnet sans travail juridique**. Ce n'est pas notre sujet :
  on livre un prototype testnet.
- Sur le testnet, les Stock Tokens seront des **mocks ERC-20 déployés par nous**
  (ex. symbole `sTSLA`, nom `Tesla — simulated`). L'UI doit afficher de façon
  visible et permanente que : (a) c'est un testnet, (b) les tokens sont simulés,
  (c) rien n'a de valeur. Un bandeau discret mais permanent suffit.
- **Jamais de fausse activité présentée comme réelle.** Si des bids de
  démonstration sont générés par un script, l'UI les affiche normalement mais le
  bandeau testnet couvre l'ensemble ; ne jamais prétendre à une communauté
  réelle dans la copy.

## 4. La source : nouns-monorepo

Repo : https://github.com/nounsDAO/nouns-monorepo — actif, licence **GPL-3.0**
(code) et artwork **CC0**. Audité en juillet 2026 : le frontend exact de
nouns.wtf est dedans et build, les 122 fichiers Solidity compilent, SDK, assets
et indexeur inclus.

Structure (vérifiée) :

| Package | Rôle |
| --- | --- |
| `packages/nouns-contracts` | Contrats : NFT + descriptor/seeder (art onchain), Auction House, Governor, Timelock/trésorerie |
| `packages/nouns-webapp` | Le frontend de nouns.wtf — Vite, React, Tailwind, wagmi, Lingui, GraphQL codegen |
| `packages/nouns-assets` | PNG des traits + données run-length encodées |
| `packages/nouns-sdk` | Hooks React et utilitaires d'interaction contrats |
| `packages/nouns-api` | Indexeur Ponder.sh (données historiques servies en GraphQL) |
| `packages/nouns-subgraph` | Déprécié — ignorer |

Commandes de base : `pnpm install`, `pnpm build` à la racine ; version Node
dans `.nvmrc` ; gestionnaire **pnpm** obligatoire.

Webapp en local : `cp .env.example.local .env` puis `pnpm start` dans
`packages/nouns-webapp`. Un simnet local se lance via
`cd packages/nouns-contracts && pnpm task:run-local` (Hardhat, chainId 31337).
Des templates `.env.example` et `.env.sepolia` montrent comment cibler une
autre chaîne : **c'est le modèle à suivre pour Robinhood testnet** (adresses de
contrats et RPC pilotés par variables d'environnement).

### Obligations de licence (non négociables)

- **GPL-3.0** : notre fork doit être publié en source ouverte sous GPL-3.0,
  avec les en-têtes de licence conservés. Créer un repo public
  (ex. `snzeeee/bells`) dès le début et y committer tout le travail.
- **Marque** : ne conserver aucun usage du nom « Nouns », des logos ou des
  liens nouns.wtf dans le produit final (mentions de licence dans le README
  exceptées, où l'attribution est au contraire requise).
- **Artwork CC0** : réutilisable légalement, mais on remplace les traits par
  les nôtres (voir §10) — c'est un choix d'identité, pas une contrainte légale.

## 5. Ce qu'on garde / change / supprime

### Gardé tel quel (ne pas toucher à la logique)

- Contrats : Auction House (enchère quotidienne, settlement), NFT token +
  descriptor + seeder (génération onchain), Governor + Timelock (propositions,
  votes, exécution, trésorerie). **Zéro modification de logique Solidity** —
  seulement les paramètres de déploiement et les constantes de branding.
- Frontend : structure des pages, composant enchère (hero + countdown + bids),
  pages gouvernance (liste des props, page de vote), wallet connect, le
  pipeline d'affichage de l'objet génératif.
- Indexeur Ponder : tel quel, pointé sur notre chaîne.

### Changé

1. **Chaîne** : tout est déployé sur Robinhood Chain testnet (§6). Liens
   d'explorer → Blockscout Robinhood testnet.
2. **Identité** : nom (**Bells**), logo, copy, palette, typographie, favicon,
   meta tags, et **nouveaux traits** pour la cloche générative (§10).
3. **Paramètres de démo** (§8) : cadence d'enchère raccourcie, délais de
   gouvernance raccourcis.
4. **Nouvelle surface : le portefeuille de la trésorerie** (§9) — module
   visible sur la home sous l'enchère : liste des Stock Tokens détenus,
   quantités, valeur estimée, historique des achats exécutés.
5. **Nouvelle surface : formulaire de proposition « Buy Stock Token »** (§7) —
   un formulaire simplifié qui construit la calldata du swap pour l'utilisateur
   au lieu du formulaire de proposition brut.
6. **La copy de gouvernance** : orientée « quel stock la trésorerie achète »
   plutôt que grants/funding.

### Supprimé (masqué de l'UI, contrats intacts si livrés par les scripts)

- Pages et liens culturels Nouns : Nouncil, candidates/Prop House, page fork
  DAO, explore/traits gallery, playground (garder le playground est optionnel
  — utile pour tester les traits, mais le retirer de la nav publique).
- Langues Lingui autres que l'anglais (garder EN seul ; simplification).
- Tout lien sortant vers nouns.wtf, discord Nouns, etc.

## 6. Robinhood Chain testnet — configuration

Robinhood Chain est une L2 EVM (stack Arbitrum Orbit). Les paramètres exacts
(RPC, chainId, explorer, faucet) **doivent être vérifiés au démarrage** — ne
rien coder en dur sans vérification :

- **Source de vérité locale** : le repo `snzeeee/rig` (clonable via
  `gh repo clone snzeeee/rig`) contient déjà un profil de chaîne
  `robinhood-testnet` fonctionnel (RPC + chainId) utilisé par un projet
  précédent de Tommy. Récupérer la config là-bas en priorité.
- Explorer : instance Blockscout du testnet Robinhood (URL dans la même config
  ou via la doc publique Robinhood Chain).
- **Wallet de déploiement** : générer un wallet neuf (`cast wallet new`),
  le financer au faucet du testnet. Ne jamais committer la clé. (Un ancien
  wallet `rh-deployer` existe sur une autre machine — ne pas en dépendre.)
- Uniswap est officiellement déployé sur Robinhood Chain **mainnet**
  (https://blog.uniswap.org/robinhood-chain-is-live). Sa présence sur le
  **testnet** est incertaine → vérifier ; le plan par défaut (§7) n'en dépend
  pas.

Étape de validation obligatoire avant tout le reste : déployer un contrat
trivial sur le testnet, le voir sur Blockscout, confirmer gas/RPC stables.

## 7. La couche Stock Tokens (le seul vrai ajout)

Objectif : que la boucle complète soit **réellement exécutable onchain** —
proposition → vote → exécution → la trésorerie détient le token — sans rien
simuler hors chaîne.

1. **Mocks** : déployer 4-6 ERC-20 simples : `sTSLA`, `sAAPL`, `sSPY`,
   `sNVDA`… (18 decimals, nom `<Company> — simulated`). Mint initial vers un
   contrat de liquidité.
2. **Vente/échange** : deux options, dans l'ordre de préférence :
   - **Option A (défaut, robuste)** : déployer un AMM minimal type Uniswap V2
     (factory + router + paires, code open source archi-éprouvé, léger) et
     seeder des pools natif/sToken avec des prix vraisemblables. La trésorerie
     achète via `swapExactETHForTokens` (adapter au token de gas du testnet).
   - **Option B (si Uniswap officiel existe sur le testnet)** : utiliser le
     router officiel — mais seulement s'il est réellement déployé et si on peut
     créer nos pools de mocks dessus.
3. **Le problème d'expiration des quotes, résolu par construction** : une
   proposition de gouvernance met des jours (ou minutes en démo) entre création
   et exécution. On n'encode donc **jamais un montant de sortie exact** dans la
   calldata : on encode `amountOutMin` comme **limite de prix** (ex. quote au
   moment de la création − 5 % de tolérance) et une `deadline` généreuse.
   Si le prix a trop bougé, l'exécution revert proprement — comportement
   honnête et explicable dans l'UI.
4. **Formulaire « Buy Stock Token »** dans la webapp : l'utilisateur choisit
   token + montant + tolérance ; le formulaire construit la calldata
   (`router.swapExactETHForTokens(...)` depuis le Timelock) et la soumet via le
   flux de proposition standard du Governor. C'est un habillage du formulaire
   de proposition existant, pas un nouveau système.
5. **Prix affichés** (portefeuille, §9) : lire le spot des pools AMM
   directement onchain. Pas d'oracle externe, pas d'API de prix.

## 8. Paramètres de démo

But : que la scène vive quand quelqu'un visite le site, sans mentir.

- **Enchère** : durée raccourcie — recommandation **1 heure** (au lieu de 24 h)
  sur testnet. Paramètre de déploiement de l'Auction House, pas un changement
  de code. Narratif : « the bell rings every hour on testnet ».
- **Gouvernance** : votingDelay et votingPeriod en minutes/heures (ex. delay
  10 min, vote 2 h, timelock 10 min) pour qu'une proposition complète soit
  démontrable dans la journée.
- **Keeper** : les enchères Nouns doivent être settle par un appel externe
  (`settleCurrentAndCreateNewAuction`). Écrire un petit script node cron
  (ex. toutes les minutes, settle si l'enchère est finie) tournant à côté de
  l'indexeur. C'est un adapter accepté, pas une entorse au rebrand.
- **Activité de démonstration** : un script optionnel peut faire enchérir 2-3
  wallets testnet pour que la page ne soit pas vide. Autorisé parce que le
  bandeau testnet (§3) couvre le site — mais ne jamais nommer ces wallets
  comme des « membres » dans la copy.

## 9. Frontend — modifications précises

Base : `packages/nouns-webapp`, en conservant les layouts.

1. **Home / enchère** (page principale) :
   - le hero reste : la cloche du jour en immense + countdown + input de bid +
     historique des bids. Seuls les visuels et la palette changent.
   - **le moment « the bell rings »** : au settlement de l'enchère, un petit
     moment visuel (la cloche qui oscille, une onde) — optionnel, à faire en
     fin de build seulement, ne pas y couler du temps. Un son est envisageable
     mais uniquement déclenché par interaction utilisateur (jamais en autoplay).
   - **ajout sous le hero : le module Portefeuille** — cartes ou tableau :
     token, quantité détenue par le Timelock, prix spot (pool), valeur, et un
     lien vers l'achat (proposition) correspondant sur Blockscout. Une ligne de
     total. C'est LA surface nouvelle qui dit « trésorerie boursière » en un
     regard.
2. **Page gouvernance** : conservée. Ajouter le bouton « Proposer un achat »
   qui ouvre le formulaire Buy Stock Token (§7.4). Le formulaire de proposition
   avancé reste accessible.
3. **Page proposition** : conservée telle quelle (votes, quorum, exécution).
   Vérifier que l'affichage de la calldata du swap est lisible (décodage de
   l'action « swap X pour Y, minimum Z »).
4. **Nav** : Accueil (enchère), Trésorerie (vue étendue du portefeuille +
   historique), Gouvernance, Docs. Supprimer le reste (§5).
5. **Bandeau testnet** permanent (§3).
6. **Liens explorer** : tous vers Blockscout Robinhood testnet.
7. **i18n** : EN uniquement.

## 10. DA / identité — cadrage (léger mais décisif)

Le nom est **Bells** ; l'objet génératif est une **cloche**. Tommy veut un
changement de DA **léger** : on ne redessine pas le produit, on le rhabille.
Mais attention au risque n°1 du projet : **ressembler au énième fork Nouns**.
Le minimum viable d'identité :

- **Nouveau monde de couleurs** : quitter le fond crème/rouge Nouns. Direction
  suggérée (à valider avec Tommy) : sobre et financier-premium — fond clair ou
  sombre calme, un accent fort, beaucoup d'air, typographie nette. La
  référence de ton est Givest (https://usegivest.app/) : calme, premium, une
  action centrale par écran.
- **Les cloches génératives** : le système génératif de Nouns (pipeline
  `nouns-assets` : PNG par trait → run-length encoding → descriptor onchain)
  est conservé tel quel. On remplace les PNG. Axes de variation de la cloche :
  **forme** (cloche d'ouverture NYSE, cloche d'école, cloche de comptoir,
  clochette, gong, carillon…), **matière/couleur** (bronze, or, argent, laiton,
  verre, néon…), **battant**, **gravure/motif** (ticker, taureau, ours,
  éclair…), **accessoire** (ruban, socle, marteau d'enchère) et **fond**.
  Produire d'abord 8-10 formes + 4-5 matières + accessoires ; le pipeline
  accepte des sets réduits.
  **Faire valider une planche de 6-8 rendus par Tommy avant d'encoder quoi que
  ce soit onchain.**
- **Logo + copy** : le logo découle de la cloche (silhouette minimale). La
  copy de la landing tient en trois lignes (le pitch du §1) avec la tagline
  « One bell rings every day. »

## 11. Ordre de build recommandé

Chaque phase a un critère de sortie vérifiable. Ne pas paralléliser les phases
1 et 2 avec la 0.

- **Phase 0 — Baseline (½ jour)** : cloner le monorepo, `pnpm install`,
  `pnpm build`, lancer le simnet local + webapp, dérouler une enchère et une
  proposition en local Hardhat. Vérifier ce que la webapp exige de
  `nouns-api` (lancer l'indexeur Ponder en local s'il est nécessaire à
  l'affichage). *Sortie : Nouns vanilla tourne de bout en bout en local.*
- **Phase 1 — Chaîne (½ jour)** : config Robinhood testnet (via le repo rig),
  wallet + faucet, déploiement d'un contrat trivial, Blockscout OK. *Sortie :
  une tx à nous visible sur l'explorer testnet.*
- **Phase 2 — Déploiement du cœur (1 jour)** : déployer la suite Nouns
  complète sur le testnet avec les paramètres de démo (§8), webapp pointée
  dessus via `.env`, indexeur Ponder branché, keeper de settlement en cron.
  *Sortie : une enchère live sur notre testnet, visible dans notre webapp.*
- **Phase 3 — Couche Stock Tokens (1-2 jours)** : mocks ERC-20, AMM minimal,
  pools seedés, proposition « Buy Stock Token » exécutée avec succès une fois
  (manuellement). *Sortie : le Timelock détient des sTSLA achetés par vote.*
- **Phase 4 — Frontend (1-2 jours)** : module portefeuille, formulaire d'achat,
  nav élaguée, bandeau testnet, liens Blockscout. *Sortie : le parcours
  complet est lisible par un visiteur qui ne connaît pas Nouns.*
- **Phase 5 — Identité (1-2 jours, peut commencer en parallèle dès la phase 3,
  planche validée par Tommy obligatoire)** : cloches, palette, logo, copy,
  meta. Redéployer le descriptor avec nos assets. *Sortie : plus aucune trace
  visuelle de Nouns.*
- **Phase 6 — Livraison (½ jour)** : deploy Vercel, README public GPL avec
  attribution Nouns, petite doc « comment ça marche » dans le site, démo
  filmable : bid → win → proposer un achat → voter → exécution → portefeuille
  mis à jour.

Total honnête : **6 à 9 jours concentrés.** Si une étape explose ce budget,
s'arrêter et le signaler plutôt que dégrader la qualité.

## 12. Critères d'acceptation finaux

1. Un visiteur comprend le produit en dix secondes sur la landing sans
   explication.
2. La boucle complète est exécutable onchain sur Robinhood testnet par
   n'importe quel wallet financé au faucet : enchérir → gagner → proposer un
   achat → voter → exécution → le portefeuille reflète l'achat.
3. Aucune donnée simulée hors chaîne : tout ce que l'UI affiche est lisible
   onchain ou via l'indexeur.
4. Aucune trace de la marque Nouns dans le produit (hors attribution README).
5. Le repo du fork est public sous GPL-3.0.
6. Le bandeau testnet/tokens simulés est présent sur toutes les pages.
7. Zéro dépendance payante ; le site tourne sur Vercel free tier.

## 13. Ce qu'il ne faut PAS faire

- Réécrire le frontend « proprement » en Next/autre stack. C'est un rebrand.
- Modifier la logique des contrats Nouns (au-delà des constantes/paramètres).
- Ajouter des features hors périmètre : staking, token secondaire, chat,
  multi-DAO, delegation UI avancée… Rien de tout ça.
- Brancher une API de prix externe ou un oracle tiers.
- Utiliser les vrais Stock Tokens Robinhood ou viser le mainnet.
- Garder l'artwork Nouns par facilité (même légal en CC0, c'est un échec
  d'identité).
- Prétendre, dans la copy, à une communauté ou une activité réelles.

## 14. À vérifier au démarrage (les seules inconnues assumées)

1. Paramètres exacts du testnet Robinhood (RPC, chainId, faucet, Blockscout) —
   source : repo `snzeeee/rig`, sinon doc publique Robinhood Chain.
2. La webapp exige-t-elle `nouns-api` (Ponder) pour l'enchère/les props, ou
   seulement pour l'historique ? (Découvert en phase 0 ; conditionne où tourne
   l'indexeur.)
3. Uniswap officiel présent sur le testnet ou non (décide option A/B du §7.2).
4. Version Node exacte (`.nvmrc`) et éventuels pièges de build Windows — si le
   build pose problème sous Windows, utiliser WSL sans hésiter.
5. Coût gas réel du déploiement du descriptor avec nos assets (l'encodage
   d'art onchain est la partie la plus gourmande — prévoir le faucet en
   conséquence).
6. Disponibilité du domaine et des handles « Bells » (bells.xyz probablement
   pris — prévoir des variantes : ringbells.xyz, bellsdao.xyz, onebell.xyz…).
