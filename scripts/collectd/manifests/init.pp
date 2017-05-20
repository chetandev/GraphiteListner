# Class: puppet_collectd
#
# This module manages puppet_collectd
#
# Parameters: none
#
# Actions:
#
# Requires: see Modulefile
#
# Sample Usage:
#
class puppet_collectd ($graphite_ip = "172.26.1.102") {
  exec { "apt-get update": provider => shell, } ->
  exec { "apt-get install collectd": provider => shell } ->
  file { "/etc/collectd/collectd.conf":
    ensure  => present,
    content => template('puppet_collectd/collectd.conf.erb')
  } ->
  exec { "update-rc.d collectd defaults": provider => shell } ->
  exec { "service collectd restart": provider => shell }
}
