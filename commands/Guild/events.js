const { Command } = require('klasa');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'events',
      enabled: true,
      runIn: ['text'],
      cooldown: 2,
      bucket: 1,
      aliases: ['event'],
      permLevel: 10,
      botPerms: [],
      requiredConfigs: [],
      description: 'Lists upcoming guild events.',
      quotedStringSupport: true,
      usage: '<add|remove|list> [event:str] [date:str] [time:str]',
      usageDelim: ' ',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [action, eve, date, time]) {
    const pOne = [];
    const pTwo = [];
    let output = '';
    let ctr = 1;
    let data;
    let padTwo;
    let padOne;

    if (!action) action = 'list';

    switch (action) {
    default:
      output = [`= Upcoming ${msg.guild.name} Events =\n`];
      if (msg.guild.configs.events.length === 0) return msg.send('There are no upcoming events scheduled!');
      for (let i = 0; i < msg.guild.configs.events.length; i++) {
        data = Object.values(JSON.parse(msg.guild.settings.events[i]));
        pOne.push(data[0]);
        pTwo.push(data[1]);
      }
      padOne = pOne.sort((a, b) => a.length < b.length)[0].length;
      padTwo = pTwo.sort((a, b) => a.length < b.length)[0].length;
      for (let i = 0; i < msg.guild.configs.events.length; i++) {
        data = Object.values(JSON.parse(msg.guild.configs.events[i]));
        output.push(`${ctr++} :: ${data[0].padEnd(padOne)}\t${data[1].padEnd(padTwo)}\t${data[2]}`);
      }
      return msg.sendCode('asciidoc', output);
    }
  }

  async add(msg, event, date, time) {
    const { errors, updated } = await msg.guild.configs.update(msg.guild, 'add', 'events',
      JSON.stringify({ 'event': event, 'date': await this.parseDashDate(date), 'time': time }),
      msg.guild, { avoidUnconfigurable: true, action: 'add' });
    if (errors.length) return msg.sendMessage(errors[0]);
    if (!updated.length) return msg.sendMessage('Cannot add that event!');
    return msg.send(`Successfully added the event **${event}** on **${date}** at **${time}**!`);
  }

  async remove(msg, index) {
    if (!index || index <= 0 || index > msg.guild.configs.events.length) return msg.send('You must provide a valid event index!');
    msg.guild.configs.guilds.updateArray(msg.guild, 'remove', 'events', msg.guild.configs.events[index - 1])
      .catch(e => { console.log(e); msg.send(`**${index}** is not a valid event index!`); });
    const data = Object.values(JSON.parse(msg.guild.settings.events[index - 1]));
    msg.send(`Successfully removed the event **${data[0]}** on **${data[1]}** at **${data[2]}**!`);
  }

  async list(msg) {
    return msg;
  }

  /* MM-DD-YYYY */
  async parseDashDate(date) {
    const final = date.split('-');
    return new Date(`${final[2]}.${final[0]}.${final[1]}`);
  }
};