***
{
    "title": "How to test your Symfony2 project with Behat on TravisCI",
    "summary": "As you may know <a title=\"Travis CI\" href=\"http://travis-ci.org\">Travis CI</a> is a continuous integration plateform for open source projects hosted on <a title=\"Github\" href=\"http://github.com\">Github</a>. In this post I'll try to show you a configuration which will help you run Behat tests on your Symfony 2 application.",
    "type": "post",
    "date": "2012-07-03 13:58:00",
    "layout": "post.twig",
    "tags": ["CI", "travis", "symfony", "behat", "BDD"]
}
***
This week end, I finally decided to work on the [Behat Viewer](http://behat-viewer.org) continuous integration : this project is entirely tested with [Behat](http://behat.org) and until now, the tests were launched manually each time I wanted to push changes to the public repository. Running the project like this did not fully satisfied me : there was no build history and the results were not publicly available. So I decided to take advantage of the great tools we have : I kept  [Behat](http://behat.org) as my functional testing framework and choose [Travis CI](http://travis-ci.org) as the continuous integration plateform. In this post I will detail the configuration I use to run these tests on the Travis CI virtual machines.

As you may know [Travis CI](http://travis-ci.org) is a continuous integration plateform for open source projects hosted on (GitHub)[http://github.com]. To test our projects on it, we only need to [enable Travis CI on our repositories](http://about.travis-ci.org/docs/user/getting-started/) and add [a little configuration file (.travis.yml)](http://about.travis-ci.org/docs/user/build-configuration/) in our project : we are going to see how to build this file because this is this single file that will describe our build process.

Here is the context :
* Behat Viewer is an Symfony 2.0 application
* It uses a MySQL database
* Some PHP5 modules are required (php5-mysql, php5-sqlite)
* The Apache mod_rewrite has to be enabled

Now that we know all the required elements, let's build our configuration file :

<pre class="line-numbers"><code class="language-css"># The test environment we want to use (PHP 5.3)
language: php
php:
    - 5.3

before_script:
    # Packages installation
    - sudo apt-get install -y --force-yes apache2 libapache2-mod-php5 php5-mysql php5-sqlite
    # Apache webserver configuration
    - echo "Alias /behat $(pwd)/web" | sudo tee -a /etc/apache2/sites-available/default
    - sudo a2enmod rewrite
    - sudo /etc/init.d/apache2 restart
    # Database creation
    - mysql -e 'CREATE DATABASE test_myapp_test;'
    # Symfony 2 application configuration
    - sed s/%database_name%/myapp_test/ app/config/parameters.ini-dist | sed s/%database_login%/root/ | sed s/%database_password%// > app/config/parameters.ini
    - bin/vendors install
    - app/console --env=test doctrine:schema:create
    - sudo chmod -R 777 app/cache app/logs
    - sed 's/%hostname%/localhost\/behat/' behat.yml-dist > behat.yml</code></pre>

script:
    # Launch test suite
    - php behat.phar --profile=travis @BehatViewerBundle

This script will look really simple to anyone who is familiar with the UNIX command line but it took me several hours and builds to get the expected result.

## Environment configuration (before_script)

Travis CI lets us use some standard virtual machines and with our configuration file, we are able to customize these VMs. As you read the file I showed you, you've probably said I was a little crazy : I'm using ```sudo``` and installing packet via ```apt-get``` : [this is completly supported by Travis CI](http://about.travis-ci.org/docs/user/build-configuration/) : the virtual machines are snapshoted and restored before each build is launched.

So, after the 5 first steps, we have a working LAMP (Apache, PHP, Mysql). Let's configure our Symfony 2 application :

* The first command edits the ```app/config/parameters.ini``` file which contains the database connection credentials
* The second step installs the project dependencies
* The third creates the database schema
* The fourth fixes the permissions on some directories
* And the last one edits the Behat's configuration file

## Launching the tests (script)

In this section we will describe the commands that Travis has to run in order to launch our test suite. Be carefull with these commands : in this sections you should only list commands that are mandatory to run the tests. If a command in this section fails, the script will be stopped and the build marked as failed.

This configuration file is not yet complete: currently, it will let you run your tests through Behat Goutte driver only (without javascript). Travis CI provides phantomjs on its VMs and am currently working on setting up this tool.

This is my first post entirely written in English so please excuse me for any mistake I made :)