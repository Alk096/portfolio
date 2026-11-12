# Brief — Portfolio de Mahamadou Soumana

> Ce document dit **quoi** construire et **pourquoi**, pas **comment**.
> les solutions créatives sont à toi.
> Quand tu fais un choix important, explique-le en une ou deux phrases.

---

## 1. Qui, et pour qui

**Mahamadou Alker**, étudiant en Bachelor 4 informatique à Niamey, développeur orienté backend, passionné de sécurité offensive (CTF, pentest), co-fondateur d'un petit cabinet de développement.

Le site doit convaincre deux publics en moins de 30 secondes :
- un **recruteur ou un client**, qui veut savoir ce que je sais faire et me contacter ;
- un **développeur**, qui doit se dire « ce type maîtrise son sujet ».

Le portfolio est lui-même une démonstration : le soin du motion et de la 3D *est* l'argument.

---

## 2. L'ambiance

**« Un terminal chaleureux. »** Une nuit calme, du texte net, et quelques néons qui ponctuent.

- Référence de lumière : le site de **Vite** (vite.dev), avec ses lueurs douces et ses dégradés discrets.
- **Pas cyberpunk** : pas de glitch, pas de scanlines, pas de magenta ou cyan saturé, pas d'aberration chromatique, pas de texte « hacker » vert sur noir.
- Règle **90 / 8 / 2** : 90 % de surfaces sombres et de texte, 8 % de lignes et de texte atténué, 2 % de néon.
- Au repos, presque rien ne brille. La lumière répond à l'interaction.

### Palette (valeurs imposées)

| Rôle | Nuit (défaut) | Jour |
| --- | --- | --- |
| Fond de page | `#07080c` | `#f7f6f2` |
| Surfaces (du plus bas au plus haut) | `#0d0f16`, `#141824`, `#1d2232` | `#efede6`, `#ffffff`, `#e7e4db` |
| Texte principal / atténué | `#eef0f6` / `#9aa1b5` | `#12141c` / `#4d5366` |
| Néon principal : ambre | `#ffb547` | texte : `#955600` |
| Néon secondaire : violet | `#8f84ff` | texte : `#5a4ee0` |
| Accent terminal : menthe | `#3ef2b0` | texte : `#03754f` |
| Erreur | `#ff6b7a` | `#c22f42` |

Le dégradé signature va de l'ambre au violet en passant par un corail (`#ff8a5b`).

### Typographie (imposée)

- **Bricolage Grotesque** : le nom et les titres.
- **Geist** : le texte courant.
- **JetBrains Mono** : les étiquettes, les dates, le code et le terminal.

Tout le reste (échelle typographique, espacements, rayons, ombres) est à toi. Organise-le en tokens réutilisables.

---

## 3. Les sections

L'ordre vient de mon croquis. La mise en page à l'intérieur de chaque section est une intention, pas un plan au pixel.

1. **Hero** : mon nom, mon rôle, une accroche, deux actions (voir les projets, me contacter). Mon **avatar 3D** occupe l'autre moitié de l'écran.
2. **À propos** : un texte de présentation. À côté, un **setup PC en 3D** (bureau, unité centrale, moniteur, clavier, souris) qui **vient se poser élément par élément** au scroll, à la manière du motion design. Une fois assemblé, l'écran s'allume et affiche un terminal qui me présente.
3. **Projets** : un projet mis en avant plus grand que les autres, puis une grille.
4. **Skills** : trois familles (Backend, Sécurité offensive, Front & Mobile), puis une bande horizontale de technos.
5. **Parcours** : une timeline verticale de 2023 à « Aujourd'hui », avec des cartes qui alternent à gauche et à droite.
6. **Contact** : une accroche, un formulaire, puis les liens vers mes réseaux.

Plus une **navigation** toujours accessible.

---

## 4. L'avatar : la pièce maîtresse

- Fichier : `public/models/avatar.glb`. C'est un avatar MetaPerson, riggé, avec les blendshapes ARKit.
- Pose voulue : **bras croisés**, de face ou de trois quarts.
- L'animation Mixamo bras croisés arrivera plus tard. Ton code doit pouvoir l'accueillir sans être réécrit.
- **Exigence non négociable : il ne doit jamais avoir l'air figé**, comme une vidéo mise en pause. Même sans animation de base, il doit sembler vivant. À toi de trouver comment, de façon crédible et non mécanique.
- Il réagit à la présence du visiteur, mais avec retenue.

---

## 5. Le motion

- Chaque section a une **entrée** pensée, et les animations racontent quelque chose.
- La séquence du setup PC est le deuxième moment fort après l'avatar. Elle doit avoir du **poids** : les objets tombent, se posent et réagissent à l'impact.
- Des **objets 3D thématiques** peuvent flotter dans le décor : serveur, cadenas, nœuds réseau, cube-terminal… À toi de décider lesquels, où et combien, sans surcharger.
- Le mouvement est fluide et organique, jamais saccadé ni répétitif à l'œil.

---

## 6. Contraintes

- **Stack** : React + Vite. Pour la 3D et l'animation, choisis et justifie (React Three Fiber, GSAP, etc.).
- **Machine de référence modeste** : AMD Athlon Gold 3150U avec Radeon Vega 3 intégrée, sous Linux. **Si c'est fluide là-dessus, c'est réussi.** Pense dès le départ au poids des modèles, à la résolution de rendu et à ce qui tourne hors écran.
- **Mobile** : le site doit être beau et utilisable sur téléphone, avec une 3D allégée si nécessaire.
- **Accessibilité** : contraste suffisant dans les deux thèmes, navigation au clavier, respect de `prefers-reduced-motion` (le site reste beau sans animation).
- **Thème** : sombre par défaut, avec un thème clair disponible.
- **Pas de contenu inventé** : là où le contenu manque (projets, étapes du parcours), mets des emplacements clairement marqués `TODO`, faciles à remplir.

---

## 7. Ce que je te laisse décider

- L'architecture du projet et le découpage en composants.
- La façon de rendre l'avatar vivant.
- La chorégraphie exacte de chaque animation (durées, courbes, déclencheurs).
- La modélisation des objets 3D du setup et du décor : procédurale, modèles libres ou primitives stylisées.
- Les détails d'interaction : survols, curseur, transitions entre sections, micro-interactions.
- Tout ce qui rend le site mémorable sans trahir l'ambiance.

Surprends-moi, mais reste dans la direction.

---

## 8. Critères de réussite

- [ ] En arrivant sur la page, on comprend en 5 secondes qui je suis et ce que je fais.
- [ ] L'avatar n'a jamais l'air figé, même en le regardant 30 secondes.
- [ ] Le setup PC s'assemble de façon satisfaisante et l'écran s'allume.
- [ ] Le néon reste une ponctuation : rien ne fait « sapin de Noël ».
- [ ] Le site est fluide sur la machine de référence.
- [ ] Il est beau sur mobile et avec `prefers-reduced-motion` activé.
- [ ] Le code est propre, et le contenu se modifie facilement sans toucher aux composants.

---

## 9. Comment avancer

1. Commence par me proposer un **plan court** : ton architecture, tes choix de librairies et ton approche pour l'avatar et le setup PC. Attends mon accord.
2. Construis ensuite par étapes, en commençant par **la structure et le hero avec l'avatar**.
3. À chaque étape, dis-moi ce qui est fait, comment le tester et ce que tu as décidé seul.
