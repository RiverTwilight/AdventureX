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

    console.log()
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
    height: 80px;
    margin-top: -80px;
    position: inherit;
    display: none;
    background-image: linear-gradient(rgba(255, 255, 255, 0), #fff);
    background: -o-linear-gradient(bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    ${props => props.display && css`display: block`}
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            text: [props.gameStory[0].text],
            currentText: props.gameStory[0].text,
            playIndex: 1,
            music: true
        }
    }
    componentDidMount() {
        if (localStorage.history) {
            // this.setState(JSON.parse(localStorage.histroy))
        }
    }
    componentDidUpdate() {
        if (this.state.music) {
            this.audioDom.play()
        } else {
            this.audioDom.pause();
        }
        if (!window.update) {
            window.update = window.setInterval(() => {
                const { playIndex, currentText, text, id } = this.state
                if (playIndex < text.length) {
                    this.setState({
                        currentText: text[playIndex] + '\n' + currentText,
                        playIndex: playIndex + 1
                    })
                    localStorage.setItem('history', JSON.stringify({
                        id: id,
                        text: text,
                        currentText: currentText
                    }))
                }
            }, 100)
        }
    }
    render() {
        const { id, text, music, currentText, playIndex } = this.state;
        const { gameStory, gameConfig } = this.props
        return (
            <Layour siteConfig={this.props.siteConfig} >
                <Container>
                    <h3 style={{
                        textAlign: 'center',
                        position: id === 0 ? 'static' : 'fixed',
                        top: '5px',
                        left: '5px',
                        fontSize: id === 0 ? 'auto' : '15px'
                    }}>{gameConfig.name}</h3>
                    <div className="container paper inner border" >
                        <div
                            className={`textarea`}
                            ref={r => this.textArea = r}
                            dangerouslySetInnerHTML={
                                {
                                    __html: currentText.replace(/\n/g, '<br>')
                                }
                            }
                            style={{
                                maxHeight: '50vh',
                                overflowY: 'scroll',
                                lineHeight: '25px'
                            }}>
                        </div>
                        <Mask display={id !== 0} />
                        <br></br>
                        {(playIndex > text.length - 1) && gameStory[id].action && gameStory[id].action.map(action => (
                            <button
                                className="btn-small" onClick={() => {
                                    this.setState({
                                        id: action.to,
                                        text: [...text, ...gameStory[action.to].text.split('\n')]
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
                        src={gameConfig.bgm} type="audio/m4a">
                        Your browser does not support the audio tag.
                    </audio>
                </Container>
            </Layour>
        )
    }
}

export default App;
