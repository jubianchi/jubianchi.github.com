***
{
    "title": "Vagrant Cloud",
    "type": "post",
    "date": "2014-03-10 20:46:00",
    "layout": "post.twig",
    "tags": ["vagrant", "cloud"],
    "summary": "Depuis quelques jours, je participe à la beta privée de <a href=\"https://vagrantcloud.com\">vagrant cloud</a>. Vagrant Cloud, c'est un peu le futur de vagrant : un site où on peut facilement partager nos boxes mais également, partager nos VMs."
}
***

Vagrant, vagrant, encore vagrant... je vous en parle beaucoup ces derniers temps; et ce n'est pas pour rien !

Depuis quelques jours, je participe à la beta privée de [vagrant cloud](https://vagrantcloud.com). Vagrant Cloud, c'est un peu le futur de
vagrant : un site où on peut facilement partager nos boxes mais également, partager nos VMs.

Depuis aujourd'hui, le 10 mars 2014, cette plateforme est ouverte à tous :

<blockquote class="twitter-tweet" lang="en"><p>Vagrant 1.5 and Vagrant Cloud are now available! <a href="http://t.co/SGzqX2WqbK">http://t.co/SGzqX2WqbK</a> Vagrant Share, Boxes 2.0, Rsync synced folders, Hyper-V, and more!</p>&mdash; Mitchell Hashimoto (@mitchellh) <a href="https://twitter.com/mitchellh/statuses/443069185858760705">March 10, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Maintenant que j'ai le droit de vous en parler un peu, je vais vous donner quelques infos. Mais d'abord, laissez-moi vous montrer le résultat de
mes tests : [https://vagrantcloud.com/jubianchi](https://vagrantcloud.com/jubianchi).

J'ai profité de l'accès que j'avais pour vous bricoler quelques petites base boxes pour PHP. Vous en trouverez 3 (5.4, 5.5 et 5.6)
plus ou moins équipées. Je vais essayer de maintenir ces boxes à jour avec les dernières versions de PHP. Le plan, c'est que je
release une nouvelle version de chaque box à chaque fois qu'une nouvelle version de PHP est publiée. J'essayerais également de
garder en ligne un maximum de version de ces boxes afin que vous puissiez facilement revenir à une version de PHP, juste en
bidouillant un peu votre `Vagrantfile`. Dernière chose, les sources que j'utilise pour construire ces boxes sont disponibles sur
[Github](https://github.com/jubianchi/vagrant-boxes). Vos contributions sont les bienvenues.

Bon, revenons-en au site [vagrantcloud.com](https://vagrantcloud.com). Il a plusieurs objectifs:

* Permettre de rechercher et trouver facilement des base boxes vagrant
* Faciliter le partage des base boxes
* Faciliter la vie des mainteneurs en leur fournissant des outils de versionnement
* Faciliter la vie des utilisateurs lorsqu'il s'agit de mettre à jour les bases boxes

Vous trouverez donc sur cette plateforme un moteur de recherche de box. Les utilisateurs de vagrant ont l'air très actifs, je
vois de nouvelles boxes arriver régulièrement ces dernières heures.

Avec votre compte, vous pourrez directement partager vos base boxes (à condition de pouvoir les héberger quelque part) afin d'en faire
profiter tout le monde. Cela vous permettra de partager facilement d'éventuellles boxes requises pour travailler sur vos projets.
Pour vous donner un exemple, j'ai publié une première version d'[une box](https://vagrantcloud.com/jubianchi/hoaproject-php-55)
permettant de démarrer rapidement avec [Hoa](http://hoa-project.net) (je vous en dirais plus à ce sujet très prochainement).

Les mainteneurs de boxes (peut être vous) pourront facilement gérer le versionnement de leurs boxes. Le site propose une gestion
simple mais très efficace des version, en lien direct avec la commande `vagrant`.

Grâce aux nouvelles fonctionnalités de vagrant 1.5, les utilisateurs donc pourront facilement vérifier s'ils utilisent la dernière
version des boxes que vous avez publiées et les mettre à jour si besoin (`vagrant box outdated` et `vagrant box update`).
Avant, il fallait vérifier à la main l'évolution des boxes qu'on utilisait et souvent, cela était compliqué.

Une dernière chose : j'ai gardé le meilleur pour la fin :)

Vagrant 1.5 propose une nouvelle fonctionnalité assez énorme : les vagrant shares.
En gros, vous pouvez maintenant partager votre VM (oui, oui votre VM, celle qui tourne sur votre poste) avec n'importe qui !
Lancez la commande `vagrant share` et copiez l'identifiant qu'elle vous donne. Transmettez-le à un collègue qui travaille à l'autre
bout de la France. En un coup de `vagrant connect <identifiant>` votre ami pourra se connecter à votre VM. C'est pas magnifique ?

Voilà, le teasing est terminé, je vous encourage donc vivement à [mettre à jour vagrant](http://www.vagrantup.com/downloads.html) sur votre poste (quoi vous ne l'avez pas encore installer ?!)
et à profiter de ses nouvelles fonctionnalités. Si vous souhaitez en savoir plus, faites un tour par le [blog](http://www.vagrantup.com/blog.html) ainsi que la [documentation](http://docs.vagrantup.com/v2/).
