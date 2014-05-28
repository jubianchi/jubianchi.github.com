***
{
    "title": "atoum feature preview #2 : mock pleaz",
    "type": "post",
    "date": "2014-05-27 22:29:00",
    "layout": "post.twig",
    "tags": ["php", "atoum", "test"],
    "twitter": {
        "widget": "293009231949471744",
        "url": "https://twitter.com/search?q=%23atoum",
        "title": "Tweets about #atoum"
    }
}
***

Cet article est le second d'une série qui était censée vous présenter les fonctionnalités à venir dans atoum.
**Aujourd'hui, ces fonctionnalités sont disponible sur le <code>master</code> d'atoum.**

<pre class="line-numbers"><code class="language-javascript">{
    "require-dev": {
        "atoum/atoum": "dev-master"
    }
}</code></pre>

Dans cet article, nous allons découvrir plusieurs nouveautés autour des _mock_ dans atoum. L'API des mocks,
autant au niveau des controlleurs que des assertions, s'est vue dotée de plusieurs nouvelles petites fonctions
qui vont vous permettre d'écrire des tests encore plus clairs, plus facilement.

Commençons par voir comment créer et configurer un mock classique :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;
use jubianchi\atoum\preview\foo as testedClass;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if(
                $foo = new \mock\jubianchi\atoum\preview\foo(),
                $this->calling($foo)->bar = $foo,
                $this->calling($foo)->baz = null
            )
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
                ->variable($foo->baz())->isNull

            ->if(
                $foo = new \mock\jubianchi\atoum\preview\foo(),
                $this->calling($foo)->bar = $foo
            )
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
                ->string($foo->baz())->isEqualTo('baz')
        ;
    }
}</code></pre>

Dans cette exemple, nous avons deux cas de test : le premier, dans lequel nous avons redéfini 2 méthodes du mock
et le second, dans lequel nous redéfinissons unqiuement 1 méthode du mock. Ce test peut être amélioré pour être plus
clair, et atoum nous propose les solutions suivantes :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;
use jubianchi\atoum\preview\foo as testedClass;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if(
                $foo = new \mock\jubianchi\atoum\preview\foo(),
                $this->calling($foo)->bar->isFluent,
                $this->calling($foo)->baz->doesNothing
            )
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
                ->variable($foo->baz())->isNull

            ->if($this->calling($foo)->baz->doesSomething)
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
                ->string($foo->baz())->isEqualTo('baz')
        ;
    }
}</code></pre>

Qu'est-ce que nous avons donc :

* <code>$this->calling($foo)->bar->isFluent</code> (ligne 13) permet, comme son nom l'indique, de rendre la méthode
fluide (elle retourne l'instance de l'objet par lequel elle est appelée). La méthode <code>isFluent</code> est un alias
do <code>returnThis</code>, vous pouvez donc également utiliser <code>$this->calling($foo)->bar->returnThis</code>.
* <code>$this->calling($foo)->baz->doesNothing</code> (ligne 14) permet de rendre une méthode inopérante, elle
retournera donc <code>null</code>. Vous pouvez donc facilement désactiver une méthode.
* <code>$this->calling($foo)->baz->doesSomething</code> permet de restaurer le comportement original de la méthode.
L'utilisation de cette méthode a permit de supprimer un peu de code dans l'exemple précédent : en effet, on n'a plus besoin
de recréer une instance du mock pour restaurer ses méthodes.

Passons maintenant aux assertions. Voyons tout de suite un exemple (encore) :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;
use jubianchi\atoum\preview\foo as testedClass;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if($foo = new \mock\jubianchi\atoum\preview\foo())
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
                ->mock($foo)
                    ->call('boo')->once()
                    ->call('baz')->exactly(4)
        ;
    }
}</code></pre>

Il n'y a pas grand chose dans ce test, mais ce n'est pas pour ça qu'il n'y a rien à proposer en terme de
sucre syntaxique :

<pre class="line-numbers"><code class="language-php">namespace jubianchi\atoum\preview\tests\units;

use atoum;
use jubianchi\atoum\preview\foo as testedClass;

class foo extends atoum
{
    public function testBar()
    {
        $this
            ->if($foo = new \mock\jubianchi\atoum\preview\foo())
            ->then
                ->object($foo->bar())->isIdenticalTo($foo)
                ->mock($foo)
                    ->call('boo')->once
                    ->call('baz')->{4}
        ;
    }
}</code></pre>

Comme vous le voyez, les paranthèses de <code>once</code> sont devenue optionnelles et il en va de même pour ses
soeurs, <code>twice</code> et <code>thrice</code>.

Nous avons également introduit une nouvelle petite syntaxe dans atoum pour remplacer les appels à <code>exactly</code> :
vous pouvez maitenant utiliser <code>->{n}</code> (où <code>n</code> est un entier).
