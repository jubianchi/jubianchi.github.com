***
{
    "title": "atoum.js : un poisson d'avril, mais pas que…",
    "summary": "Ce soir j'ai publié la version <code>0.0.4</code> d'<a href=\"https://github.com/jubianchi/atoum.js\">atoum.js</a> sur la plateforme <a href=\"https://npmjs.org/package/atoum.js\">NPM</a>. Cette version est donc la quatrième itération que je réalise sur le projet et la seconde officiellement taguée sur Github, je me suis donc dit qu'il était temps de clarifier un peu mes intentions et ma vision de ce projet.",
    "type": "post",
    "date": "2013-04-27 00:27:00",
    "layout": "post.twig",
    "tags": ["javascript", "atoum", "test"],
    "twitter": {
        "widget": "293009231949471744",
        "url": "https://twitter.com/search?q=%23atoum",
        "title": "Tweets about #atoum"
    }
}
***
Ce soir j'ai publié la version ```0.0.4``` d'[atoum.js](https://github.com/jubianchi/atoum.js) sur la plateforme [NPM](https://npmjs.org/package/atoum.js). Cette version est donc la quatrième itération que je réalise sur le projet et la seconde officiellement taguée sur Github, je me suis donc dit qu'il était temps de clarifier un peu mes intentions et ma vision de ce projet.

Comme vous le savez certainement, lorsque j'ai démarré atoum.js, je le faisais uniquement pour publier quelque chose qui, je pensais, allait faire réagir pour le premier avril. Je pensais provoquer un peu et éventuellement recueillir quelques critiques, car je n'étais pas certain de la viabilité de la philosophie d'[atoum](http://atoum.org) dans des projets javascript.

Au final, lorsque j'ai publié [la toute première version](https://twitter.com/jubianchi/status/318676434287738880), j'ai reçu un accueil tout à fait différent : quelques retweets et [autres messages](https://twitter.com/_Florian_R/status/319370634285174784) [assez](https://twitter.com/ludofleury/status/319550795051855872) [sympathiques](https://twitter.com/ludofleury/status/319550995124326400) sur Twitter ou IRC. Le peu de retours s'explique certainement par ma visibilité très limitée (voire inexistante) dans la communauté Javascript.

J'étais donc parti dans l'optique de réaliser un petit POC fonctionnel et assez complet pour paraître sérieux et de m'arrêter là. Et je vous avoue que j'ai été assez satisfait du résultat, car je n'avais jamais démarré un projet NodeJS from scratch et que je n'avais pratiqué le JS que dans le cadre de projet web. atoum.js fonctionnait très bien et était déjà capable de [se tester lui-même](http://ascii.io/a/2660).

Cette satisfaction m'a donné envie d'aller un peu plus loin et aujourd'hui, je continue à travailler sur atoum.js car je trouve que c'est quelque chose de très intéressant. Actuellement, ce projet est un peu un terrain de jeu, un laboratoire, où je peux tester de nouvelles choses et m'amuser un peu.

Tant que personne ne manifestera un intérêt réel pour atoum.js, le projet continuera à vivre sous cette forme. Si vous souhaitez l'utiliser, ne le fait que sur un _side project_ car je ne peux rien vous garantir sur le fonctionnement de l'outil ni sur ma capacité à corriger les éventuels dysfonctionnements.

Si vous souhaitez utiliser et faire évoluer atoum.js, faites-vous connaître, contribuez et nous ferons avancer atoum.js.

Pour finir, voici quelques détails sur les fonctionnalités implémentées après un mois de travail :

* Interface en ligne de commande
* Un [jeu d'assertions](https://github.com/jubianchi/atoum.js/tree/master/lib/asserters) presque complet
* Deux moteurs d'exécution :
    * ```inline``` : tous les tests sont exécutés dans le processus principal
    * ```concurrent``` : les méthodes de test sont exécutées dans des processus isolés, lancés en parallèle
* Génération de rapport xUnit
* Génération d'un [rapport de couverture de code](http://jubianchi.fr/atoum.js/) avec ```covershot```
* ```callback``` pour tester les callback
* Un moteur de mock très basique (WIP)




