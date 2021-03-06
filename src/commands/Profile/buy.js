'use strict';

const Command = require('../../utils/Command.js');
const data = require("../../databases/items.json")

class Help extends Command {
    constructor() {
        super({
            name: 'buy',
            category: '<:profile:938508980177731604> Profile',
            description: 'Buys an item',
            options: [{
                type: "STRING",
                name: "item",
                description: "The name/id of the item you want to buy",
                required: true,
            }, ],
            example: [],
            checks: { setupProfile: true }

        })
    }
    async run(ctx, userDB) {
            if (ctx.args.getString("item")) {
                const item = data.items.find(x => x.name === ctx.args.getString("item") || x.id === ctx.args.getString("item"))
                if (!item) return ctx.errorMessage(`Please provide a valid item name.`)
                if (item.price_gold > userDB.coins) return ctx.errorMessage("You don't have enough **coins <:coins:935949762690179133>** to buy this item")
                if (item.price_wood > userDB.wood) return ctx.errorMessage("You don't have enough **wood <:wood:938500833316847738>** to buy this item")
                userDB.items.push(`${item.id}`)
                userDB.coins = userDB.coins - item.price_gold
                userDB.wood = userDB.wood - item.price_wood
                userDB.save()
                ctx.successMessage(`You have successfully bought a **${item.name}**  for ${item.price_gold?`${item.price_gold} <:coins:935949762690179133>` :`${item.price_wood} <:wood:938500833316847738>`}`)
        }
    }

}

module.exports = new Help;