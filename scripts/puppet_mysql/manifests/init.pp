# Class: puppet_mysql
#
# This module manages puppet_mysql
#
# Parameters: none
#
# Actions:
#
# Requires: see Modulefile
#
# Sample Usage:
#
class puppet_mysql {
  # include '::mysql::server'

  class { '::mysql::server':
    root_password           => 'pass',
    remove_default_accounts => true,
    override_options        =>  { 'mysqld' => { 'bind-address' => '0.0.0.0' } }
  } ->
  mysql::db { 'graphite':
    user     => foo,
    password => 'pass',
    grant    => [
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'DROP',
      'CREATE',
      'ALTER',
      'CREATE VIEW',
      'SHOW VIEW',
      'TRIGGER',
      'LOCK TABLES'],
  } ->
  exec { "/usr/bin/mysql --defaults-extra-file=/root/.my.cnf --database=mysql -e \"GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'pass' WITH GRANT OPTION;\""
  : provider => shell }
}
