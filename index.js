const { Client } = require('discord.js-selfbot-v11')
const client = new Client();
const tui = require("./graphicutills")

let loaded = false;

module.exports.c = client;
module.exports.started = loaded;

client.on('ready', () => {
    tui.log("Runned Discrod Part")
    loaded=true;
    tui.login(client.user.tag,client.user.bot)
})

client.on('message',(data)=>{
    if(data.guild===null||data.guild.id!=="548440972997033996") {
        tui.messageArrived(data)
    }
})

client.login("token be there")