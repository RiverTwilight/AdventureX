import React from 'react';
import Copy from '../../layout/copyright'
import Info from '../../layout/info'
import Layour from '../../layout'
import styled, { css } from 'styled-components'
import glob from 'glob'

export async function getStaticProps({ ...ctx }) {

    const games = (context => {
        const keys = context.keys()
        const values = keys.map(context)
        const data = keys.map((key, index) => {
            // Create slug from filename
            const slug = key
                .split('/')[1]
                .split('/')[0]
                .replace(/ /g, '-')
                .trim()
            const value = values[index]
            return {
                gameConfig: value.default.config,
                gameStory: value.default.story,
                slug: slug,
            }
        })
        console.log(data)

        return data
    })(require.context(`../../games/`, true, /index\.js$/))

    const { slug } = ctx.params

    const content = await import(`../../games/${slug}/index.js`)
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
    const games = glob.sync('games/**/index.js')

    // remove path and extension to leave filename only
    const gameSlugs = games.map(file =>
        file
            .split('/')[1]
            .split('/')[0]
            .replace(/ /g, '-')
            .trim()
    )

    // create paths with `slug` param
    const paths = gameSlugs.map(slug => `/game/${encodeURI(slug)}`)

    return {
        paths,
        fallback: false,
    }
}

const Mask = styled.div`
    height: 20px;
    position: inherit;
    ${props => props.bottom && css`
        margin-top: -18px;
        background-image: linear-gradient(rgba(255, 255, 255, 0), #fff);
        background: -o-linear-gradient(bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    `}
    ${props => props.top && css`
        margin-bottom: -20px;
        background-image: linear-gradient(#fff, rgba(255, 255, 255, 0));
        background: -o-linear-gradient(top, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    `}
`

const Container = styled.div`
    height: 100vh;
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

const Caption = styled.div`
    @keyframes shockin${props => props.delay} {
        to{
            ${props => props.delay && css`
            margin-top: calc( -${props.delay * 20}px + 40vh);
            `}
        }
    }
    --windowHeight: calc(100vh);
    ${props => props.delay && css`
    margin-top: 60vh;
    `}
    font-size: 18px;
    ${props => props.delay && css`
    animation: ${props.delay * 1000}ms linear shockin${props => props.delay} forwards;
    `}
`

const ScrollText = ({ text }) => {
    if (!text) return null
    return (
        <>
            <Mask top />
            <div
                className={`textarea`}
                style={{
                    height: '60vh',
                    overflowY: 'scroll'
                }}>
                <Caption
                    key={text.substr(0, 10)}
                    delay={text.split('\n').length}
                >
                    {text.split('\n').map((para, i) => (
                        <div style={{
                            margin: '8px 0'
                        }} key={para + i}>{para}</div>
                    ))}
                </Caption>
            </div>
            <Mask bottom />
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
            music: true
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
        const { id, music, historyText } = this.state;
        const { gameStory, gameConfig } = this.props;
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
                            text={gameStory[id].text}
                        />
                        {gameStory[id].action && gameStory[id].action.map(action => (
                            <button
                                key={action.to + action.text.substr(0, 3)}
                                style={{
                                    animationDelay: `${(gameStory[id].text.split('\n').length - 1) * 1000}ms`
                                }}
                                className="fadein btn-small" onClick={() => {
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
                        }, this.toggleBgm)
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
