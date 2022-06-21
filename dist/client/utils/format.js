"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOptions = exports.prettyPrint = exports.rolemenu = exports.button = exports.row = exports.embed = exports.internal = void 0;
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const internal = (i) => i.format('HH:mm:ss', { trim: false });
exports.internal = internal;
const embed = () => new discord_js_1.MessageEmbed().setColor('#9fd1ff');
exports.embed = embed;
const row = () => new discord_js_1.MessageActionRow();
exports.row = row;
const button = () => new discord_js_1.MessageButton().setStyle('PRIMARY');
exports.button = button;
const rolemenu = (options = []) => {
    const menu = new discord_js_1.MessageSelectMenu()
        .setCustomId('role-menu')
        .setPlaceholder('Make a selection...')
        .setMinValues(0)
        .setMaxValues(options.length);
    for (const option of options) {
        menu.addOptions({
            label: option.role.name,
            description: `Add or remove the ${option.role.name} role`,
            value: option.role.name,
        });
    }
    return menu;
};
exports.rolemenu = rolemenu;
const prettyPrint = (value) => {
    if (value === undefined || value === null)
        return '`null`';
    if (Array.isArray(value))
        return value.join(', ');
    switch (typeof value) {
        case 'boolean':
            return value ? 'Yes' : 'No';
        case 'object':
            return JSON.stringify(value, undefined, 2);
        default:
            return value.toString();
    }
};
exports.prettyPrint = prettyPrint;
exports.formatOptions = {
    bold: builders_1.bold,
    italic: builders_1.italic,
    strikethrough: builders_1.strikethrough,
    underscore: builders_1.underscore,
    spoiler: builders_1.spoiler,
    quote: builders_1.quote,
    blockQuote: builders_1.blockQuote,
    codeBlock: builders_1.codeBlock,
    inlineCode: builders_1.inlineCode,
    highlighted: (text) => `\`${text}\``,
    hyperlink: builders_1.hyperlink,
    hideLinkEmbed: builders_1.hideLinkEmbed,
    userMention: builders_1.userMention,
    channelMention: builders_1.channelMention,
    roleMention: builders_1.roleMention,
};
