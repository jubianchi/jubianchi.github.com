***
{
    "title": "atoum feature preview #3 : aliasing",
    "type": "post",
    "date": "2014-05-27 23:29:00",
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

Dans cet article nous allons découvrir comment créer un vocabulaire propre à vos tests : en effet, atoum propose
une API pour <em>aliaser</em> les assertions natives ou en créer de nouvelles.

Commençons par l'<em>aliasing</em>. Comme vous allez le voir, l'API est très simple et très naturelle :

<pre class="line-numbers"><code class="language-php">namespace tests\units;

use mageekguy\atoum;

class stdClass extends atoum\test
{
	public function __construct(adapter $adapter = null, annotations\extractor $annotationExtractor = null, asserter\generator $asserterGenerator = null, test\assertion\manager $assertionManager = null, \closure $reflectionClassFactory = null)
	{
		parent::__construct($adapter, $annotationExtractor, $asserterGenerator, $assertionManager, $reflectionClassFactory);

		$this
			->from('string')->use('isEqualTo')->as('equals')
		;
	}

	public function testFoo()
    {
        $this
            ->string($u = uniqid())->equals($u)
        ;
    }
}</code></pre>

Qu'est-ce que nous avons fait ici ? Nous avons tout simplement créé un alias pour l'assertion <code>string::isEqualTo</code>.
Comme je vous le disais, l'API est très simple. Vous pourrez faire la même chose avec toutes les assertions natives d'atoum.

Pendant l'écriture de certains tests, vous vous retrouverez peut-être à écrire souvent les mêmes assertions pour valider
les mêmes types de données. Par exemple, si vous écrivez une classe qui travaille avec des numéros de carte bleue, vous
utiliserez certainement beaucoup l'assertion <code>string::match</code> pour valider le numéro à l'aide d'une expression
rationnelle. Recopier ces assertions plusieurs fois peut poser problème :

* L'expression rationnelle sera écrite à plusieurs endroits dans la suite de test. Si elle doit changer, la maintenance
sera plus compliquée
* Les tests sont barbants à écrire
* Les tests ne sont pas très lisibles

Voyonc comment corriger tout ces problèmes d'un coup :

<pre class="line-numbers"><code class="language-php">namespace tests\units;

use mageekguy\atoum;

class creditcard extends atoum\asserters\string
{
	public function isValid($failMessage = null)
	{
		return $this->match('/(?:\d{4}){4}/', $failMessage ?: $this->_('%s is not a valid credit card number', $this));
	}
}

class stdClass extends atoum\test
{
	public function __construct(adapter $adapter = null, annotations\extractor $annotationExtractor = null, asserter\generator $asserterGenerator = null, test\assertion\manager $assertionManager = null, \closure $reflectionClassFactory = null)
	{
		parent::__construct($adapter, $annotationExtractor, $asserterGenerator, $assertionManager, $reflectionClassFactory);

		$this->getAsserterGenerator()->addNamespace('tests\units');
	}

	public function testFoo()
	{
		$this
			->creditcard('4444555566660000')->isValid()
		;
	}
}</code></pre>

Plusieurs choses sont à noter ici :

* atoum cherche les assertions en parcourant une liste de namespaces dans lesquels il cherche des classes qui étendent <code>mageekguy\atoum\asserters\string</code>.
* pour ajouter de nouveaux namespaces à cette liste, il faut appeler la méthode <code>addNamespace</code> du générateur d'assertions.

Afin d'utiliser ces fonctionnalités de manière optimale, il sera préférable de centraliser toutes les classes de vos assertions
dans un namespace dédié de votre projet. De même, pour les alias, il sera préférable de les définir dans une classe
qui étend <code>mageekguy\atoum\test</code>. Vos classes de tests étendront ensuite simplement cette classe. Voici un exemple :

<pre class="line-numbers"><code class="language-php">namespace my\project {
    // ...
}

namespace my\project\tests {
    use mageekguy\atoum;

    class test extends atoum\test
    {
        public function __construct(adapter $adapter = null, annotations\extractor $annotationExtractor = null, asserter\generator $asserterGenerator = null, test\assertion\manager $assertionManager = null, \closure $reflectionClassFactory = null)
        {
            parent::__construct($adapter, $annotationExtractor, $asserterGenerator, $assertionManager, $reflectionClassFactory);

            $this->getAsserterGenerator()->addNamespace(__NAMESPACE__ . '\asserters');

            $this
                ->from('string')->use('isEqualTo')->as('equals')
                ->from('integer')->use('isEqualTo')->as('equals')
                // ...
            ;
        }
    }
}

namespace my\project\tests\asserters {
    use mageekguy\atoum;

    class creditcard extends atoum\asserters\string { /*...*/ }
    class zipcode extends atoum\asserters\string { /*...*/ }
}

namespace my\project\tests\units {
    use my\project\tests;

    class foo extends tests\test
    {
        public function testFoo()
    	{
    		$this
    		    ->string($u = uniqid())->equals($u)
    			->creditcard('4444555566660000')->isValid()
    		;
    	}
    }
}
</code></pre>

Je vous laisse découvrir ces fonctionnalités plus en détails en les utilisant. Si vous avez besoin d'aide, vous pouvez toujours
nous rejoindre sur IRC (<code>freenode##atoum</code>).
