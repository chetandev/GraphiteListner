var SSH = require('simple-ssh');
var Promise = require('bluebird')
var fs = require('fs');
var path = require('path');



function executeShell(obj, ip, command) {

    return new Promise(function(resolve, reject) {

        var ssh = new SSH({
            host: ip,
            user: 'ubuntu',
            key: fs.readFileSync(__config.ssh_key),
        });

        ssh
            .exec('cd ' + __config.shell_script_path, {
                
                out: console.log.bind(console)
            })
            .exec('sudo ' + command, {
                out: function(stdout) {
                    console.log('script ran success on  ' + ip);
                    resolve(stdout)
                },
                err: function(stderr) {
                    reject(stderr) // this-does-not-exist: command not found 
                }
            }).start();

    })
}


module.exports = { executeShell }
