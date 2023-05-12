const TelegramApi = require('node-telegram-bot-api');
const TOKEN = '5489746912:AAHaMY8kAa_t687rFR_kM89gQQpMt2rjFw4';
const bot = new TelegramApi(TOKEN, { polling: true });

const chats = {};
const {gameOptions, againOptions} = require('./options');

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадываю число от 0 до 9. А ты угадываешь его!');
    const randomDigit = Math.floor(Math.random() * 10);
    chats[chatId] = randomDigit;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}



const start = () => {
    bot.setMyCommands([
        { command: '/start', description: "Начальное приветсвие" },
        { command: '/info', description: "Получение информации" },
        { command: '/game', description: "Начать игру" }
    ])

    bot.on('message', async msg => {
        const name = msg.chat.username;
        const text = msg.text;
        const chatId = msg.chat.id;


        if (text === '/start') {
            await bot.sendMessage(chatId, `ты пидр ${name}`);
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/3.webp')
            return;
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, "Инфы нет");
        }

        if (text === "/game") {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "Я тебя не понимаю");
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') startGame(chatId);
        if (data === chats[chatId]) {
            bot.sendMessage(chatId, `Поздравляю ты угадал число! ${chats[chatId]}`, againOptions);
        } else {
            bot.sendMessage(chatId, `Ты не угадал, бот загадал ${chats[chatId]}`, againOptions);
        }
    })
}

start();
