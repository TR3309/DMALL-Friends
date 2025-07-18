const axios = require('axios');
const { Client } = require('discord.js-selfbot-v13');
const client = new Client({ checkUpdate: false });

const token = require('./config.json').token;
const messageDM = require('./config.json').msg;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.on('ready', async () => {
    const allamis = (await axios({
        url: `https://discordapp.com/api/v9/users/@me/relationships`,
        method: "GET",
        headers: { authorization: token }
    })).data;

    const r = allamis.filter((user) => user.type === 1);
    let compteur = 1;
    console.log("DM ALL DÉMARRÉ");

    for (let i = 0; i < r.length; i++) {
        try {
            const friendToDM = await client.users.fetch(r[i].user.id);
            const mention = `<@${friendToDM.id}>`;
            const finalMessage = messageDM.replaceAll(`{user}`, mention);

            await friendToDM.send(finalMessage);
            console.log(`${r[i].user.username} : DM OK | ${compteur}`);
            compteur++;
        } catch (err) {
            console.log(`${r[i].user.username} : DM FAIL`);
        }

        await wait(480); // pause entre les messages
    }

    console.log("DM TERMINÉ");
});

client.login(token);

// Gestion d'erreurs
process.on('multipleResolves', () => {});
process.on('rejectionHandled', () => {});
process.on('uncaughtException', (error) => console.log(error));
process.on('unhandledRejection', (reason) => console.log(reason));
process.on('uncaughtExceptionMonitor', () => {});
