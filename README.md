# AmigoLike

Ce projet a pour but de montrer la mise en place d'une API REST pour un projet de Covoiturage proche de AmigoExpress

# Logiciels utilisés
## Front end
Pour la partie front end, VueJS dans sa version 2.1 est utilisée.

Ce framework Javascript permettant de créer des interfaces dynamiques de manière rapide et efficace.
Il nous permet de faire notre application sous un format "Single page" puisqu'à l'aide de *VueRouter* 
 nous pouvons avoir de multiples routes sans soucis.
 
 Nous utilisons aussi l'extension Axios qui nous permet de faire des requêtes sur le protocole HTTP.
 
 ## Back End
 Pour la partie back end, nous utilisons le framework NodeJS Loopback qui pour permet de générer des interfaces complêtes de manière dynamique et efficace.
 Ce framework est un framework complet basé sur le plugin Express.
 La persistance des données est gérée par Loopback à l'aide d'un ORM intégré.
 Il est centré autours des modèles que nous pouvons définir (voir Diagrammes) et génère ensuite les points d'entrées de manière dynamique.
 Il permet de générer rapidement des APIs complètes et sécurisées.
 
 Il est géré par IBM.
 
 
 Le stockage des données est effectué à l'aide de MongoDb, une base de données NoSQL.
 
 Cette base de données est composée d'objets en proposant des performances accrues et des fonctionnalités de recherche poussées.
 Elle a aussi l'avantage d'être entièrement dynamique. Si nous souhaitons rajouter une nouvelle variable dans notre base de données, il n'y a aucun soucis
 nous pouvons les rajouter dans loopback et ne pas avoir à toucher la base.
 
 Notre site est donc développé en Javascript sur l'ensemble de ses parties.
 
 
 # Guide d'utilisation
 Pour lancer le logiciel, il faut commencer par installer les dépendances en utilisatant
 
 `npm install`
 
 Il faut ensuite lancer le serveur de développement ou de production.
 
 **Serveur de développement**
 
 ``npm run dev``
 
 **Serveur de production**
 
 ``npm run prod``
 
 **Attention, pour lancer le serveur Loopback il est nécessaire d'avoir le serveur MongoDb déjà lancé**
 Il est ensuite possible d'accéder au site à l'adresse 
 http://localhost:8080
 
 Il est aussi possible d'accéder à une documentation de l'API utilisant OpenAPI à l'adresse
 http://localhost:3000/explorer.

# Points d'entrée intéressants
- Création d'un utilisateur
	POST /utilisateurs
- Connexion
	POST /utilisateurs/login (Login, MDP) -> Renvoie accès token, userID
- Créer un voyage
	POST /travels (Nombre de passagers, userID) -> travelID
- Créer un trajet
	POST /trip (Date/Ville départ, Date/Ville arrivée, travelID, price) -> tripID

- Créer une réservation
	POST /reservation (userID, prix, paye) -> reservationID
	PUT /reservations/(reservationID)/trips/rel/(tripID)

- Rechercher un trajet
	GET /travels/search/(VilleDepart)/(VilleArrivee)/(DateDepart) -> travelID

# Test d'utilisation
Il est possible d'essayer le programme avec ce programme de test :
## Création des premiers utilisateurs
Après le lancement du programme il est possible de créer un utilisateur.
Il faut aller sur /register pour y avoir accès.
Lorsque toutes les informations sont remplies, une requête  `POST api/Utilisateurs` est effectué.

Cette requête renverra ensuite en réponse l'objet nouvellement créé.
Une nouvelle requête sera faite pour enregistrer les préférences du voyageur avec `POST api/PreferencesVoyageurs`

## Connexion
Après l'enregistrement de l'utilisateur, on est redirigé vers la page de connexion.

Une fois les informations précisées une requête `POST api/Utilisateurs/login` est effectuée. En retour, un access Id et un user Id.

Ces deux informations sont stockées dans le local storage du client. Une information est ensuite remontée à la partie principale de l'application pour annoncer la connexion de l'utilisateur.

## Voir ses trajets
### Récupération des trajets
En allant sur la page myTravels il est possible d'accéder à l'ensemble de ses trajets.
Cela est fait en faisant une requête à `GET api/Travels` en incluant l'ensemble des trajets et des réservations.
La réponse est un fichier JSON comprenant toutes ces informations.

### Ajout d'un trajet
Il est aussi possible de rajouter un trajet grâce au composant CreateTravel.
Il contient l'ensemble des informations demandées, le nombre de passager, les points de passage et les prix de chaque étape ainsi que la récurrence.

Un ajout se passe en plusieurs étapes :
* Ajout du voyage `POST api/Travels`, donnant en retour l'ID du trajet.
* Ajout des trajets dans le voyage avec `POST api/Travels/:id/Trips`
* Ajout du trip dans la liste des trajets créés

## Voir ses réservations
En accédant à la page `myReservations` il est possible de voir l'ensemble des réservations déjà effectuées.
Les données sont récupérées en deux parties 
* Récupération des réservations avec les trajets associés `GET api/Reservations` pour l'utilisateur.
* Récupération des différents voyage `GET api/travels/:id` associés à chaque trajet et les informations du conducteur avec. Les informations personnelles du conducteur sont ensuite montrées en fonction de ses préférences.

Il est possible de voir les détails du trajet réservé en cliquant sur le lien de la carte.
## Rechercher 
Il est possible de rechercher les trajets à travers la page d'accueil.
Elle contient le point de départ, d'arrivée et la date du voyage.
On est ensuite renvoyé sur la page de recherche qui fait une requête `GET api/Travels/search` qui renvoie les trips, le prix de la réservation et le nombre de places restantes.
## Détails du trajet et réservation
A l'aide des pages précédentes il est possible de voir la page de détail du trajet entre deux points.
Les informations sont récupérées à l'aide de `GET api/Travels/:id` en intégrant les trips et les réservations.Ainsi que les informations du conducteur.

### Réservations
Si les conditions sont remplies (Non conducteur, départ non passé, ...) il est possible de réserver une place.
Une confirmation de paiement sera demandée. 
Dans ce projet nous avons décidé de partir sur le modèle de Blablacar, où l'ensemble des transactions se passe sur le site et pas de la main à la main.
Un ajout se passe en plusieurs étapes : 
* Ajout d'une réservation `POST api/Reservations`
* Ajout des trajets sur lesquels une place est requise. `PUT api/Reservations/:id/trips/rel/:trip`

Il est aussi possible d'annuler une réservation en cliquant sur le bouton annuler. Cette annulation commencera par supprimer les trajets puis la réservation.

## Mise à jour de l'utilisateur
En se dirigeant vers `/profile` il est possible de modifier ses préférences utilisateur ainsi que ses paramètres.
* Mise à jour de l'utilisateur : `PUT api/utilisateurs/:id`
* Mise à jour des préférencesVoyageurs : `PUT api/preferencesVoyageur/:id`
