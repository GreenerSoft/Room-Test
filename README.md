# Room-Test
Le dépôt **Room-Test** contient des exemples de codes JavaScript de **Room**, **Room-Suspense** et **Room-Leaflet** utilisés dans une page **HTML** avec une interface utilisateur minimaliste.

Deux versions sont disponibles :

1. **index.html** : La version en module **ECMAScript 6**, elle nécessite un serveur Web pour fonctionner.
2. **index-nm.html** : La version non **ECMAScript** qui peut être utilisé avec le protocole `file://` (à l'exception d’un exemple).

Vous pouvez essayer ces pages **HTML** directement sur **GitHub** avec les liens suivants :

1. **[https://greenersoft.github.io/Room-Test/index.html](https://greenersoft.github.io/Room-Test/index.html)**
2. **[https://greenersoft.github.io/Room-Test/index-nm.html](https://greenersoft.github.io/Room-Test/index-nm.html)**

Les fichiers Javascript sont rassemblés dans un répertoire `/esm/` pour la version en module **ECMAScript** et dans un répertoire `/js/` pour la version non **ECMAScript**.

Les fichiers sont en version **ESM** :

* `index.js` : le point d'entrée pour afficher l'interface de sélection des exemples.
* `simple-examples.js` : un module contenant 6 exemples simples.
* `todolist-examples.js` : un module contenant 3 exemples de todoList.
* `map-examples.js` : un module contenant 6 exemples de cartes interactives sur la base de **Room-Leaflet**. et utilisant également **Room-Suspense**.

En version non **ESM**, les fichiers ont les mêmes noms mais avec le suffixe `-nm` pour non module, soit : `index-nm.js`, `simple-examples-nm.js`, `todolist-examples-nm.js` et `map-examples-nm.js`.

Quinze exemples sont donc disponibles au total et organisés en composants.

## DoubleCount1
Un exemple simple de double compteur avec somme.

## DoubleCount2
Une variante de l’exemple précédent utilisant un effet.

## SymbolToPrimitive
Un exemple d’une donnée observable créée avec un objet auquel un symbole `toPrimitive` a été ajouté et qui permet alors de simplifier l'utilisation de la donnée pour l’écriture de la réactivité (possibilité de faire comme avec une donnée observable d’une primitive JavaScript).

## ArrayManipulation
Un exemple sur une donnée observable d'un tableau avec l’utilisation des méthodes `reverse()`, `sort()` et `splice()` et de la réctivité engendrée.

## Style
Un exemple d’utilisation d’un objet littéral comme valeur de l’attribut style, une possibilité ajoutée avec la version **1.1.0** de **Room**.

## Suspense
Quelques exemples d’utilisation du composant **Room-Suspense**.

## TodoListExample
Un exemple complet de todoList sur la base d’une donnée observable d’un tableau et exploitant la fonction `map()` de **Room**.

## TodoListObjectExample
Un exemple de todoList sur la base d’une donnée observable d‘un objet et non d’un tableau.

## TodoListArrayDeleteExample
Un autre exemple de todoList sur la base d’une donnée observable mais utilisant un `delete` et non la méthode `splice()` pour supprimer un élément du tableau.

## MapReactive
Un exemple de carte utilisant **Room-Leaflet** pour montrer la réctivité de la position d’un marqueur et du contenu de sa popup.

## MapIPGeolocation
Un exemple de géolocalisation d’une adresse IP (V4 ou V6) et la visualisation de sa position sur une carte avec les informations de cette adresse (pays, ville, etc.) affichées dans la popup du marqueur.

## MapGeoJSON
Un exemple qui utilise une fichier geoJSON et qui affiche une carte avec un marqueur pour toutes les préféctures et sous-préfectures de la France métropolitaine. Cet exemple ne fonctionne pas dans la version non **ECMAScript** avec le protocole `file://`.

## MapNexrad
Un exemple très simple qui affiche les intempréries (pluie, neige, grêle) sur la carte des USA à partir des données des radars météoroligiques **Nexrad**.

## MapNexradAnimated
Le même exemple que le précédent mais avec la possibilité d'animer l'affichage des intempéries sur une heure à une vitesse variable.

## MapWorldRadarAnimated
Un exemple qui affiche les intempréries (pluie, neige, grêle) sur le monde entier (centrage par défaut sur l’Europe) à partir des données de plus 1000 radars météoroligiques. L'affichage couvre par défaut une période de 2 heures (qui peut être étendue à 12 heures) et peut être animé à une vitesse variable.

