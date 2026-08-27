import React, { Component } from 'react'

import './Giveaway.css'

const GIVEAWAY_URL = 'https://gleam.io/...' // TODO

class Giveaway extends Component {

    render() {
        return (
            <div className="Giveaway">
                <iframe src={GIVEAWAY_URL} frameBorder={0} />
                <p>Loading...</p>
            </div>
        )
    }

}

export default Giveaway
