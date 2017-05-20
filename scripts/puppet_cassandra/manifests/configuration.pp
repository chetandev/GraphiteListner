class puppet_cassandra::configuration (
  $cluster_ips  = $::ipaddress,
  $cluster_name = 'JioCloud',
  $max_heap     = '8G',
  #  $server_ip    = generate("/bin/bash", "-c", " ifconfig | /bin/grep -m1 inet  | /bin/awk '{print \$2}' | /bin/cut -d \" \"
  #  -f10"),
  $server_ip    = $::ipaddress,
  $snitch_type  = 'Ec2Snitch') {
  file { '/usrdata/apps/cassandra/conf/cassandra.yaml':
    ensure  => file,
    content => template('puppet_cassandra/cassandra.yaml.erb')
  } ->
  file { '/usrdata/apps/cassandra/conf/cassandra-env.sh':
    ensure  => file,
    content => template('puppet_cassandra/cassandra-env.sh.erb')
  } ->
  file { '/etc/init.d/cassandra':
    ensure  => file,
    mode    => '0755',
    content => template('puppet_cassandra/cassandra.erb')
  } ->
  exec { 'chkconfig cassandra on': provider => shell, }

  exec { 'service cassandra start':
    cwd      => '/usrdata/apps/cassandra/bin',
    provider => shell,
  }

}
