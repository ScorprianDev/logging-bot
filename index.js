const Discord = require('discord.js')
const client = new Discord.Client()
const JSONdb = require('simple-json-db')
const fs = require('fs')

client.on('ready', () => {
console.log('Logged in as ' + client.user.tag)
const statuses = [
`people join`,
`people leave`,
`channels get created`,
`channels get deleted`,
`Messages get deleted`,
`messages get edited`,
`people get banned`,
`people get muted`,
`people get kicked`
]
const index = Math.floor(Math.random() * (statuses.length))
client.user.setActivity(statuses[index], { type: 'WATCHING' });
})



client.on('guildCreate', guild => {
	fs.writeFile(`./Servers/${guild.id}.sqlite`, "", (err) => {})
  const logs = new JSONdb(`./Servers/${guild.id}.sqlite`)
logs.set('prefix',`l!`)
	
});

client.on('guildMemberAdd', member => {
	const logs = new JSONdb(`./Servers/${member.guild.id}.sqlite`)
	const welcomemessages = logs.get(`memberJoin`)
	if(welcomemessages === undefined) return;
	const welcome = new Discord.MessageEmbed()
	.setTitle("User has joined!")
	.setThumbnail(member.user.displayAvatarURL())
	.setDescription(`${member.user.username} has joined the server\n\nPlease make sure to read the rules before participating.`)
	.setFooter(`Member count is now ${member.guild.memberCount}`)
	
	client.guilds.cache.get(member.guild.id).channels.cache.get(welcomemessages).send(welcome)
})

client.on('guildMemberRemove', member => {
	const logs = new JSONdb(`./Servers/${member.guild.id}.sqlite`)
	const leavemessages = logs.get(`memberLeave`)
	if(leavemessages === undefined) return;
	const goodbye = new Discord.MessageEmbed()
	.setTitle("User has left")
	.setThumbnail(member.user.displayAvatarURL())
	.setDescription(`${member.user.username} has left the server\n\nHopefully they return...`)
	.setFooter(`Member count is now ${member.guild.memberCount}`)
	
	client.guilds.cache.get(member.guild.id).channels.cache.get(leavemessages).send(goodbye)
})


client.on("channelDelete", channel => {



	const logs = new JSONdb(`./Servers/${channel.guild.id}.sqlite`)
	const channelDeletion = logs.get(`channelDelete`)
	if(channelDeletion === undefined) return;
	const channelembed = new Discord.MessageEmbed()
	.setTitle('Channel Deleted')
	.addField('Name', channel.name, true)
	.addField('Type', channel.type, true)
	.setFooter(`ID: ${channel.id}`)
	.setTimestamp()
	client.guilds.cache.get(channel.guild.id).channels.cache.get(channelDeletion).send(channelembed)
})

client.on("channelCreate", channel => {



	const logs = new JSONdb(`./Servers/${channel.guild.id}.sqlite`)
	const channelDeletion = logs.get(`channelCreate`)
	if(channelDeletion === undefined) return;
	const channelembed = new Discord.MessageEmbed()
	.setTitle('Channel Created')
	.addField('Name', channel.name, true)
	.addField('Type', channel.type, true)
	.setFooter(`ID: ${channel.id}`)
	.setTimestamp()
	client.guilds.cache.get(channel.guild.id).channels.cache.get(channelDeletion).send(channelembed)
})

client.on("messageDelete", message => {
	const logs = new JSONdb(`./Servers/${message.guild.id}.sqlite`)
	const messagedeletion = logs.get(`messageDelete`)
	if(messagedeletion === undefined) return;
	const messagedelete = new Discord.MessageEmbed()
	.setTitle('Message Deleted')
	.addField('Author', message.author.tag, true)
	.addField('Channel', `<#${message.channel.id}>`)
	.addField('Message', message.content)
	
	client.guilds.cache.get(message.guild.id).channels.cache.get(messagedeletion).send(messagedelete)
})

client.on("roleDelete", role => {



	const logs = new JSONdb(`./Servers/${role.guild.id}.sqlite`)
	const channelDeletion = logs.get(`channelDelete`)
	if(channelDeletion === undefined) return;
	const channelembed = new Discord.MessageEmbed()
	.setTitle('Role Deleted')
	.addField('Name', role.name, true)
	.addField('Colour', role.color, true)
	.addField('Mentionable', role.mentionable, true)
	.setFooter(`ID: ${role.id}`)
	.setTimestamp()
	client.guilds.cache.get(role.guild.id).channels.cache.get(channelDeletion).send(channelembed)
})

client.on("roleCreate", role => {



	const logs = new JSONdb(`./Servers/${role.guild.id}.sqlite`)
	const channelDeletion = logs.get(`roleCreate`)
	if(channelDeletion === undefined) return;
	const channelembed = new Discord.MessageEmbed()
	.setTitle('Role Created')	
	.addField('Name', role.name, true)
	.addField('Colour', role.color, true)
	.addField('Mentionable', role.mentionable, true)
	.setFooter(`ID: ${role.id}`)
	.setTimestamp()
	client.guilds.cache.get(role.guild.id).channels.cache.get(channelDeletion).send(channelembed)
})



client.on('guildDelete', guild => {
    fs.unlinkSync(`./Servers/${guild.id}.sqlite`)
})



