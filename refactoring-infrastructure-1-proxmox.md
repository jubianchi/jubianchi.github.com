***
{
    "title": "Refactoring infrastructure #1 : proxmox",
    "type": "post",
    "draft": true,
    "date": "2014-08-04 23:29:00",
    "layout": "post.twig",
    "tags": ["server", "devops"],
    "summary": "Comment je suis passé d'un serveur dédié monolithique à une archi. basée sur la virtu, découpée, isolée, automatisée, monitorée, ..."
}
***

Comment je suis passé d'un serveur dédié monolithique à une archi. basée sur la virtu, découpée, isolée, automatisée, monitorée, ...

Avant de vous en dire plus, rappelez-vous une chose : à la base je suis un développeur. J'ai certainement fait quelques erreurs sur cette nouvelle
infrastructure mais ce n'est pas bien grave. Pour apprendre il faut faire des erreurs.

Pour mener à bien ce projet, j'ai appliquer des méthodes qu'on utilise tous les jours en tant que développeur :

* [OCP](http://en.wikipedia.org/wiki/Open/closed_principle) : Open/Closed Principle
* [SRP](http://en.wikipedia.org/wiki/Single_responsibility_principle) : Single Responsibility Principle
* Petites itérations très centrées sur un sujet
* Beaucoup de tests
* Livraison quotidienne en production
* ...

Je vais tenter de vous présenter toute ma réflexion, de vous expliquer mes choix et vous parler des outils que j'ai choisis ou écrits
dans une petite suite d'article.

TLDR : Je suis reparti *from scratch* en utilisant toute l'expèrience acquise pendant la maintenance de mon serveur précédent et 
j'ai utilisé des outils modernes de virtualisation, de containerisation, de configuration et d'orchestration (ça fait beaucoup 
de "ion") afin d'avoir une infrastructure solide et souple.

# Avant

En 2006, j'ai commandé mon premier serveur dédié chez Dedibox. A l'époque, je débutais en administration système et les seuls serveurs 
que j'avais utilisés jusque là étaient des petits mutualisés. Bien sur, j'avais travaillésur des serveurs dédiés maintenus par les 
administrateurs au boulot mais je n'avais jamais fait tout cela seul, sur mes propres serveurs.

Déjà à cette époque, je me disais qu'**être développeur implique obligatoirement de connaître les problèmatiques système** 
sous-jacentes. Je pense qu'il est impossible de produire une application correcte sans être un minimum au courant des notions 
de déploiement, de disponibilité, de charges, ...

J'ai donc sauté le pas et commandé ma première Dedibox... le début de la galère !

A l'époque, je travaillais exclusivement sur Windows, équipé de mon Notepad++ et de `cmd.exe`. J'étais hallergique aux lignes de 
commandes et d'ailleurs je n'y comprenais rien. Mais je savais que c'était un outil que je devais maîtriser afin d'être plus 
performant.

De même, en bon utilisateurs de Windows, je n'aimais pas du tout les sytèmes Unix qui, d'après mon expèrience du moment, nécessitaient 
bien trop de manipulations pour faire des choses simples, des choses qu'on pouvait faire en quelques clics sur Windows...

Je me trompais, bien sur, mais je ne le savais pas encore.

## Debian 7 avec tout dedans

Avant d'en arriver à une belle Debian 7, je suis passé par pas mal de distributions, essentiellement des Ubuntu Server. Là encore, 
avec l'expèrience, je pense que je me suis trompé mais passons.

J'ai donc installé ma première distribution Linux sur ce serveur en 2006. J'avais très peu d'expèrience, je l'ai donc cassée 
plusieurs fois. Après plusieurs réinstallations, j'ai commencé par y héberger de simples sites web ou applications PHP 
basiques que je développais sur mon temps libre.

Je ne me souciais pas de savoir si installer tel ou tel paquet était bon ou pas, si passer par une compilation personnalisée aurait été 
mieux ou pas. J'installais bêtement les paquets en essayant de suivre les tutoriels et en me rendant compte que ça ne fonctionnait pas 
comme je le voulais ou que ça ne fonctionnait pas du tout. 

Bref tout ça pour dire que **mon système était totalement pourri** à cause de mes manipulations un peu hasardeuses.

Pour corser un peu le tout, j'ai subi plusieurs migration : changement de datacenter, changement de machine, ... J'ai donc du 
apprendre à faire des backups propres et à les appliquer sur les nouveaux serveurs.

Pour finir, bien que petit à petit je me sois familiarisé avec quelques commandes très utiles, je n'avais aucune idée des 
possibilités offertes par les shells modernes et donc aucune idée de comment je pouvais automatiser toutes ces tâches un peu 
barbentes.

Voilà en gros pour le flashback : je travaillais en 2006-2010 comme les vrais admininistrateurs travaillaient en 1990 (et encore...). 
Je cassais souvent mon serveur, je perdais donc beaucoup de temps à le remettre sur pieds et accessoirement, je perdais des données.

Fort de cette expérience, je suis arrivé à **identifier mes besoins et à les exprimer** : il me fallait un système de base **simple** à partir duquel
je pouvais démarrer des environnements complets ou très spécialisés mais surtout, de les **isoler** les uns des autres. 

# Après

Finalement, après quelques années, je me suis rendu compte de tous les problèmes que j'avais avec mon serveur. En parallèle de tout ça, 
je suis passez par quelques jobs qui m'ont permis de gagner beaucoup d'expèrience en administration et surtout qui m'ont fait aimer ça.

De plus en plus, je me disais que, **en tant que développeur, connaitre les problèmes d'administration est une bonne chose.**

j'ai donc continué à explorer cette voie mais je ne me suis pas lancé immédiatement dans la refonte de mon serveur : j'ai attendu 
encore et encore.

Pendant ce temps, j'ai découvert plein de nouvelles choses, de nouvelles méthodes de travail et aujourd'hui, beaucoup de personnes 
me dise que j'ai un profil très DevOps. Je me suis orienté sur l'**outillage commun** pour les développeur et les administrateurs. 

Aujourd'hui je ne démarre plus un projet sans avoir au préalable construit un environnement de développement reproductible (j'utilise 
exclusivement Vagrant pour ça). S'il faut que je tape plus de trois lignes de commandes pour démarrer ce même projet, je m'arrête et 
j'optimise tout cela. Le but : **masquer toute la complexité** pour que chaque intervenant (vous l'aurez compris, je parle des 
développeurs et des administarateurs) puisse démarrer le projet en local, sur un serveur ou ailleurs **sans trop se soucier des détails 
et problèmes**.

