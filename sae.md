# SAE 4.ALT.01 Adaptation Alternance <br> Visualisation de données
**BUT2 MMI 2024-2025**

Après l'approche de conceptualisation, voici l'étape de réalisation technique. L'objectif final est de réaliser une chaîne complète d'affichage de données dans une page HTML. Tout est automatisé et la page se met à jour quand une donnée est changée ou ajoutée. Une interaction avec l'utilisateur permettra une mise à jour des données comme des valeurs de filtres ou des `hover`.

Cette chaîne est relativement simple : 
1. récupération des données. Ici, un fichier csv sera chargé puis converti en JSON mais ce peut être le résultat d'une interrogation de base de données.
2. Une page HTML aura un élément pour accueillir le graphique : soit un `canvas`, soit un `div` ou `svg`.
3. Un script JS permettra de réaliser le chargement, le traitement des données si besoins et le tracé d'un graphique. Pour cela, 2 bibliothèques seront utilisées.
4. Il restera la mise en forme : selon la bibliothèque, ce sera soit directement lors de l'utilisation, soit avec du CSS ou du SVG.

- Projet
  - Utilisation de données réelles pour réaliser une page web avec des graphiques dans le but de passer un messages.
  - Il faudra charger les données, les trier, les afficher, interagir avec l'utilisateur (boutons, quizz...)
  - Travail en équipe de 2 ou 3 : écriture d'une note d'intention collective avec une réalisation individuelle

## Les outils
- HTML, CSS, JS, SVG
- Prise de notes en Markdown
- Visual Studio Code avec
  - Live server
  - Extention SVG de jock pour preview si besoin, sinon navigateur
  - Extension Markdown Preview Enhanced
  - Extension pour éditer les CSV (Edit csv par exemple)
