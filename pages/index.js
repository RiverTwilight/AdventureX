import React from 'react';
import Layour from '../layout/index'

export async function getStaticProps() {
    const config = await import(`../data/config.json`)
    return {
        props: {
            siteConfig: config.default
        },
    }
}

class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Layour>
                <h1>❤</h1>
            </Layour>
        )
    }
}

export default App;
