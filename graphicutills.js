const blessed = require('blessed');

const discord = require ('./index')

let activeGuildID = -1;
let activeGuildName = 'Undefined';
let activeGuild = undefined;
let activeChannelID = -1;
let activeChannelName = 'Undefined';
let activeChannel=undefined;

let screen = blessed.screen({
    smartCSR: true
});
screen.title = 'HentCord';

//todo сменить тип на список
//Левый бордер со списком каналов
let channelsList = blessed.list({
    top: 0,
    left: 0,
    width: '25%',
    height: '93%',
    content: '',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});
//Ник пользователя
let userInfo = blessed.box({
    top: "93%",
    left: 0,
    width: '25%',
    height: '10%',
    content: 'Login in process...',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
})
//строка с инфой о канале и сервере/приватном канале
let channelInfo = blessed.box({
    top: "0%",
    left: "center",
    width: '50%',
    height: '10%',
    content: '...Loading...',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
})
//коробка с сообщениями
let text = blessed.box({
    top: "10%",
    left: '25%',
    width: '50%',
    height: '83%',
    content: '',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});

//todo менить тип на список
//список серверов
let serversList = blessed.list({
    top: 0,
    left: "75%",
    width: '25%',
    height: '50%',
    content: '',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});
//коробка со списком пингов
let lastPings = blessed.box({
    top: "50%",
    left: "75%",
    width: '25%',
    height: '50%',
    content: '',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
});
//ввод сообщений
let inputer = blessed.textarea({
    top: "93%",
    left: "25%",
    width: '50%',
    height: '10%',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        },
        hover: {
            bg: 'green'
        }
    }
})

// Append our box to the screen.
screen.append(channelsList);
screen.append(text);
screen.append(serversList);
screen.append(lastPings);
screen.append(inputer)
screen.append(userInfo)
screen.append(channelInfo)

// If channelsBorder is focused, handle `enter`/`return` and give us some more content.
screen.key('tab', function(ch, key) {
    startInput();
});

inputer.key('enter', function(ch, key) {
    channelsList.setContent(inputer.value)
    inputer.setValue("")
    screen.render()
    //todo интеграция с дискордом
})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

screen.key(['C-q'], function(ch, key) {
    serversList.focus()
});

serversList.key(['up'], function(ch, key) {
    let a = serversList.getItem(serversList.selected).content
    a=a.replace('>',' ')
    serversList.setItem(serversList.selected,a)
    serversList.up(1)
    a = serversList.getItem(serversList.selected).content
    a=a.replace(' ','>')
    serversList.setItem(serversList.selected,a)
    screen.render()
});
serversList.key(['down'], function(key) {
    let a = serversList.getItem(serversList.selected).content
    a=a.replace('>',' ')
    serversList.setItem(serversList.selected,a)
    serversList.down(1)
    a = serversList.getItem(serversList.selected).content
    a=a.replace(' ','>')
    serversList.setItem(serversList.selected,a)
    screen.render()
});
channelsList.key(['up'], function(ch, key) {
    let a = channelsList.getItem(channelsList.selected).content
    a=a.replace('>',' ')
    channelsList.setItem(channelsList.selected,a)
    channelsList.up(1)
    a = channelsList.getItem(channelsList.selected).content
    a=a.replace(' ','>')
    channelsList.setItem(channelsList.selected,a)
    screen.render()
});
channelsList.key(['down'], function(ch, key) {
    let a = channelsList.getItem(channelsList.selected).content
    a=a.replace('>',' ')
    channelsList.setItem(channelsList.selected,a)
    channelsList.down(1)
    a = channelsList.getItem(channelsList.selected).content
    a=a.replace(' ','>')
    channelsList.setItem(channelsList.selected,a)
    screen.render()
});

function showError() {

}

serversList.key(['enter'], function(ch, key) {
    if(serversList.getItem(serversList.selected)===undefined){
        if(serversList.selected<0){
            serversList.select(0)
        }else{
            serversList.select(serversList.items.length-1)
        }
        return;
    }

    if(serversList.getItem(serversList.selected).content===(">ПРИВАТОЧКА")){
        activeGuildID=-2;
        //todo приватка че
    }else{
        let a =serversList.getItem(serversList.selected).content
        discord.c.guilds.keyArray().forEach(k=> {
                let guild = discord.c.guilds.get(k)
                if((">"+guild.name)===(a)){
                    activeGuildID = guild.id
                    activeGuildName=guild.name
                    activeGuild=guild
                    channelInfo.setContent(activeGuildName)
                    setupChannels(guild)
                }
            }
        )
        showError()
    }
});
channelsList.key(['enter'], function(ch, key) {
    if(channelsList.getItem(serversList.selected)===undefined){
        if(channelsList.selected<0){
            channelsList.select(0)
        }else{
            channelsList.select(channelsList.items.length-1)
        }
        return;
    }

    if(activeGuildID===-2){

    }else {
        let a = channelsList.getItem(channelsList.selected).content

        activeGuild.channels.keyArray().forEach(k=>{
            let c = activeGuild.channels.get(k)
            if ((">" + c.name) === (a)&&c.type.toString()==='text') {
                activeChannel=c;
                activeChannelName=c.name;
                activeChannelID=c.id;
                channelInfo.setContent(activeGuildName+"|"+activeChannelName)
                setLog(c.toString())
                startInput()
            }
        })
    }
});

// Focus our element.
serversList.focus();

// Render the screen.
screen.render();

let parseMessageToYUI = function(data){
    let rtn = data.author.username+"    "+data.createdAt.toDateString()+"\n" +data.content+"\n"
    text.setContent(text.content+rtn)
    let lines = text.getScreenLines().length;
    while(lines>text.height-2){
        text.deleteTop();
        lines = text.getScreenLines().length;
    }
    screen.render();
    return rtn;
}

let setLog = function(text){
    lastPings.setContent(text)
    screen.render()
}

let setLoginned = function (username,bot){
    if(bot){
        userInfo.setContent("[BOT]"+username)
    }else{
        userInfo.setContent(username)
    }
    channelInfo.setContent("                 ")
    serversList.addItem(' ПРИВАТОЧКА')
    discord.c.guilds.keyArray().forEach(k=>
        serversList.addItem(' '+discord.c.guilds.get(k).name)
    )
    let a = serversList.getItem(serversList.selected).content
    a=a.replace(' ','>')
    serversList.setItem(serversList.selected,a)
    screen.render()
}

function setupChannels(server){
    channelsList.clearItems()
    server.channels.forEach(c=>{
            channelsList.addItem(" " + c.name)
    })
    let a = channelsList.getItem(channelsList.selected).content
    a=a.replace(' ','>')
    channelsList.setItem(channelsList.selected,a)
    channelsList.focus()
    screen.render()
}

function startInput(){
    inputer.focus()
    inputer.setValue("");
    inputer.readInput(function (){
    })
    screen.render();
}

module.exports.messageArrived = parseMessageToYUI;
module.exports.log = setLog;
module.exports.login = setLoginned;