***
{
    "title": "Tests unitaires et adapters avec atoum",
    "summary": "Nous avons récemment eu quelques discussions sur les <em>adapters</em> sur le salon IRC de atoum (pour rappel, celui-ci se trouve sur les serveurs Freenode, canal ##atoum). Plusieurs questions ont été traitées : nous avons parlé de l'utilité de ces <em>adapters</em>, des possibilités qu'ils offrent dans le cadre de tests unitaires mais également des inconvénients et des bonnes pratiques à mettre en place pour bien les utiliser. Je vais donc tenter ici d'eclaircir ces quelques points à travers des exemples relativement simples. J'utiliserais <a href=\"https://github.com/atoum/atoum\" title=\"atoum\">atoum</a> pour les tests qui seront écrits pour une classe gérant une connexion à un serveur FTP.",
    "type": "post",
    "date": "2012-12-04 12:16:00",
    "layout": "post.twig",
    "tags": ["php", "atoum", "test"],
    "twitter": {
        "widget": "293009231949471744",
        "url": "https://twitter.com/search?q=%23atoum",
        "title": "Tweets about #atoum"
    }
}
***
Nous avons récemment eu quelques discussions sur les *adapters* sur le salon IRC de atoum (pour rappel, celui-ci se
trouve sur les serveurs Freenode, canal ##atoum). Plusieurs questions ont été traitées : nous avons parlé de l'utilité
de ces *adapters*, des possibilités qu'ils offrent dans le cadre de tests unitaires mais également des inconvénients et
des bonnes pratiques à mettre en place pour bien les utiliser. Je vais donc tenter ici d'eclaircir ces quelques points
à travers des exemples relativement simples. J'utiliserais _atoum_ pour les tests qui seront écrits pour une classe
gérant une connexion à un serveur FTP.

### Le pattern Adapter

Avant de commencer, nous allons faire un petit rappel sur le design pattern *Adapter*. Voici un extrait de la définition
donnée par Wikipedia :

> The adapter translates calls to its interface into calls to the original interface, and the amount of code necessary
> to do this is typically small.
>
> — [Wikipedia - Adapter Pattern](http://en.wikipedia.org/wiki/Adapter_pattern)

Cette définition nous dit que l'*Adapter* traduit des appels d'une interface vers une autre avec un minimum de code. En
d'autres termes, elle n'est qu'un proxy.

### L'intérêt des Adapters pour les tests unitaires

Lorsqu'on souhaite utiliser les tests unitaires pour valider notre code de la manière la plus approfondie possible, il
est souvent nécessaires d'utiliser certaines bonnes pratiques qui permettent de mettre en place cette stratégie.
Vous avez donc certainement entendu parler de l'injection de dépendances par exemple qui règle très bien certains
problèmes : ma classe testée à besoin d'une autre classe pour fonctionner et celle-ci lui sera injectée au moment voulu
dans les tests, idéalement sous forme de mock. Mais qu'en est-il lorsque la classe testée est directement dépendante
de l'environement.

Mais qu'est ce que "dépendante de l'environement" signifie ? A un moment, vous vous retrouverez certainement avec des
méthodes qui utilisent des fonctions natives de PHP pour tester l'existence d'un fichier par exemple ou, pour rester
dans le cadre de l'exemple que je vais introduire par la suite, qui se connecte à des serveurs FTP toujours via les
fonctions natives du langage. A ce moment là, vous aurez certainement des difficultés pour tester tous les cas possibles
dans votre code : mon fichier existe ou n'existe pas, le serveur FTP est disponible, le login entré est invalide, ...
Les *adapters* sont là pour nous permettre de tester ces cas très simplement et de manière très intuitive (en tout cas
avec *atoum*)

### Sans les adapters

Comme je vous le disais, nous allons travailler sur un exemple présentant une classe qui permet de se connecter à un
serveur FTP via les fonctions natives de PHP. Cet exemple est assez basique mais il a l'avantage de montrer rapidement
les problèmes que l'on peut rencontrer :

<pre class="line-numbers"><code class="language-php">namespace tests\unit {
    use
        mageekguy\atoum,
        Ftp as TestedClass
    ;

    class Ftp extends atoum\test {
        public function test__construct() {
            $this
                -&gt;object(new TestedClass())-&gt;isInstanceOf('\\Ftp')
            ;
        }
    }
}

namespace {
    class Ftp
    {
        public function __construct()
        {
            if (false === extension_loaded('ftp')) {
                throw new \RuntimeException('FTP extension is not loaded');
            }
        }

        //...
    }
}</code></pre>

<pre class="line-numbers"><code class="language-bash">#!/bin/bash

bin/atoum -f 'tests/listing/Adapter/1.php'

&gt; tests\unit\Ftp...
[S___________________________________________________________][1/1]
=&gt; Test duration: 0.00 second.
=&gt; Memory usage: 0.50 Mb.
&gt; Total test duration: 0.00 second.
&gt; Total test memory usage: 0.50 Mb.
&gt; Code coverage value: 66.67%
=&gt; Class Ftp: 66.67%
==&gt; Ftp::__construct(): 66.67%</code></pre>

Nous avons donc notre test unitaire qui va vérifier que l'instanciation de notre classe ```Ftp``` se passe bien.
Pour que ce test passe, il faudra obligatoirement que la machine qui l'exécute ait l'extension PHP FTP installée et
activée. Si cette condition n'est pas respectée, une exception sera levée et notre test passera au rouge.

Si nous souhaitons tester cette exception, il faudra obligatoirement que la machine exécutant les tests n'ait pas
l'extension requise.

En d'autres termes, il va être très difficile de tester les deux cas dans un seul test unitaire exécuté sur la même
machine à moins de passer par des "hacks" que je ne détaillerais pas ici.

Rappelez-vous bien une chose : nous sommes dans le cadre de tests unitaires et il serait très dommage de les coupler
à l'environnement sur lequel ils sont exécutés, c'est donc là que les *adapters* vont nous aider.

### Comment utiliser les Adapters

Les classes qui utiliseront l'*adapter* auront donc une dépendance supplémentaire vers ce proxy. Ne vous inquiétez pas,
dans l'idéal, votre code sera fait de telle manière que l'injection de cette dépendance soit optionnelle. Voyons tout
de suite un extrait de code qui illustre mes propos :

<pre class="line-numbers"><code class="language-php">use
    mageekguy\atoum
;

class Ftp
{
    private $adapter;

    public function __construct(atoum\adapter $adapter = null)
    {
        $this->setAdapter($adapter);

        if (false === $this->getAdapter()-&gt;extension_loaded('ftp')) {
            throw new \RuntimeException('FTP extension is not loaded');
        }
    }

    public function setAdapter(atoum\adapter $adapter = null)
    {
        $this->adapter = $adapter;

        return $this;
    }

    public function getAdapter()
    {
        if (null === $this-&gt;adapter) {
            $this->adapter = new atoum\adapter();
        }

        return $this-&gt;adapter;
    }

    //...
}</code></pre>

Comme vous pouvez le constater à travers cet extrait de code, l'injection de l'*adapter* est optionnelle et dans le cas
où celui-ci n'est pas fourni, un *adapter* par défaut sera créé et utilisé au sein de la classe ```Ftp```.
Nous autorisons également l'injection de cette dépendance par le constructeur et par un mutateur (setter) : cela nous
permettra d'injecter l'*adapter* adéquat dans les tests unitaires.

Vous avez certainement noté que le constructeur de notre classe ```Ftp``` a été modifié : l'appel à
```extension_loaded``` passe désormais par notre *adapter* et cela va nous permettre d'étoffer notre test unitaire et
d'y ajouter quelques cas supplémentaires :

<pre class="line-numbers"><code class="language-php">class Ftp extends atoum\test {
    public function test__construct() {
        $this
            -&gt;if($adapter = new atoum\test\adapter())
            -&gt;and($adapter-&gt;extension_loaded = true)
            -&gt;then
                -&gt;object(new TestedClass($adapter))-&gt;isInstanceOf('\\Ftp')

            -&gt;if($adapter->extension_loaded = false)
            -&gt;then
                -&gt;exception(
                    function() use($adapter) {
                        new TestedClass($adapter);
                    }
                )
                    -&gt;isInstanceOf('\\RuntimeException')
                    -&gt;hasMessage('FTP extension is not loaded')
        ;
    }
}</code></pre>

<pre class="line-numbers"><code class="language-bash">#!/bin/bash

bin/atoum -f 'tests/listing/Adapter/2-3.php'

&gt; tests\unit\Ftp...
[S___________________________________________________________][1/1]
=&gt; Test duration: 0.01 second.
=&gt; Memory usage: 0.50 Mb.
&gt; Total test duration: 0.01 second.
&gt; Total test memory usage: 0.50 Mb.
&gt; Code coverage value: 80.00%
=&gt; Class Ftp: 80.00%
==&gt; Ftp::getAdapter(): 50.00%</code></pre>

On se rend immédiatement compte des avantages que l'*adapter* nous procure : nous sommes maintenant capable de tester
notre classe sans nous soucier de la configuration de la machine exécutant les tests. Et en bonus, nous avons la
possibilité de simuler la présence ou l'absence de l'extension ce qui nous permet d'obtenir une couverture plus
importante (nous sommes passé de 67% à 80%) !

Notre code y gagne en testabilité et donc en fiabilité si les tests adéquats sont mis en place. La contrepartie, c'est
que nous sommes désormais dépendant de l'*adapter* et que cela peut nous jouer des tours dans certains cas
(les performances peuvent par exemples être impactées).

### Attentions aux pièges !

#### Ne pas être dépendant du framework de test dans le code de production

L'utilisation des *adapters* apporte beaucoup de choses mais il faut les utiliser avec précaution. Si vous remontez au
paragraphe précédent, vous verrez que le code de la classe ```Ftp``` est maintenant dépendant de l'*adapter* par défaut
d'*atoum* : dans l'idéal, il faut éviter cela ! Votre code de production ne doit en aucun cas avoir de dépendance forte
avec votre framework de test ! Mais comment contourner cela ?

Afin de décoreller votre projet du framework de test, il vous faudra écrire quelques interfaces qui vous permettront
d'abstraire cette dépendance et éventuellement de migrer vers un autre framework de test sans trop de douleur.

Je vais vous présenter ici la méthode que j'utilise afin d'arriver à un tel résultat, à savoir, un *adapter* indépendant
du framework de test :

<pre class="line-numbers"><code class="language-php">namespace {
    interface AdapterInterface
    {
        public function invoke($name, array $args = array());
    }

    class Adapter implements AdapterInterface
    {
        public function invoke($name, array $args = array())
        {
            if (is_callable($name)) {
                return call_user_func_array($name, $args);
            }

            throw new \RuntimeException(sprintf('%s is not callable', var_export($name)));
        }

        public function __call($name, $args)
        {
            return $this-&gt;invoke($name, $args);
        }
    }
}

namespace Test {
    use
        mageekguy\atoum\test\adapter as AtoumAdapter
    ;

    class Adapter extends AtoumAdapter implements \AdapterInterface
    {
    }
}</code></pre>

Nous définissons donc, dans notre projet, une interface standard qui décrit nos *adapters* ainsi, nos classes seront
dépendantes de cette abstraction :

<pre class="line-numbers"><code class="language-php">class Ftp
{
    private $adapter;

    public function __construct(AdapterInterface $adapter = null)
    {
        $this-&gt;setAdapter($adapter);

        if (false === $this-&gt;getAdapter()-&gt;extension_loaded('ftp')) {
            throw new \RuntimeException('FTP extension is not loaded');
        }
    }

    public function setAdapter(AdapterInterface $adapter = null)
    {
        $this-&gt;adapter = $adapter;

        return $this;
    }

    public function getAdapter()
    {
        if (null === $this->adapter) {
            $this-&gt;adapter = new Adapter();
        }

        return $this->adapter;
    }

    //...
}</code></pre>

<pre class="line-numbers"><code class="language-bash">#!/bin/bash

bin/atoum -f tests/listing/Adapter/4-5.php

&gt; tests\unit\Ftp...
[S___________________________________________________________][1/1]
=&gt; Test duration: 0.01 second.
=&gt; Memory usage: 0.50 Mb.
&gt; Total test duration: 0.01 second.
&gt; Total test memory usage: 0.50 Mb.
&gt; Code coverage value: 80.00%
=&gt; Class Ftp: 80.00%
==&gt; Ftp::getAdapter(): 50.00%</code></pre>

Comme vous pouvez le voir, la dépendance vers *atoum* a disparue de notre code de production ! Nous sommes maintenant
dépendant de notre ```Adapterinterface``` et de l'implémentation par défaut que nous avons ajoutée.

#### Attention aux performances

Nous avons vu dans l'exemple précédent comment découpler facilement nos *adapters* du framework de test. Pour cela, nous
avons mis en place une interface : désormais, toutes nos classes nécessitant un *adapter* peuvent se reposer sur cette
interface. Nous avons également mis en place une implémentation par défaut afin de répondre à un maximum de besoin
rapidement et avec un minimum de code (souvenez-vous de la définition de Wikipedia).

Cette implémentation a un inconvénient majeur : afin de combler un maximum de besoin, cette classe se base sur la
fonction PHP ```call_user_func_array```. Dans certains cas, cette méthode peu être coûteuse en terme de temps
d'exécution (voir mon benchmark [ici](https://github.com/jubianchi/PHPSandbox/tree/master/call_user_func)) : la
différence est négligeable dans le cas de ce benchmark mais on remarque quand même des écart pouvant aller
jusqu'à environ 5% !

Pour corriger ce problème, il faut se plonger un peu plus dans la théorie du pattern *adapter* : à la base, ce pattern
a été imaginé dans le but d'abstraire d'une dépandence. Il va décrire, via son interface, les besoins de la classe
cliente et, à travers ses différentes implémentations, y répondre. Donc, en théorie, votre code de production devrait
dépendre d'un *Adapter* spécifique à chaque cas : dans notre exemple, la classe ```Ftp``` devrait dépendre d'un ```FtpAdapter```
qui fournirait l'implémentation des méthodes nécessaires.

#### Attention aux abus

Comme toute technique utilisée en programmation, les *adapters* demandent à être utilisé avec précaution et surtout de
manière judicieuse : il ne faut pas en abuser (par exemple, ne passez pas tous vos appels à ```sprintf``` par un ```Adapter``` : dans la plupart des cas (tous ?) , ce sera inutile).
Identifiez les cas où l'utilisation de ceux-ci vous apporte réellement un plus au niveau de la testabilité et/ou de
l'architecture de vos composants.

<pre class="line-numbers"><code class="language-php">// INUTILE
$this->getAdapter()->file_get_contents($this->getAdapter()->md5($value) . '.txt');

// CORRECT
$this->getAdapter()->file_get_contents(md5($value) . '.txt');

// ADAPTER
$adapter->file_get_contents = function() { return 'foobar'; };</code></pre>