- Bibliothèque Chart.js et son [site](https://www.chartjs.org/) pour la documentation
- Bibliothèque D3.js et son [site](https://d3js.org/) pour la documentation
- Site de D3.js en ligne sous forme de notebook [Observable](https://observablehq.com/) (par le créateur de D3.js)
- Bibliothèque PlotlyJS et son [site](https://plotly.com/javascript/) pour la documentation

### Markdown
Le langage Markdown est similaire au HTML avec l'utilisation de balises. Le principe est de simplifier au maximum pour une prise de note à la volée. Le formatage passe ensuite en HTML avec du CSS. C'est typiquement la documentation de Github ou les Wiki.

VSCode interprète nativement le Markdown et l'exention proposée permet une utilisation plus avancée (lire la documentation de l'extension). Pour visualiser en temps réel, taper CTRL+k v.

### Chart.js
La bibliothèque Chart.js simplifie la création du graphique. Il est très facile de tracer un graphique mais peut s'avérer fastidieux pour la personnalisation ou l'interaction avec l'utilisateur. Le principe est d'utiliser une balise `canvas` et de passer les informations (données et formatage) sous forme de JSON. Le problème se résumera à la construction d'un objet JSON avec les bons paramètres aux bons endroits.

N'hésitez pas à lire et utiliser la documentation sur site.
Elle propose de créer dans un script JS une constante pour la configuration :
```javascript
const config = {
  type: 'bar'
  data: {}
  options: {}
  plugins: []
}
```
Ensuite, il faut appeler une fonction avec l'élèment canvas du DOM identifié par `ctx`.
```javascript
const MonGraphique = new Chart(ctx, config);
```
Globalement, la partie programmation est finie. Il vous faudra ensuite manipuler du JSON, donc comprendre l'arborescence, pour modifier les couleurs, les fontes... Vous serez aussi contraint par les possibilités de la bibliothèque comme les types de graphique.

### D3.js
D3.js est une bibliothèque permettant énormément de chose pour la création de graphiques mais aussi la dataviz. Seulement, elle repart de la base et demande à l'utilisateur de programmer entièrement son graphique. D3.js a été pensé pour gérer les élèments de SVG comme vous pourriez le faire à la main mais également la gestion de masse avec des variables typées tableau. Cependant, elle propose des outils pour vous faciliter la tâche. Un autre point intéressant est la possibilité de voir le code du résultat pour le débug contrairement au `canvas`. Le formatage peut aussi se faire par CSS et donc être intégré dans un thème.

___
# Déroulement de l'étape 1 (4h)
- Pré-requis : 
  - prise de notes en Markdown
  - création de SVG
  - HTML/CSS/JS
  - JSON

- Montée en compétences
  - &Eacute;tape 1 : reprendre les bases d'un graphique, à savoir les échelles, le placement des élèments...
  - &Eacute;tape 2 : générer le graphique en statique, SVG à la main.
  - &Eacute;tape 3 : générer le graphique en statique avec un script chart.js
  - &Eacute;tape 4 : générer le graphique en statique avec un script D3.js
  - &Eacute;tape 5 : modifier votre code pour utiliser un fichier extérieur csv pour un affichage dynamique
  - &Eacute;tape 6 : utiliser toutes les possibilités pour personnaliser, interagir, animer...

Votre premier graphique sera très simple. Ce sera un diagramme à barre avec les données suivantes

|Label 1 | Label 2 | Label 3 | Label 4 |
|:--:|:--:|:--:|:--:|
|1|2|3|4|

### Exercice 1

Objectif : tracer un graphique à la main en SVG.
- Sur une feuille, placer les points et formes importantes :
  - la taille à 1000x500
  - marges de 20
  - zone pour le label en dessous de chaque barre avec une hauteur de 60
  - zones disponibles pour chaque graphique
  - l'échelle pour les valeurs si la plus grande valeur sera à pleine échelle
- Sur l'ordinateur en SVG
  - créer un nouveau fichier SVG de taille 1000x500
  - placer les différentes zones à l'aide de `rect` de 2 façons différentes (`x` et `y` ou `transform`)
  - finaliser votre graphique avec les barres (largeur 50%), les labels et des couleurs différentes.
  - utiliser un groupe `g` avec les éléments d'une barre et appliquer une seule transformation

### Exercice 2
Objectif : intégration des graphiques dans une page HTML. Vous utilisez 3 méthodes différentes et en essayant de produire des graphiques les plus proches possibles.
- Dans un nouveau répertoire de travail, créer un ficher HTML (avec l'entête) et un fichier CSS.
- Vous pouvez ajouter un peu de texte mais il faut créer un `div` container de votre graphique.
- Le point de départ sera la variable de données :
```javascript
const myData = [
    { x: "Label 1", y: 1, color: "yellow" },
    { x: "Label 2", y: 2, color: "blue"},
    { x: "Label 3", y: 3, color:"cyan" },
    { x: "Label 4", y: 4, color:"pink"},
  ];
```
#### SVG from scratch
- Créer un `div` de class `container-graph`
- Ajouter votre code SVG
- Pour adapter la taille de votre graphique à celle du container, il faut supprimer les paramètres `width` et `height` tout en gardant `viewBox`.
- Utiliser votre CSS pour contrôler la taille et personnaliser votre page.


#### Chart.js
- ajouter la bibliothèque Chart.js dans votre entête (soit un lien internet si vous avez une connection, soit en local)
- Créer un `div` de class `container-graph`
- Ajouter un `canvas` enfant avec un id
- Ajouter un `script` dans lequel vous ajouterez (en vous inspirant de la documentation du site) :
  - une variable avec les données
  - une variable avec les labels
  - une structure JSON de configuration de votre graphique
  - la sélection de votre `canvas`
  - l'appel de la fonction de création du graphique.
- Reprenez votre structure de configuration pour :
  - changer les couleurs de chaque barre grâce à une variable 
  - modifier le contour des barres en noir
  - une largeur des barres de 50%

Normalement, vous avez un graphique sur votre page. Tester les fonctionnalités disponibles par défaut (tooltip, responsive...).

#### D3.js

- ajouter la bibliothèque D3.js dans votre entête (soit un lien internet si vous avez une connection, soit en local)
- Créer un `div` de classe `container-graph` et identifiant `graphD3js`
- Ajouter un `script` et tester le code suivant : 
```javascript
const mySvg = d3.select("#graphD3js")
            .append("svg")
            .attr("viewBox", [0, 0, 1000, 500])
```
- Pour cela :
  - utiliser l'inspecteur de votre navigateur
  - vérifier qu'il n'y a pas d'erreurs dans la console
  - inspecter les élèments et trouver votre `div.container-svg2`
  - En utilisant la documentation, analyser le code et les 3 fonctions de D3. Observer également la philosophie de D3 de pouvoir enchaîner les commandes et de récupérer des objets intermédiaires (pratique pour les modifier ensuite).

- De la même manière, examiner les fonctions de la liste suivante :
```javascript
scaleBand()
axisBottom()
scaleLinear()
axisLeft()
call()
selectAll()
data()
join()
```
- Ces fonctions permettent de créer automatiquement des parties du graphiques mais l'insertion dans le SVG (commande+placement) reste à votre charge via le script.
- Reprener votre script afin de 
  - créer les variables de marges, de tailles du SVG et du graphique
  - préparer les axes
```javascript
const xScale = d3.scaleBand()
                 .domain(d3.map(data, (d) => d.x))
                 .range([0, width])
const yScale = d3.scaleLinear()
                 .domaine([0, 4])
                 .range([height, 0]);
```

  - insérer les axes (dans un `g` car la fonction génère plein d'élèments graphiques)
- vérifier le résultat dans votre page
- Passons maintenant aux barres de tailles différentes
  - en utilisant `selectAll()`, exploiter la philisophie de D3.js permettant de traiter automatiquement toutes les données.
  - il vous faut tout de même insérer correctement les éléments SVG avec les bons paramètres (ici, un `rect` avec les bonnes dimensions, aux bonnes coordonnées et avec la bonne couleur).
  
#### Graphique à partir d'un fichier

L'objectif est maintenant de tracer un graphique automatiquement à partir de données d'un csv.
- Installer une extension pour visualiser (Excel Viewer, équivalent du SVG) ou éditer (Edit csv) les fichiers csv.
- Créer un fichier dans votre répertoire de projet et remplisser 2 colonnes *Annees* de 2020 à 2023 et *Valeurs* de 1 à 4.
- Reprener votre page HTML at ajouter un nouveau graphique D3.js mais dans le script, appeler une fonction *afficherGraph*.
- Cette fonction *afficherGraph* sera définie dans un fichier JS que vous devez créer dans votre répertoire et include dans votre HTML.
- Le prototype est *async afficherGraph(nomFichier)*
  - async car il faut qu'une promise soit résolue
  - nomFichier est une chaîne de caractères qui correspond au nom de fichier
- Chercher des informations sur la fonction
```javascript
d3.csv();
```
- Revener à votre fonction JS et charger votre fichier CSV. Vérifier que tout va bien avec un *console.log()*. Attention, il faut un serveur sinon le navigateur bloque l'accès au fichier.
- En vous inspirant de votre code précédent, afficher les données de votre fichier. Vérifier qu'il se met à jour lorsque vous modifiez les valeurs. Est-ce qu'il est possible d'ajouter une valeur ? Regardez comment résoudre ce problème avec des échelles de couleur automatiques.

- Améliorations
  - Utilisation du padding de `scaleBand` afin de contrôler la largeur des barres
  - Ajustement de l'échelle à la valeur maximale (*domain* de 0 à max)
  - Création d'une palette de couleurs automatiques
```javascript
const xScale = d3.scaleBand()
                 .domain(d3.map(data, (d) => d.x))
                 .range([0, width])
                 .padding(0.5);
const yScale = d3.scaleLinear()
                 .domaine([0, d3.max(d3.map(data, (d) => d.y))])
                 .range([height, 0]);
var myColor = d3.scaleOrdinal()
                .domain(d3.map(data, (d) => d.x))
                .range(d3.schemeSet3);
```
#### Interactions et animations (si le temps)

L'interaction classique est le "tooltip", c'est-à-dire l'affichage d'informations (valeurs, labels...) quand la souris survole une partie. C'est relativement simple à mettre en place avec D3.js.

- Insérer une div dans le `body` avec la classe `chart-tooltip` et une `opacity` de 0 pour la cacher par défaut. Penser à sauvegarder l'object sous la variable `divTooltip`.
- Ajouter ensuite un `eventlistener` sur mouseover afin de modifier la tooltip, i.e. la rendre visible
```javascript
// quelques pistes pour votre code JS
.on(event, function(event, d)...)
.transition(...)
.duration(...)
.style(...);
// La position de la souris peut être récupérer avec event.pageX et event.pageY
divTooltip.html(...)
          .style("left",...)     
          .style("top", ...);
```
- Il faut ensuite un autre `eventlistener` sur `mouseout` pour cacher la tooltip.
- Ne pas oublier de formater votre div.divTooltip en CSS pour le texte, la couleur, etc., mais surtout la position.
```css
position: absolute;
z-index: 1000;
```




