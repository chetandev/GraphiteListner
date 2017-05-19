########### Collectd #########

#!/bin/sh

collectd_process_start() {
if [[ ! $(ps -ef | grep collectd | grep -v grep) ]] 
  then
   service collectd start
   sleep 120
    if [[ ! $(ps -ef | grep collectd | grep -v grep) ]] 
     then
      apt-get install unzip -y
      apt-get install wget -y
      apt-get install git -y
      apt-get install puppet -y
      mkdir -p /etc/puppet/modules
      git clone https://github.com/atmesh/collectd.git /etc/puppet/modules/puppet_collectd/
      puppet module install puppet-archive --version 1.3.0
      mkdir -p /etc/puppet/manifests
cat <<FIL > /etc/puppet/manifests/site.pp
node default {
Exec { path => ['/bin/','/sbin/','/usr/bin/','/usr/sbin/']}
include 'puppet_collectd'
}
FIL
      puppet apply /etc/puppet/manifests/site.pp
      sleep 180
       if [[ ! $(ps -ef | grep collectd | grep -v grep) ]] 
       then
        echo "0, service collectd start, puppet apply /etc/puppet/manifests/site.pp"
    else
        echo "1, service collectd start, puppet apply /etc/puppet/manifests/site.pp" 
    fi
else 
    echo "1,  service collectd start"
fi
else
    echo "1, service already running"
fi
}

########## END COLLECTD #########


############## CONSUL #########

consul_service_start() {
mkdir -p /etc/consul.d/
mkdir -p /etc/consul/

$CONSUL_IP="172.26.1.180"


NODENAME=$(hostname)
IP=$(facter ipaddress)
if [[ ! $(ps -ef | grep consul | grep -v grep) ]] 
	then
	wget -nc https://releases.hashicorp.com/consul/0.8.3/consul_0.8.3_linux_amd64.zip?_ga=2.223988315.1387870827.1495107389-631441671.1491543068 -O /tmp/consul.zip
	unzip -n /tmp/consul.zip -d /usr/bin/
	chmod +x /usr/bin/consul
	nohup consul agent -data-dir=/etc/consul -node=$NODENAME -bind=$IP -config-dir=/etc/consul.d > /etc/consul/consul.log &
consul join $CONSUL_IP
if [[ ! $(ps -ef | grep consul | grep -v grep) ]]
    then
    echo "0, 'nohup consul agent -data-dir=/etc/consul -node=$NODENAME -bind=$IP -config-dir=/etc/consul.d > /etc/consul/consul.log &'"
fi
else
    echo "1, 'nohup consul agent -data-dir=/etc/consul -node=$NODENAME -bind=$IP -config-dir=/etc/consul.d > /etc/consul/consul.log &'"
fi


if [[ ! $(consul kv get TECHGIG/CASS/TEST/$NODENAME) ]]
	then
	consul kv put TECHGIG/CASS/TEST/$NODENAME $IP
    if [[ ! $(consul kv get TECHGIG/CASS/TEST/$NODENAME) ]]
        then
        echo "0, 'consul kv put TECHGIG/CASS/TEST/$NODENAME $IP'"
    else
        echo "1, 'consul kv put TECHGIG/CASS/TEST/$NODENAME $IP'"
    fi
else
    echo "1, KV already present"
fi
}
########## END CONSUL ##############


########## NODE SERVICE ############

