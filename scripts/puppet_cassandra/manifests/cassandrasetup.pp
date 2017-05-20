class puppet_cassandra::cassandrasetup {
  group { 'servicesusrgroup':
    ensure   => present,
    provider => groupadd,
  } ->
  user { 'cassandra':
    ensure     => present,
    managehome => true,
    gid        => 'servicesusrgroup',
  } ->
  file { ['/usrdata', '/usrdata/apps/', '/usrdata/archive']:
    ensure => directory,
    owner  => 'cassandra',
    group  => 'servicesusrgroup',
  } ->
  archive { "/usrdata/archive/${puppet_cassandra::params::cassandra_version}.tar.gz":
    ensure       => present,
    extract      => true,
    source       => "${puppet_cassandra::params::cassandra_link}/${puppet_cassandra::params::cassandra_version}.tar.gz",
    cleanup      => false,
    extract_path => '/usrdata/apps/',
    user         => 'cassandra',
    group        => 'servicesusrgroup',
    creates      => '/usrdata/apps/dsc-cassandra-3.0.9/',
    notify       => File['/usrdata/apps/cassandra/'],
  } ->
  package { 'java-1.8.0-openjdk':
    ensure   => present,
    provider => yum,
  }

  file { '/usrdata/apps/cassandra/':
    ensure  => directory,
    source  => '/usrdata/apps/dsc-cassandra-3.0.9/',
    recurse => true,
    owner   => 'cassandra',
    group   => 'servicesusrgroup',
  }

}
