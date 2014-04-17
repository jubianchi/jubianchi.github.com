***
{
    "title": "atoum feature preview #1 : newTestedInstance & testedInstance",
    "type": "post",
    "date": "2014-04-16 21:04:00",
    "layout": "post.twig",
    "tags": ["php", "atoum", "test"],
    "twitter": {
        "widget": "293009231949471744",
        "url": "https://twitter.com/search?q=%23atoum",
        "title": "Tweets about #atoum"
    }
}
***

Cet article est le premier d'une série qui va vous présenter les fonctionnalités à venir dans atoum.
Ces fonctionnalités ne sont actuellement pas disponible sur le <code>master</code> d'atoum mais vous pouvez les
tester en utilisant la branche <code>edge</code> :

<pre class="line-numbers"><code class="language-javascript">{
    "require-dev": {
        "atoum/atoum": "dev-edge"
    }
}</code></pre>

Pour vous présenter cette nouvelle fonctionnalité, nous allons tout d'abord commencer par regarder un exemple
de test atoum standard :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;
use jubianchi\atoum\preview\foo as testedClass;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if($foo = new testedClass())
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
        ;
    }
}</code></pre>

Ce test, tout à fait anodin, présente en réalité deux défauts :

* on manipule d'une part beaucoup le nom de la classe testée
* on manipule les instances de la classe testée au travers de variables

Répéter le nom de la classe testée dans le test peut devenir un problème lorsqu'on souhaite renommer la classe : cela
nous oblige à intervenir dans le code du test. Dans l'exemple précédent, on utilise déjà un alias pour parer les
éventuels problèmes mais atoum va vous aider à supprimer presque totalement la nécessité de toucher au code du test
dans ce cas :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if($this->newTestedInstance)
            ->then
                ->object($this->testedInstance->bar())
                    ->isTestedInstance()
        ;
    }
}</code></pre>

Et voilà, le nom de la classe <code>foo</code> n'apparait plus qu'une fois dans le code du test !

Vous l'aurez compris, c'est <code>newTestedInstance</code> et <code>testedInstance</code> que je veux vous présenter.
Ces deux nouveaux _handlers_ vont vous permettre, respectivement, d'instancier une nouvelle instance de la classe testée
et d'y accéder.

Vous aurez également remarqué l'assertion `isTestedInstance` qui permet de vérifier qu'un objet est identique à
l'instance de test courante.

<code>newTestedInstance</code> vous permettra donc de créer une nouvelle instance de la classe testée très facilement.

Si le constructeur de la classe testée ne nécessite aucun argument, vous pourrez appeler <code>newTestedInstance</code>
en omettant les parenthèses.

Si vous souhaitez passer des arguments au constructeur de la classe, passez-les simplement à <code>newTestedInstance</code> :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if($this->newTestedInstance(uniqid(), uniqid())
            ->then
                ->object($this->testedInstance->bar())
                    ->isTestedInstance()
        ;
    }
}</code></pre>

Enfin, si la classe testée est abstraite, <code>newTestedInstance</code> instanciera automatiquement un mock de cette dernière.

Une dernière chose pour finir : si vous utilisez une version de PHP supérieur ou égale à 5.4, les tests sur les exceptions
peuvent également être améliorés :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;
use jubianchi\atoum\preview\foo as testedClass;

class foo extends atoum
{
    // Avant
    public function testBar()
    {
        $this
            ->if($foo = new testedClass())
            ->then
                ->exception(function() use ($foo) { $foo->bar(); })
                    ->IsInstanceOf('RuntimeException')
        ;
    }

    // Après
    public function testBar()
    {
        $this
            ->if($this->newTestedInstance)
            ->then
                ->exception(function() { $this->testedInstance->bar(); })
                    ->IsInstanceOf('RuntimeException')
        ;
    }
}</code></pre>

Et voilà, plus de <code>use</code> !

Merci à <a href="http://blog.mageekbox.net/">@mageekguy</a> pour tout le travail qu'il a fourni pour vous proposer ces nouvelles fonctionnalités !

N'oubliez pas que vous pouvez tester tout cela en utilisant la branche <code>edge</code> d'atoum. La _pull-request_
contenant le code est disponible [ici](https://github.com/atoum/atoum/pull/320) : n'hésitez pas à ajoutez vos commentaires.