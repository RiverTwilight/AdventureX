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
        super(props);
        this.state = {
            module: []
        }
    }
    render() {
        return (
            <Layour siteConifg={this.props.siteConfig} currentPage="编辑器">
                <h1>❤</h1>
            </Layour>
        )
    }
}

export default App;
