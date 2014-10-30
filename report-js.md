***
{
    "title": "Report.js - Et si on essayait",
    "summary": "Nous en avons parlé hier sur Twitter, Report.js est une librairie frontend, écrite par @riadbenguella, permettant de générer des tableaux multi-dimensionnels et des graphiques à partir d'une structure de données.",
    "type": "post",
    "date": "2014-10-29 21:16:00",
    "layout": "post.twig",
    "tags": ["js", "reporting"]
}
***

Nous en avons parlé hier sur Twitter, [Report.js](https://github.com/youknowriad/report.js/blob/master/README.md) est une librairie frontend,
écrite par [@riadbenguella](https://twitter.com/riadbenguella), permettant de générer des tableaux multi-dimensionnels et des graphiques à partir d'une structure de données.

Je ne vais pas vous parler dans le détail de cette librairie, si vous souhaitez en savoir plus sur son fonctionnement,
rendez-vous directement sur [le site de l'auteur](http://riadbenguella.com/) [où](http://riadbenguella.com/javascript-reporting-done-right-with-report-js/)
il explique tout cela, ou aller lire directement [les sources](https://github.com/youknowriad/report.js) (la librairie est écrite en
[ECMAScript6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) : hipsters inside :)).
Pour l'instant, la principale chose à retenir est que **Report.js est spécialisé dans la présentation des données** et uniquement
dans cette tâche et il l'acompli bien !

Pour vous montrer le potentiel de cette librairie, nous allons étudier un cas très simple : je souhaite analyser l'activité
sur le dépôt de code source de ce petit blog. Je veux générer des tableaux et graphique qui me permettront de voir rapidement
ce qu'il se passe.

Vous allez certainement vous dire qu'utiliser une librairie pour rendre un bête tableau est peut-être de trop mais pas du tout.
Lorsqu'on souhaite faire des tableaux multi-dimensionnels, on peu vite se retrouver à écrire beaucoup de code. Mais là, pas besoin,
on va se contenter de créer la structure de données attendue par la librairie et configurer le rendu.

Imaginons la chose suivante : je souhaite présenter, dans un tableau, le nombre de commits par année, mois et branche.
Ici, j'ai trois **dimensions**. Je vais donc les déclarer :

<pre class="line-numbers"><code class="language-javascript">var data = {
    dimensions: [
        { id: 'Branch'},
        { id: 'Year' },
        { id: 'Month' }
    ]
};</code></pre>

Ces dimensions vont ensuite avoir des valeurs : les années, les mois et les branches. On continue donc en déclarant ces valeurs :

<pre class="line-numbers"><code class="language-javascript">var data = {
    dimensions: [
        { id: 'Branch'},
        { id: 'Year' },
        { id: 'Month' }
    ],
    dimensionValues: [
        [
            { id: 'sources' },
            { id: 'master' }
        ],
        [
            { id: '2013' },
            { id: '2014' }
        ],
        [
            { id: 'January' },
            { id: 'February' },
            { id: 'March' },
            { id: 'April' },
            //...
        ]
    ],
};</code></pre>

Voilà, la configuration est terminée, il ne reste plus qu'à définir les valeurs des **cellules**. J'insiste sur le mot "cellule". En effet,
Report.js traîte toute cette structure comme une **grille**. Pour définir les valeurs des cellules nous allons donc utiliser un système
de coordonnées qui va nous permettre de lier une valeur aux dimensions :

<pre class="line-numbers"><code class="language-javascript">var data = {
    dimensions: [
        { id: 'Branch'},
        { id: 'Year' },
        { id: 'Month' }
    ],
    dimensionValues: [
        [
            { id: 'sources' },
            { id: 'master' }
        ],
        [
            { id: '2013' },
            { id: '2014' }
        ],
        [
            { id: 'January' },
            { id: 'February' },
            { id: 'March' },
            { id: 'April' },
            //...
        ],
        cells: [
            //sources - 2013 - January
            { value: 12, dimensionValues: [0, 0, 0] },
            //sources - 2013 - February
            { value: 1, dimensionValues: [0, 0, 1] },
            //sources - 2014 - February
            {value: 4, dimensionValues: [0, 1, 1]},
            //master - 2013 - January
            {value: 8, dimensionValues: [1, 0, 0]},
            //...

    ],
};</code></pre>

Nos données sont prêtes. Maintenant, nous devons choisir sous quelle forme ces données seront présentées. Nous allons
commencer par faire un tableau :

<pre class="line-numbers"><code class="language-javascript">var layout = {
    type: 'table',
    rows: ['Branch'],
    columns: ['Year', 'Month']
};</code></pre>

Ici, nous avons décider de placer en ligne les branches et en colonnes les années et les mois. Lançons le rendu :

<pre class="line-numbers"><code class="language-javascript">$(function() {
    var renderer = new reportjs.Renderer();

    renderer.renderTo(
        $('table-container'),
        {
            data: data,
            layout: layout
        }
    );
});</code></pre>

Et admirrons le résultat :

<div id="table"></div>

Certains diront peut-être qu'au final, tout ce qu'on a fait c'est afficher un tableau à partir d'une structure de données un peu
complexe à écrire, ce qui est totalement faux !

Le rendu précédent ne me satisfait pas, j'ai envie de présenter ça d'une autre manière. Pas de problème :

<div id="otherTable"></div>

En fait, ce rendu ne me va pas non-plus. J'en essaye un autre :

<div id="thirdTable"></div>

**Les mêmes données, déclarées strictement de la même manière mais un rendu différent** en changeant simplement un peu de configuration.
Vous n'êtes toujours pas convaincu ? Alors regardez ça :

<div id="bar"></div>

Toujours les mêmes données, déclarées strictement de la même manière mais avec un rendu totalement différent : **on passe du tableau
au graphique** :

<pre class="line-numbers"><code class="language-javascript">var layout = {
    type: 'graph',
    labels: ['Year', 'Month'],
    datasets: ['Branch'],
    graphType: 'bar'
};</code></pre>

On va arrêter ici avec les démos. Si vous souhaitez en voir plus, rendez-vous directement sur [la page dédiée](http://youknowriad.github.io/report.js/index.html) de Report.js.

Nous allons maintenant revenir sur un détail qui a son importance : comme je le disais plus haut, la librairie est **spécialisée dans le rendu**
et impose donc certaines limites. Prenons un exemple (encore) pour illustrer l'une d'entre-elle.

Je vous ai montré dans les exemples précédents comment présenter les données sous forme de tableaux à trois dimensions. Mais que se passe-t-il
si je souhaite en utiliser uniquement deux, pour afficher les commits par an ?

<pre class="line-numbers"><code class="language-javascript">var layout = {
    type: 'table',
    rows: ['Branch'],
    columns: ['Year']
};</code></pre>

Ce n'est pas possible. Pour pouvoir faire le rendu de ce tableau, il faut agréger des données entre-elles (les mois). Mais Report.js
ne sais pas comment le faire, il peut y avoir des règles à appliquer en fonction de la nature de ces valeurs : est-ce que ce sont
des valeurs sommables ? quels liens y'a-t-il entre les dimensions ? ...

Si vous souhaitez afficher ce tableau, vous devrez définir une nouvelle grille qui contiendra les valeurs agrégées. De même, certains
types de rendus nécessiteront la création d'une nouvelle grille. Par exemple, si je souhaite représenter la proportions des commits
sur chaque branche dans un graphique en camenbert, je devrais définir une nouvelle grille :

<pre class="line-numbers"><code class="language-javascript">var layout = {
        dimensions: [
            { id: 'Branch'}
        ],
        dimensionValues: [
            [
                { id: 'sources' },
                { id: 'master' }
            ]
        ],
        cells: [
            {value: 68, dimensionValues: [0]},
            {value: 42, dimensionValues: [1]}
        ]
    },
    layout = {
        type: 'segmentGraph',
        graphType: 'pie'
    };</code></pre>

Et voilà, nous avons notre graphique :

<div id="pie"></div>

Dernière petite chose, **[une directive AngularJS](https://github.com/youknowriad/angular-reportjs) est déjà disponible** !

La librairie est encore très jeune mais elle est très prométeuse. N'hésitez pas à l'utiliser et à [proposer vos idées](https://github.com/youknowriad/report.js/pulls)
ou à [faire part de vos retours](https://github.com/youknowriad/report.js/issues) à l'auteur.

<script src="assets/report-js/chart.js"></script>
<script src="assets/report-js/report.js"></script>
<script src="assets/report-js/table.js"></script>
<script src="assets/report-js/pie.js"></script>
<script>
    $(document).ready(function() {
        var renderer = new reportjs.Renderer(),
            table = {
                type: 'table',
                rows: ['Branch'],
                columns: ['Year', 'Month']
            },
            otherTable = {
                type: 'table',
                rows: ['Branch', 'Month'],
                columns: ['Year']
            },
            thirdTable = {
                type: 'table',
                rows: ['Month', 'Branch'],
                columns: ['Year']
            },
            bar = {
                type: 'graph',
                labels: ['Year', 'Month'],
                datasets: ['Branch'],
                graphType: 'bar'
            },
            pie = {
                type: 'segmentGraph',
                graphType: 'pie'
            },
            renderDataTo = function(data, element, layout) {
                renderer.renderTo(element, {
                    data: data,
                    layout: layout
                });
            };

            renderDataTo(reportjs.demo.table, $('#table'), table);
            $('table', $('#table')).addClass('table');
            $('table', $('#table')).addClass('table-bordered');

            renderDataTo(reportjs.demo.table, $('#otherTable'), otherTable);
            $('table', $('#otherTable')).addClass('table');
            $('table', $('#otherTable')).addClass('table-bordered');

            renderDataTo(reportjs.demo.table, $('#thirdTable'), thirdTable);
            $('table', $('#thirdTable')).addClass('table');
            $('table', $('#thirdTable')).addClass('table-bordered');

            renderDataTo(reportjs.demo.table, $('#bar'), bar);
            renderDataTo(reportjs.demo.pie, $('#pie'), pie);
    });
</script>
