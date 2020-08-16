import Head from 'next/head'
import '../node_modules/papercss/dist/paper.min.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
