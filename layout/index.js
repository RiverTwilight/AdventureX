import React from 'react'
import Head from 'next/head'

export default class extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        const { siteConfig, correctPage } = this.props;
        return (
            <>
                <Head>
                    <title>{`${correctPage ? (`${correctPage} - `) : ''}${siteConfig.siteName}`}</title>
                </Head>
                <main className="main">
                    {this.props.children}
                </main>
            </>
        )
    }
}
