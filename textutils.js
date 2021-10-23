module.exports.post = function post(message) {
    let output;
    if(message.guild!==null) {
        output = format(message.guild.name, 15) + "|" + format(message.channel.name, 15) + "|" + format(message.author.username, 15) + "|" + format(message.content)
    }else{
        output = format("приватка", 15) + "|" + format("приватка", 15) + "|" + format(message.author.username, 15) + "|" + format(message.content)
    }
    console.log(output)
}

function format(text,offset){
    if(text.length>offset){
        text=text.substring(0,offset-3);
        text=text+"..."
    }else{
        while(text.length<offset){
            text=text+" "
        }
    }
    return text;
}
