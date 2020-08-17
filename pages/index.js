import React from 'react';
import Layour from '../layout'
import WithNav from '../layout/WithNav';
import styled from 'styled-components'

const Main = styled.main`
    padding-top: 75px;
    .title{
        text-align: center
    }
`

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
            <Layour siteConfig={this.props.siteConfig}>
                <WithNav siteConfig={this.props.siteConfig}>
                    <div className="container paper">
                        <h1 className="title">Build, Play and Share</h1>
                        <p></p>
                    </div>
                </WithNav>
            </Layour>
        )
    }
}

export default App;