J'ai donc appliqué cette même logique dans la reflexion qui m'a menée à migrer tout mon serveur. Ce que je voulais c'était avant tout 
**avoir une infrastructure solide et surtout en grande partie automatisée**. Je voulais pouvoir préparer l'hébergement d'un projet en 
moins d'une heure, monitorer tout cela facilement, faire des backups et les restaurer en un clin d'oeil, ... Et surtout, je voulais 
avoir un environement propre, dans lequel je pouvais faire mes tests sans impacter des applications en prod, jeter ce test, en 
démarrer un nouveau, ... **La virtualisation était donc ce qu'il me fallait !**

## ProxMox

D'après les problèmes que j'avais rencontrés auparavant, la solution qui me convient le plus est donc basée sur la virtualisation. 
La raison est très simple. En fait il y en a plusieurs :

* des environnements **isolés** les uns des autres
* des environnements **jetables**
* des environnements **reproductibles**
* une gestion des droits simplifiée

Après avoir regarder ce qui se faisait et **écouter les conseils de "ceux qui savent"** (les administrateurs de mon réseau et utilisateurs des
diverse technologie de virtualisation), je me suis tourné vers [ProxMox](http://www.proxmox.com/fr/). C'est un hyperviseur comme d'autres que 
vous pouvez connaître (Virtualbox par exemple) qui permet de gérer aussi bien des machines virtuelles que de *containers*.

Le plus dans tout cela, c'est qu'[Online.net](http://www.online.net/fr), chez qui je commande tous mes serveurs, propose en standard ProxMox comme distribution à 
installer sur les serveurs. Je n'ai donc eu aucun soucis pour la mettre en place : le service était *up* en quelques heures à peine en 
comptant la livraison du serveur. Magnifique !

ProxMox est finalement très **simple à utiliser** et propose pas mal de fonctionnalités en standard :

* authentification PAM : super, on peut directement se connecter en utilisant les utilisateurs du serveurs
* création et gestion de machines virtuelles [KVM](http://fr.wikipedia.org/wiki/Kernel-based_Virtual_Machine)
* création et gestion de *containers* [OpenVZ](http://fr.wikipedia.org/wiki/OpenVZ)
* gestion des *storages* (des espaces de stockage dédiés)
* gestion du réseau
* ...

Dernière chose, ProxMox est **accessible directement depuis une interface web**, voilà à quoi ça ressemble :

[screenshot]()

L'interface ne donne pas forcément envie, c'est du ExtJS, mais, dans la *stack* que j'ai montée, c'est loin d'être la pire :) 
(vous verrez quand je vous parlerais de HAproxy ou de CHef Server).

### KVM

KVM est l'un des technologies supportées par ProxMox en standard. Mais KVM, c'est quoi ?

> KVM (for Kernel-based Virtual Machine) is a full virtualization solution for Linux on x86 hardware containing virtualization
> extensions (Intel VT or AMD-V). It consists of a loadable kernel module, kvm.ko, that provides the core virtualization
> infrastructure and a processor specific module, kvm-intel.ko or kvm-amd.ko. KVM also requires a modified QEMU although work is
> underway to get the required changes upstream.
>
> -- [http://www.linux-kvm.org](http://www.linux-kvm.org/page/Main_Page)

Vous l'aurez compris, KVM est **une solution de virtualisation pour Linux basée sur [QEMU](http://fr.wikipedia.org/wiki/QEMU)**. 
Je ne rentrerais pas trop dans les détails ici pour éviter de vous raconter n'importe quoi. Si vous souhaitez obtenir plus de 
précisions sur cette technologie, demandez à "ceux qui savent", en l'occurence, pas moi car je ne suis pas spécialiste dans 
ce domaine.

Maintenant, vous vous demandez peut-être une chose : à l'heure ou les *containers* sont à la mode et qu'à priori, ils sont capables de 
résoudre pas mal de problèmes, pourquoi j'ai choisi de garder la possibilité de construire des machines virtuelles lourdes ?

Tout simplement parce que les *containers* ne peuvent pas tout faire et que surtout, je ne suis pas spécialiste de ces derniers et 
que, quand je pense que je vais avoir un problème avec des *containers* je passe sur des machines virtuelles car je les connais mieux.

Pour choisir, généralement je me pose ces questions :

* Qu'est-ce que je dois virtualiser ?
* Est-ce que j'ai réellement besoin de virtualiser un système complet ?
* Est-ce que je vais avoir besoin de m'y connecter en SSH ?
* Est-ce que je vais avoir besoin de démarrer des *containers* dedans ?
* Pour qui ?

La plupart du temps, ces questions me permettent de choisir **la solution qui me convient**. Ce ne sont peut-être pas les bonnes questions, 
ou en tout cas, pas **toutes** les bonnes questions mais elle fonctionnent pour l'instant dans mon cas.

Grosso-modo, je virtualise un système complet dans les cas suivants :

* Je veux reproduire un **système complet** (logiciel et matériel), par exemple, pour faire un serveur de *staging*
* Afin d'éviter les problèmes, si je dois démarrer des *containers* je choisirais de le faire dans une VM (je ne sais pas si démarrer un *container* dans un *container* fonctionne et est stable)
* Si je dois livrer ce système à un tiers, je livrerais une VM pour qu'il soit plus libre
* Si je dois virtualiser un système trop différent de l'hôte, je le fais avec une VM

Reste une dernière question : celle du SSH. Il n'y a pas si longtemps [un article](http://jpetazzo.github.io/2014/06/23/docker-ssh-considered-evil/)
a été publié sur le fait que démarrer le démon SSH dans un *container* était une erreur. Je suis plutôt d'accord sur ce point 
(vous comprendrez pourquoi en lisant la suite) et quand j'ai besoin d'un SSH, j'essaye de bien **comprendre pourquoi** et voir si je peux **faire 
autrement**. La plupart du temps, je me rend compte que je n'en ai pas besoin.

Pour finir, quelques chiffres : aujourd'hui, je surveille uniquement deux machines virtuelles (contre une douzaine de *containers*). 
Je dis "surveille" car ces machines virtuelles ne sont pas "à moi".

### OpenVZ

OpenVZ est la seconde technologie supportée en standard par ProxMox. C'est une solution de virtualisation basée sur les *containers* 
(vous connaissez certainement Docker qui fournit des *containers* LXC). Les *containers*, c'est un peu comme les machines virtuelles 
mais en beaucoup plus léger :

> OpenVZ is container-based virtualization for Linux. OpenVZ creates multiple secure, isolated Linux containers 
> (otherwise known as VEs or VPSs) on a single physical server enabling better server utilization and ensuring that 
> applications do not conflict.
>
> -- [http://openvz.org/Main_Page](http://openvz.org/Main_Page)

Qu'est-ce qui est intéressant dans cette définition ? Principalement une chose : "ensuring that applications do not conflict". En gros, 
les *containers* permettent d'**isoler une application** dans un environnement. C'est très pratique et je suis presque sur que ces 
derniers auraient pu vous sauver la vie plus d'une fois si vous ne les utilisez pas.

Essayez de remonter dans vos souvenirs. Vous avez certainement déjà essayé de mettre à jour une brique sur l'un de vos serveurs et 
renoncé car la `libc` installée était trop vieille pour pouvoir installer la dernière version trop bien de tel ou tel service ou runtime.

Avec les *containers* tout ça, c'est de l'histoire ancienne. **Chacun de vos services aura son propre environnement**, isolé et adapté. 
C'est juste magique !

Mon utilisation des *containers* est assez basique mais me permet d'adresser presque tous les problèmes que j'ai pu avoir jusqu'à 
aujourd'hui, à savoir, isoler des services afin de pouvoir les mettre à jour sans risque de casser autre chose. L'effet de bord
intéressant dans tout ça, c'est que je peux **facilement dupliquer un service** et donc *scaler* très facilement.

Généralement, lorsque je mets en place un *containers*, je le fais de la manière suivante :

* démarrage du *container* avec une configuration surdimensionnée
* installation du service dans l'environnement
* monitoring du *container* pendant quelque temps
* adaptation de la configuration au fur et à mesure

Vous l'aurez compris, mes *containers* sont très spécialisés (**SRP**), **ils n'hébergent généralement qu'un seul service**. Je m'autorise 
parfois à y installer plusieurs services tant que ceux-ci ont un *scope* commun : par exemple, un de mes *containers* héberge mon 
*bouncer* IRC mais aussi l'application web qui me permet de consulter les logs des salons et mon *bot* IRC. Le scope est le même, on 
travail avec IRC.

Comme je vous le disais, je commence toujours par démarrer mes *containers* avec une configuration surdimensionnée que j'adapte ensuite. 
Cela va me permettre de vous parler d'une chose que les *containers* proposent : **on peut les modifier à chaud**. Si je veux ajouter un 
CPU, je le fais sans avoir de coupure de service. Même chose pour la RAM.

Voilà, maintenant vous savez comment j'utlise la virtuaisation pour subvenir à mes besoins. Mais **la virtualisation ne fait pas tout**. 
Avec ces technologies, vous vous retrouverez presque dans le même cas qu'un administrateur qui gère plein de machines physiques. 
Gérer une infrastructure de ce type demande de mettre en place d'autres outils afin de lier les environnements les uns aux autres et 
de les monitorer.

Je vous expliquerais dans un prochain article comment j'ai démarré les premiers *containers* et VMs et quels services j'ai du installer
pour coordonner tout ce beau monde. Nous parlerons donc de NAT, de DNS, de Syslog et d'autres choses un peu plus marrantes (en tout cas
pour mes amis développeurs) comme les outils que j'ai développé pour me simplifier la vie.