node_service_start(){
pm2 restart graphite
sleep 30

if [[ ! $(pm2 show graphite | awk {'print $4'} | grep online) ]] 
	then 
	pm2 start /home/ubuntu/GraphiteListner/bin/www --name graphite
	sleep 30
	if [[ ! $(pm2 show graphite | awk {'print $4'} | grep online) ]]
		then
		apt-get install unzip -y
        apt-get install wget -y
        apt-get install git -y
        apt-get install puppet -y
        mkdir -p /etc/puppet/modules
        git clone https://github.com/atmesh/puppet_nodeserver.git /etc/puppet/modules/puppet_nodeserver/
        puppet module install puppet-archive --version 1.3.0
        mkdir -p /etc/puppet/manifests
cat <<FIL > /etc/puppet/manifests/site.pp
node default {
Exec { path => ['/bin/','/sbin/','/usr/bin/','/usr/sbin/']}
include 'puppet_nodeserver'
}
FIL
      puppet apply /etc/puppet/manifests/site.pp
      sleep 200
      pm2 start /home/ubuntu/GraphiteListner/bin/www --name graphite
      if [[ ! $(pm2 show graphite | awk {'print $4'} | grep online) ]]
      	then
      	echo "0, pm2 start /usrdata/apps/GraphiteListner/bin/www --name graphite, puppet apply /etc/puppet/manifests/site.pp"
        exit
      else 
      	echo "1, pm2 start /usrdata/apps/GraphiteListner/bin/www --name graphite, puppet apply /etc/puppet/manifests/site.pp"
        exit
fi
else
	echo "1, pm2 start /usrdata/apps/GraphiteListner/bin/www --name graphite"
    exit
fi
else
 echo "1, service running" 
fi 

}
############ END NODE ################### 


############ Cassandra #################

cassandra_service_start(){
service cassandra restart
sleep 30
if [[ ! $(ps -ef | grep cassandra | grep -v grep) ]] 
    then
    apt-get install unzip -y
      apt-get install wget -y
      apt-get install git -y
      apt-get install puppet -y
      mkdir -p /etc/puppet/modules
      git clone https://github.com/atmesh/puppet_cassandra.git /etc/puppet/modules/puppet_cassandra/
      puppet module install puppet-archive --version 1.3.0
      mkdir -p /etc/puppet/manifests
cat <<FIL > /etc/puppet/manifests/site.pp
node default {
Exec { path => ['/bin/','/sbin/','/usr/bin/','/usr/sbin/']}
include 'puppet_cassandra'
}
FIL
      puppet apply /etc/puppet/manifests/site.pp
      sleep 300
      if [[ ! $(ps -ef | grep cassandra | grep -v grep) ]] 
        then
        echo "0, service cassandra restart, puppet apply /etc/puppet/manifests/site.pp"
        exit
    fi
else echo "1, service cassandra restart, puppet apply /etc/puppet/manifests/site.pp"
exit
fi
echo "1, service cassandra restart"
}

################# Memory ######################

memory_cleanup(){
INITIAL=$(free -m | awk {'print $4'} | head -2 | tail -1)
CURR=$(date +%s)
touch /root/time
if [ ! $(head -n 1 /root/time) ]
then
  echo 0 > /root/time
fi

OLDTIME=$(head -n 1 /root/time)

TIMEDIFF=$(( ${CURR} - ${OLDTIME} ))
if [[ "TIMEDIFF" -gt "1800" ]]
    then
    echo 1 > /proc/sys/vm/drop_caches
    FINAL=$(free -m | awk {'print $4'} | head -2 | tail -1)
    if [[ "$FINAL" -gt "1000" ]]
        then
        echo "1, 'echo 1 > /proc/sys/vm/drop_caches'"
        exit
    else
        echo "0, 'echo 1 > /proc/sys/vm/drop_caches'"
        exit
    fi
else
    echo "0, error too frequent"
    exit
fi
}
################## end memory ################


################## disk #####################

disk_cleanup(){

INITIAL=$(df -h | grep /dev/xvda | awk {'print $5'} | cut -d "%" -f1)

find /var/log -mtime +10 -type f -delete
find /usrdata/logs -mtime +10 -type f -delete

FINAL=$(df -h | grep /dev/xvda | awk {'print $5'} | cut -d "%" -f1)

if [[ "$INITIAL" -gt "$FINAL" ]]
    then
    echo "1, /var/log cleared, /usrdata/logs cleared"
    exit
else
    echo "0, /var/log cleared, /usrdata/logs cleared"
    exit
fi
}

$@
