const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'id',
      enabled: true,
      runIn: ['text'],
      cooldown: 2,
      bucket: 1,
      aliases: [],
      permLevel: 5,
      botPerms: [],
      requiredConfigs: [],
      description: 'Returns ID.',
      quotedStringSupport: true,
      usage: '<guild|member|role|channel> [member:member] [channel:channel] [value:str]',
      usageDelim: ' ',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [type, member, channel, ...value]) {
    value = value.length > 0 ? value.join(' ') : null;

    switch (type) {
    case 'guild':
      return msg.send(`${msg.guild.name} / ${msg.guild.id}`, { code: 'xl' }).catch(err => console.log(err, 'error'));
    case 'member':
      if (member) return msg.send(`${member.user.tag} / ${member.id}`, { code: 'xl' }).catch(err => console.log(err, 'error'));
      break;
    case 'role':
      if (msg.guild.roles.find('name', value)) {
        return msg.send(`${msg.guild.roles.find('name', value).name} / ${msg.guild.roles.find('name', value).id}`, { code: 'xl' }).catch(err => console.log(err, 'error'));
      }
      break;
    case 'channel':
      return msg.send(`#${channel.name} / ${channel.id}`, { code: 'xl' }).catch(err => console.log(err, 'error'));
    default:
      return msg.send(`I cannot find the ID of \`${value}\``).catch(err => console.log(err, 'error'));
    }
  }
};