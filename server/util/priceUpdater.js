import { default as request } from 'request-promise-native'
import { Price } from '../db'

const API_ENDPOINT = 'https://api.skinport.com/v1/items?app_id=730&currency=USD&tradable=1'

export default function connect(interval) {
    updatePrices()
    setInterval(updatePrices, interval)
}

function updatePrices() {
    const opts = {
        uri: API_ENDPOINT,
        json: true
    }
    request(opts)
        .then(json => {
            json.forEach(function (obj) {
                Price.updatePrice(obj.market_hash_name, getItemPrice(obj));
            });
        })
        .then(xd => {
            console.log('Updated prices')
        })
        .catch(err => {
            console.log(`Error while updating prices: ${err}`)
        })
}

function getItemPrice(object) {
    return Number(object.suggested_price).toFixed(2)
}
