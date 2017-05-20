var SSH = require('simple-ssh');
var Promise = require('bluebird')
var fs = require('fs');
var path = require('path');



function executeShell(obj, ip, command) {

    return new Promise(function(resolve, reject) {

        var ssh = new SSH({
            host: ip,
            user: 'ubuntu',
            key: fs.readFileSync(__config.ssh_key)
        });

        ssh
            .exec('cd ~', {

                out: function(stdout) {
                    console.log(stdout)
                }
            })
            .exec('pwd', {

                out: function(stdout) {
                    console.log(stdout)
                }
            })
            .exec('sudo ' + command, {
                out: function(stdout) {
                    console.log('script ran success on  ' + ip);
                    console.log('out' + stdout)
                    resolve(stdout)
                },
                err: function(stderr) {
                    console.log(stderr)
                    reject(stderr) // this-does-not-exist: command not found 
                }
            }).start();

    })
}


module.exports = { executeShell }
