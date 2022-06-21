"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
async function loadEvents(client) {
    const eventFiles = await (0, promises_1.readdir)('./src/client/events/');
    console.log(`Loading a total of ${eventFiles.length} events.`);
    for (let i = 0; i < eventFiles.length; i++) {
        const eventName = eventFiles[i].split('.')[0];
        console.log(`Loading Event: ${eventName}`);
        const event = require(`../events/${eventFiles[i]}`);
        client.on(eventName, event.run.bind(null, client));
    }
}
exports.default = loadEvents;
