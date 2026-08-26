import mongoose, { Schema } from 'mongoose'
import config from '../../../config'
import { Promise as bluebird } from 'bluebird'
import SteamCommunity from 'steamcommunity'

bluebird.promisifyAll(SteamCommunity.prototype)

const community = new SteamCommunity()

var priceSchema = new Schema({
    name: String,
    price: Number
});

priceSchema.statics.updatePrice = function (name, price) {
    this.update({ name }, { $set: { price } }, { upsert: true }).exec()
        .catch(err => {
            console.log(`Error while updating ${name}: ${err.message}`)
        })
}

priceSchema.statics.formatPrice = function (item, price) {
    return new Promise((resolve, reject) => {
        this.findOne({ name: item.market_hash_name }).exec()
            .then(object => {
                resolve({
                    name: item.market_hash_name,
                    assetid: item.assetid,
                    icon_url: item.icon_url,
                    price: Number(price).toFixed(2)
                })
            })
            .catch(err => reject(err))
    })
}

priceSchema.statics.formatPrices = function (items) {
    let i, promises = []

    items.forEach((item) => {
        // getMarketItem() = HTTP 429, old version from `inventory.js (L28~)` does not contain price
        community.getMarketItem(config.metadata.gameId, item.market_hash_name, function (error, item2) {
            if (error) {
                console.log(`unable to get prices for = ${error}`)
            }

            console.log(item2);
            promises.push(Price.formatPrice(item, item2.medianSalePrices.sort(function (a, b) {
                return a.date < b.date
            }).price))
        })
    })

    return Promise.all(promises)
}

const Price = mongoose.model('Price', priceSchema)

export default Price
