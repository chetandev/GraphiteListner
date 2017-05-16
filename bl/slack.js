// Require module: 

var MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
var slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);


function sendAlert(obj, func, description) {

    slack.alert({

        channel: '#general',
        icon_emoji: ':thumbsdown:',
        text: 'Current server stats',
        attachments: [{
            color: '#FF0000', 
            fallback: 'Required Fallback String',
            fields: [
                { title: 'Metrix', value: obj.title, short: true },
                { title: 'Function', value: func, short: true },
                { title: 'description', value: description, short: true }
            ]
        }]
    });

}




function sendOk(obj, func, description) {

    slack.alert({

        channel: '#general',
        icon_emoji: ':thumbsup:',
        text: 'Current server stats',
        attachments: [{
            color: '#00FF00', //green
            fallback: 'Required Fallback String',
            fields: [
                { title: 'Metrix', value: obj.title, short: true },
                { title: 'Function', value: func, short: true },
                { title: 'description', value: description, short: true }
            ]
        }]
    });

}

slack.onError = function(err) {
    console.log('API error:', err);
};
module.exports = {
    sendAlert,
    sendOk
}
