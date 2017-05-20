# Class: messages_puppet_cassandra
#
# This module manages messages_puppet_cassandra
#
# Parameters: none
#
# Actions:
#
# Requires: see Modulefile
#
# Sample Usage:
#
class puppet_cassandra {
  
  include archive
  include stdlib
#  exec {'yum update -y':}->
  
  class {'puppet_cassandra::params':}->
  class {'puppet_cassandra::cassandrasetup':} ->
  class {'puppet_cassandra::configuration':}
}
