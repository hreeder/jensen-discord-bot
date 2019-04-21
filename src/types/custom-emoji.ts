import {Util, Emoji} from 'discord.js';
import {ArgumentType, util as CommandoUtil, CommandoClient, CommandMessage} from 'discord.js-commando';

export class CustomEmojiArgumentType extends ArgumentType {
	constructor(client: CommandoClient) {
		super(client, 'custom-emoji');
	}

	validate(value: string, msg: CommandMessage) {
		const matches = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
		if(matches && msg.client.emojis.has(matches[2])) return true;
		if(!msg.guild) return false;
		const search = value.toLowerCase();
		let emojis = msg.guild.emojis.filter(nameFilterInexact(search));
		if(!emojis.size) return false;
		if(emojis.size === 1) return true;
		const exactEmojis = emojis.filter(nameFilterExact(search));
		if(exactEmojis.size === 1) return true;
		if(exactEmojis.size > 0) emojis = exactEmojis;
		return emojis.size <= 15 ?
			`${CommandoUtil.disambiguation(emojis.map(emoji => Util.escapeMarkdown(emoji.name)), 'emojis', undefined)}\n` :
			'Multiple emojis found. Please be more specific.';
	}

	parse(value: string, msg: CommandMessage) {
		const matches = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
		if(matches) return msg.client.emojis.get(matches[2]) || null;
		const search = value.toLowerCase();
		const emojis = msg.guild.emojis.filter(nameFilterInexact(search));
		if(!emojis.size) return null;
		if(emojis.size === 1) return emojis.first();
		const exactEmojis = emojis.filter(nameFilterExact(search));
		if(exactEmojis.size === 1) return exactEmojis.first();
		return null;
	}
}

function nameFilterExact(search: any): any {
	return (emoji: Emoji) => emoji.name.toLowerCase() === search;
}

function nameFilterInexact(search: any): any {
	return (emoji: Emoji) => emoji.name.toLowerCase().includes(search);
}
