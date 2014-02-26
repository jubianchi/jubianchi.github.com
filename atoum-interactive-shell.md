***
{
    "title": "atoum interactive shell",
    "type": "asciinema",
    "date": "2014-02-26 1:00:00",
    "layout": "asciinema.twig",
    "asciinema_id": "7758",
    "tags": ["wip", "poc", "atoum", "shell"],
    "twitter": {
        "widget": "293011120686497793",
        "url": "https://twitter.com/search?q=%23atoum",
        "title": "Tweets about #atoum"
    },
    "summary": "Comme vous le savez peut-être, atoum est un framework de test unitaire simple et intuitif pour PHP 5.3+. Ce que vous ne savez peut-être pas, c'est qu'il propose également une fondation très solide pour construire tout un tas d'outils. Partant de ce constat, je me suis demandé s'il était possible de mettre cette fondation à l'épreuve dans un contexte un peu différent de celui des tests unitaires : pourquoi ne pas essayer de faire un shell interactif en utilisant ces briques."
}
***
Comme vous le savez peut-être, atoum est un framework de test unitaire simple et intuitif pour PHP 5.3+. Ce que vous ne savez peut-être pas,
c'est qu'il propose également une fondation très solide pour construire tout un tas d'outils. Partant de ce constat, je me suis demandé
s'il était possible de mettre cette fondation à l'épreuve dans un contexte un peu différent de celui des tests unitaires : pourquoi ne
pas essayer de faire un shell interactif en utilisant ces briques.

Mais pourquoi encore un REPL en PHP. Pour plusieurs raisons :

* Permettre de tester les fondations d'atoum dans un contexte inhabituel pour ces dernières
* Pour aider au support : le shell nous permet de tester rapidement des bouts de code atoum avant de les donner aux utilisateurs
* Fournir un outil simple pour tester rapidement atoum
* Me confronter aux problématiques liées à l'écriture d'un shell/REPL
* M'amuser un peu

Comme vous pouvez le voir dans les tags, le *WIP* indique que je travaille encore sur ce projet. Il n'est pas encore assez propre pour être
ouvert mais je pense que cela ne va pas trop durer. *Stay tuned* comme ils disent. Au menu :

* Support complet de readline (completion, historique, raccourcis clavier)
* Exécution de code PHP natif
* Exécution d'assertions atoum
* Lancement de tests atoum
* Divers choses inutiles mais indispensables
* Et plein d'autres surprises

Voici une démonstration rapide de ce qu'il est possible de réaliser en quelques heures de travail à l'aide des composants fournis par
atoum :