# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant::Config.run do |config|
  config.vm.box = "php-ci"

  config.vm.forward_port 80, 8888
  config.vm.forward_port 8000, 8000
end
