***
{
    "title": "Quand Hoa rencontre vagrant",
    "type": "asciinema",
    "date": "2014-03-09 19:28:00",
    "layout": "asciinema.twig",
    "asciinema_id": "8079",
    "tags": ["vagrant", "hoaproject", "php"],
    "draft": true,
    "summary": "Aujourd'hui, je vais vous parler un peu de vagrant et de Hoa. Ceux qui me connaissent savent que je suis un grand fan de vagrant, que je l'utilise quotidiennement et que je suis également contributeur au projet Hoa. J'ai donc décidé de créer une box vagrant dans laquelle Hoa est pré-installé afin que tout le monde puisse l'essayer rapidement."
}
***
Aujourd'hui, je vais vous parler un peu de [vagrant](http://vagrantup.com) et de [Hoa](http://hoa-project.net/). Ceux qui me connaissent savent que je suis un grand fan de vagrant, que je l'utilise quotidiennement et que je suis également contributeur au projet Hoa. J'ai donc décider de créer une box vagrant dans laquelle Hoa est pré-installer afin que tout le monde puisse l'essayer rapidement.

Cette VM est basée sur une Debian 7 (wheezy) et est déclinée en 3 versions : PHP 5.4, PHP 5.5 et PHP 5.6. Ces trois versions intègrent les mêmes outils, à savoir :

* Hoa cloné depuis [les sources](http://git.hoa-project.net/Central.git)
* [Composer](http://getcomposer.org)
* Quelques petits outils (VIM, htop, ...)
* Le shell ZSH pré-configuré
* Les [dotfiles](https://github.com/Hywan/Dotfiles) d'[Hywan](https://github.com/Hywan), l'auteur d'Hoa

Avec cette box vous pourrez donc très facilement tester Hoa, que ce soit en suivant les [Awecodes](http://blog.hoa-project.net/posts/9-awecode-une-nouvelle-forme-dappr.html) ou en démarrant un projet. Dans les deux cas, pour démarrer vous devrez suivre ces quelques étapes :

* Importer la base-box

<pre class="line-numbers"><code class="language-bash">#!/bin/bash

vagrant box add 'jubianchi/hoaproject-php-56' \
    'http://static.jubianchi.fr/boxes/hoaproject-php-56-0.1.0.box'</code></pre>

* Initialiser un Vagrantfile

<pre class="line-numbers"><code class="language-bash">#!/bin/bash

mkdir '/tmp/testing-hoaproject'
cd '/tmp/testing-hoaproject'
vagrant init 'jubianchi/hoaproject-php-56' \
    'http://static.jubianchi.fr/boxes/hoaproject-php-56-0.1.0.box'</code></pre>

* Démarrer votre VM

<pre class="line-numbers"><code class="language-bash">#!/bin/bash

cd '/tmp/testing-hoaproject'
vagrant up
vagrant ssh</code></pre>

Une fois connecté dans la machine virtuelle, vous aurez directement accès à la commande ```hoa``` qui vous permettra de découvrir certaines librairies depuis votre terminal.

Si vous souhaitez simplement suivre un awecode, il vous suffit de vous rendre dans le dossier ```/vagrant``` de la machine virtuelle et de suivre les indications fournies. Il existe actuellement [3 awecodes](http://hoa-project.net/Fr/Awecode.html) :

* [Readline](http://hoa-project.net/Fr/Awecode/Console-readline.html)
* [Websocket](http://hoa-project.net/Fr/Awecode/Websocket.html)
* [Eventsource](http://hoa-project.net/Fr/Awecode/Eventsource.html)

Vous pouvez télécharger ou importer les trois boxes vagrant en utilisant les liens suivants :

* [hoaproject-php54](http://static.jubianchi.fr/boxes/hoaproject-php-54-0.1.0.box)
* [hoaproject-php55](http://static.jubianchi.fr/boxes/hoaproject-php-55-0.1.0.box)
* [hoaproject-php56](http://static.jubianchi.fr/boxes/hoaproject-php-56-0.1.0.box)

Les sources sont disponibles sur Github : [jubianchi/vagrant-boxes](https://github.com/jubianchi/vagrant-boxes/tree/master/hoaproject)

<div data-repo="jubianchi/vagrant-boxes"></div>

Pour finir, voici une démonstration de ce que l'on peut faire avec cette box :
