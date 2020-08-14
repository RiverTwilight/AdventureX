import React from 'react';
import Copy from '../../layout/copyright'
import Info from '../../layout/info'
import Layour from '../../layout/index'
import styled, { css } from 'styled-components'
import glob from 'glob'

export async function getStaticProps({ ...ctx }) {

    const games = (context => {
        const keys = context.keys()
        const values = keys.map(context)
        const data = keys.map((key, index) => {
            // Create slug from filename
            const slug = key
                .replace(/^.*[\\\/]/, '')
                .split('.')
                .slice(0, -1)
                .join('.')
            const value = values[index]
            return {
                gameConfig: value.default.config,
                gameStory: value.default.story,
                slug: slug,
            }
        })
        return data
    })(require.context('../../games', true, /\.js$/))

    const { slug } = ctx.params

    const content = await import(`../../games/${slug}.js`)
    const data = content.default
    const config = await import(`../../data/config.json`);

    return {
        props: {
            allGames: games,
            slug,
            gameStory: data.story,
            gameConfig: data.config,
            siteConfig: config.default
        },
    }
}

export async function getStaticPaths() {
    //get all .md files in the posts dir
    const games = glob.sync('games/**/*.js')


    // remove path and extension to leave filename only
    const gameSlugs = games.map(file =>
        file
            .split('/')[1]
            .replace(/ /g, '-')
            .slice(0, -3)
            .trim()
    )

    // create paths with `slug` param
    const paths = gameSlugs.map(slug => `/game/${encodeURI(slug)}`)

    console.log(paths)

    return {
        paths,
        fallback: false,
    }
}

const Mask = styled.div`
    height: 50px;
    margin-top: -50px;
    position: inherit;
    background-image: linear-gradient(rgba(255, 255, 255, 0), #fff);
    background: -o-linear-gradient(bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
`

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: #000;
    transition: all 0.4s;
    .inner{
        max-height: 90vh;
        min-height: 20vh;
    }
`

const ScrollText = ({ text }) => {
    return (
        <>
            <div
                className={`textarea`}
                style={{
                    height: '60vh',
                    overflowY: 'scroll',
                    paddingBottom: '40px'
                }}>
                {text.pop().split('\n').reverse().map((para, i, paras) => (
                    <div style={{
                        animationDelay: `${(paras.length - i) * 500}ms`,
                        margin: '5px 0',
                    }} className="shockin" key={para + i}>
                        {para}
                    </div>
                ))}
            </div>
            <Mask />
        </>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 执行到的游戏模块ID
            id: 0,
            // 执行过的游戏模块文案
            historyText: [props.gameStory[0].text],
            // 是否播放音乐
            music: false
        }
    }
    componentDidMount() {
        if (localStorage.history) {
            // this.setState(JSON.parse(localStorage.histroy))
        }
        this.toggleBgm()
    }
    toggleBgm() {
        if (this.props.gameStory[this.state.id].bgm) {
            this.audioDom.src = this.props.gameStory[this.state.id].bgm
        }
        if (this.state.music) {
            this.audioDom.play()
        } else {
            this.audioDom.pause();
        }
    }
    componentDidUpdate() {
        this.toggleBgm()
    }
    render() {
        console.log(this.state.historyText)
        const { id, music, historyText } = this.state;
        const { gameStory, gameConfig } = this.props;
        console.log((historyText[historyText.length - 1].split('\n').length - 1) * 500)
        return (
            <Layour siteConfig={this.props.siteConfig} >
                <Container>
                    <a href="/" style={{
                        textAlign: 'center',
                        position: id === 0 ? 'static' : 'fixed',
                        top: '5px',
                        left: '5px',
                        fontSize: id === 0 ? '30px' : '15px',
                        background: 'none'
                    }}>{gameConfig.name}</a>
                    <div className="container paper inner border" >
                        <ScrollText
                            text={historyText}
                        />
                        <br></br>
                        {gameStory[id].action && gameStory[id].action.map(action => (
                            <button
                                key={action.to + action.text.substr(0,3)}
                                style={{
                                    animationDelay: `${(historyText[historyText.length - 1].split('\n').length - 1) * 500}ms`
                                }}
                                className="shockin btn-small" onClick={() => {
                                    this.setState({
                                        id: action.to,
                                        historyText: [...historyText, gameStory[action.to].text]
                                    })
                                }}>
                                {action.text}
                            </button>
                        ))}
                    </div>
                    <Copy />
                    <Info icon={'♻'} alt={'重置'} order={0} onClick={() => {
                        window.location.reload()
                    }} />
                    <Info icon={music ? '🔊' : '🔈'} alt={'音乐'} order={1} onClick={() => {
                        this.setState({
                            music: !music
                        })
                    }} />
                    <audio
                        loop
                        autoPlay
                        ref={r => this.audioDom = r}
                        style={{ display: 'none' }} controls={false}
                        type="audio/m4a">
                        Your browser does not support the audio tag.
                    </audio>
                </Container>
            </Layour>
        )
    }
}

export default App;
