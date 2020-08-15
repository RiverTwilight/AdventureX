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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: #000;
    transition: all 0.4s;
`

const Caption = styled.div`
    @keyframes shockin${props => props.delay} {
        to{
            ${props => props.delay && css`
            margin-top: calc( -${props.delay * 20}px + 60vh);
            `}
        }
    }
    &: hover{
        animation-play-state: paused
    }
    margin-top: 71vh;
    font-size: 18px;
    ${props => props.delay && css`
    animation: ${props.delay * 100}ms linear shockin${props => props.delay} forwards;
    `}
`

const ScrollText = ({ text, action, onClick }) => {
    if (!text) return null
    return (
        <>
            <Mask top />
            <div
                className={`textarea`}
                style={{
                    height: '70vh',
                    overflowY: 'hidden'
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
                    {action && action.map(action => (
                        <button
                            key={action.to + action.text.substr(0, 3)}
                            className="btn-small" onClick={() => onClick(action.to)}>
                            {action.text}
                        </button>
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
            <Layour currentPage={gameConfig.name} siteConfig={this.props.siteConfig} >
                <div style={{
                    paddingTop: '40px'
                }} className="row">
                    <div className="sm-6 md-8 lg-8 col">
                        <Container>
                            {/*<h4 href="/" style={{
                                textAlign: 'center',
                                position: 'static',
                                display: historyText.length > 1 ? "none" : "block",
                                background: 'none'
                            }}>{gameConfig.name}</h4>*/}
                            <div className="container paper" >
                                <ScrollText
                                    action={gameStory[id].action}
                                    onClick={to => {
                                        this.setState({
                                            id: to,
                                            historyText: [...historyText, gameStory[to].text]
                                        })
                                    }}
                                    text={gameStory[id].text}
                                />

                            </div>
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
                    </div>
                    <div className="sm-6 md-4 lg-4 col">
                        <div className="padding-small container paper">
                        </div>
                        <Copy />
                    </div>
                </div>

            </Layour>
        )
    }
}

export default App;