client.on('message', async message => {
	if(message.author.bot) return;
	const logs = new JSONdb(`./Servers/${message.guild.id}.sqlite`)

const prefix = logs.get('prefix')
	  
	  
	  const args = message.content.split(" ").slice(1);
	if(message.content.toLowerCase().startsWith(`${prefix}prefix`)){
	  
	 const currentprefix = new Discord.MessageEmbed()
  .setTitle('Logs')
  .setDescription(`This servers prefix is **l!**`)
.setFooter(`Use l!prefix <prefix> to change the prefix`)
.setColor('#ffffff')
if(!args[0]) return message.channel.send(currentprefix);
if(args[0]) {
	logs.set(`prefix`, args[0])
 
 const newprefix = new Discord.MessageEmbed()
 .setDescription('✅|This servers prefix has been changed to ' + args[0])
 .setColor('GREEN')
  message.channel.send(newprefix)
}
}

// channelDelete, channelCreate, messageEdit, messageDelete, roleCreate, roleDelete, memberBan, memberUnban, roleAdd, roleRemove, memberKick, memberJoin, memberLeave
	else if(message.content.toLowerCase() === prefix + "help"){
		const helpembed = new Discord.MessageEmbed()
		.setTitle('Log Commands')
		.setDescription(`Prefix is l!`) 
		.addField('Logs <i!logs <channel> <log type>', `channelDelete, channelCreate, messageDelete, roleCreate, roleDelete, memberJoin, memberLeave`)
		.addField('Configuration', `\`\`Prefix\`\`, \`\`Config\`\``)
		.setFooter('Logs')
		.setColor('#665138')
		message.channel.send(helpembed)
	}
		else if(message.content.startsWith(prefix + "logs")){
			if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You need the \`\`MANAGE_GUILD\`\` permission to use this command')
		var channel = message.mentions.channels.first()
	var tagcontext = message.content.split(" ").slice(2).join(" ");
	if(!channel) return message.channel.send(`${prefix}logs <channel_mention> <log type>`)
		if(!tagcontext) return message.channel.send(`${prefix}logs <channel_mention> <log type>`)
	
if(tagcontext === "channelDelete" || tagcontext === "channelCreate" || tagcontext === "messageDelete" || tagcontext === "roleCreate" || tagcontext === "roleDelete" || tagcontext === "memberJoin" || tagcontext === "memberLeave") {
		logs.set(`${tagcontext}`, channel.id)
	message.channel.send(`${tagcontext} are now being sent to ${channel}`)
} else {
	message.channel.send(`${tagcontext} is not a valid log type; Note that this is caps sensitive`)
}
	
		}else if(message.content.toLowerCase().startsWith(prefix + "config")){
            const logtypes = [
                `channelDelete`,
                `channelCreate`,
                `messageDelete`, 
                `roleCreate`, 
                `roleDelete`, 
                `memberJoin`, 
                `memberLeave`
            ]
			

            const logchannels = []
            for(i=0; i < logtypes.length; i++){
                const channelid = logs.get(logtypes[i])
                if(!channelid) {
                    logchannels.push('Not set')
                } else {
                    logchannels.push(`<#${channelid}>`)
				}
            }
			const config = new Discord.MessageEmbed()
			.setTitle(`${message.guild.name} | Configuration`)
			.addField('Prefix', 'l!', true)
			.addField('channelDelete', logchannels[0], true) 
			.addField('channelCreate', logchannels[1], true) 
		//	.addField('messageEdit', logchannels[2], true) 
			.addField('messageDelete',logchannels[2] , true) 
			.addField('roleCreate', logchannels[3], true) 
			.addField('roleDelete', logchannels[4], true) 
		//	.addField('memberBan', logchannels[6], true) 
		//	.addField('memberUnban', logchannels[7], true) 
		//	.addField('roleAdd', logchannels[8], true) 
		//	.addField('roleRemove', logchannels[9], true) 
		//	.addField('memberKick', logchannels[10], true)
			.addField('memberJoin', logchannels[5], true) 
			.addField('memberLeave', logchannels[6], true) 
			.setFooter('Format: l!logs <channel> <log type>')
			.setColor('#ffffff')
message.channel.send(config)
		}else if (message.content.match(new RegExp(`^<@!?${client.user.id}>`))) {
			const currentprefix = new Discord.MessageEmbed()
  .setTitle('Logs')
  .setDescription(`This servers prefix is **l!**`)
.setFooter(`Use l!prefix <prefix> to change the prefix`)
.setColor('#ffffff')
			message.channel.send(currentprefix)
		}else if(message.content.toLowerCase().startsWith(prefix + "disable")){
			if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You need the \`\`MANAGE_GUILD\`\` permission to use this command')
			const tagcontext = args[0]
			
			if(tagcontext === "channelDelete" || tagcontext === "channelCreate" || tagcontext === "messageDelete" || tagcontext === "roleCreate" || tagcontext === "roleDelete" || tagcontext === "memberJoin" || tagcontext === "memberLeave") {
				if(logs.get(tagcontext) === undefined){
					return message.channel.send(`${args[0]} is not enabled`)
				} else {
					logs.delete(tagcontext)
					message.channel.send(`${args[0]} has been disabled`)
				}
		} else if(tagcontext){
			message.channel.send(`${tagcontext} is not a valid log type; Note that this is caps sensitive`)		
		}else {
			message.channel.send(`Please specify which log type you wish to disable`)		
	
		}
	} 

});

	
	
	
	

	
	client.login(TOKEN)

