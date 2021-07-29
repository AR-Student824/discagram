const Discord = require('discord.js')
const discord = new Discord.Client()
const Instagram = require('@androz2091/insta.js')
const instagram = new Instagram.Client()

const cmds = [{
    "name": "user",
    "description": "Get a user's Instagram profile.",
    "options": [{
        "type": 3,
        "name": "username",
        "description": "username of the user",
        "default": false,
        "required": true
    }],
    

}
]

discord.on('ready', () =>{
    cmds.forEach(data => {
        discord.api.applications(discord.user.id).guilds('717176804716183602').commands.post({
            data: data
        })
        console.log(`Deploying /${data.name}`)
    })
    console.log('[Discord] Ready')
})

instagram.on('connected', () =>{
    console.log('[Instagram] Connected')
})

discord.ws.on('INTERACTION_CREATE', async interaction => {
    function recieved() {
        discord.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 5
            }
        })
    }

    function respond(data) {
        discord.api.webhooks(discord.user.id, interaction.token).messages('@original').patch({
            data: data
        })
    }
    var msg = interaction.data.name
    if (msg == 'user') {
        recieved()
        var u = ''
        interaction.data.options.forEach(o => {
            if (o.name == 'username') {
                u = o.value
            }
        })
        try {
            instagram.fetchUser(u).then(user => {
            respond({embeds:[{
            title: '@' + user.username + `${user.isVerified.toString().replace('true', ' [VERIFIED]').replace('false','')}`,
            description: `${user.isPrivate.toString().replace('true', '**This profile is private.**\n\n').replace('false','')} `+user.biography,
            fields: [{name: 'Followers', value: user.followerCount, inline:true},
            {name: 'Following', value: user.following.array.length.toString(), inline:true},
            {name: 'Posts', value: user.mediaCount, inline:true},
            {name: 'IGTV Posts', value: user.totalIgtvVideos, inline:true},
            {name: 'ID', value: user.id, inline:true}
        ]
            }]
        })
    })
    
        } catch (e) {
            message.channel.send('Failed to fetch that user off instagram. Perhaps a typo?')
            console.log(e)
        }
    }
})

discord.login('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
instagram.login('xxxxxxxx', 'xxxxxxxxxxxxxxxxx')
