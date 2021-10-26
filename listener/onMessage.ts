import {log, Message} from "wechaty";
import {client} from "../util/TencentChat";
import {ContactType} from "wechaty-puppet";
import botConfig from "../config";
import WhoIsTreater from "../util/WhoIsTreater";

const config = {
    isAutoChat: false,
    isGame: false
}

export default async function onMessage(msg: Message) {

    // admin控制
    changeConfig(msg)

    // 腾讯闲聊
    autoChat(msg, config.isAutoChat)

    // 谁是卧底
    WhoIsTreater(config.isGame, msg)
}

function changeConfig(msg: Message){
    if(msg.talker().id === botConfig.adminId){
        if(msg.text() === "chat"){
            config.isAutoChat = !config.isAutoChat
            msg.talker().say(`配置成功 ==> isAutoChat: ${config.isAutoChat}`)
        }
        if(msg.text() === "game"){
            config.isAutoChat = !config.isAutoChat
            msg.talker().say(`配置成功 ==> isGame: ${config.isAutoChat}`)
        }
    }
}

function autoChat(msg: Message, isAutoChat: boolean) {
    if (!isAutoChat || msg.talker().id === botConfig.adminId) {
        return
    }
    if (!msg.room() && !msg.self() && msg.talker().type() === ContactType.Individual) {
        log.info(botConfig.BotName, `received ======>  Contact: ${msg.talker()!.name()} ---- Text: ${msg.text()}`)
        const params = {
            "Query": msg.text()
        };
        client.ChatBot(params).then(
            (data) => {
                msg.talker().say(data.Reply || "")
                log.info(botConfig.BotName, `sent ======>  Contact: ${msg.talker()!.name()} ---- Text: ${data.Reply}`)
            }
        );
    }
}