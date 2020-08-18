import React  from 'react';
import Layour from '../../layout'
import WithNav from '../../layout/WithNav';
import Form from '../../utils/Form'
import GameModule from './GameModule'
import Menu from './Menu'
import JSZip from 'jszip'
import styled, { css } from 'styled-components'

export async function getStaticProps() {
    const config = await import(`../../data/config.json`)
    return {
        props: {
            siteConfig: config.default
        },
    }
}

const TAB_CONFIG = [{
    id: 'tab1',
    text: '配置'
}, {
    id: 'tab2',
    text: '剧情'
}]

const GAME_CONFIG_FORM = [{
    header: "游戏名称",
    id: "name",
    block: true
}, {
    header: "游戏介绍",
    id: "intro",
    block: true,
    placeholder: "让更多的人对你的游戏感兴趣"
}, {
    header: "背景图片",
    id: "bg",
    placeholder: "请填写链接，暂不支持上传，图床推荐http://sm.ms"
}, {
    id: "scrollBg",
    header: "图片滚动",
    type: "switch",
}]

const Help = styled.button`
    border-top-left-radius: 185px 160px;
    border-top-right-radius: 200px 195px;
    border-bottom-right-radius: 160px 195px;
    border-bottom-left-radius: 185px 190px;
    position: fixed;
    right: 30px;
   ${props => !isNaN(props.order) && css`
        bottom: ${props.order * 50 + 5}px
  `};
    background: white
`

function download(file, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click()
}

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameModule: [],
            gameConfig: null,
            activeTab: 'tab1',
            showEditor: false
        }
    }
    componentDidMount() {
        /*window.onbeforeunload = function (event) {
            return '您可能有数据没有保存';
        };*/
        if (localStorage.editorCache) {
            const { gameConfig, gameModule } = JSON.parse(localStorage.editorCache)
            this.setState({
                gameModule,
                gameConfig
            })
        }
    }
    componentWillUnmount() {
        // window.onbeforeunload = null
    }
    componentDidUpdate() {
        const { gameModule, gameConfig } = this.state;
        localStorage.setItem('editorCache', JSON.stringify({
            gameModule,
            gameConfig
        }))
    }
    addNewModule() {
        this.setState({
            gameModule: [...this.state.gameModule, {
                text: "推动剧情的文本"
            }]
        })
    }
    input() {
        // todo
    }
    export() {
        const { gameModule, gameConfig } = this.state;
        const zip = new JSZip();
        var project = zip.folder(gameConfig.name);
        project.file("index.js", `
            import story from './story.js'; export default{
                config: ${JSON.stringify(gameConfig)},
                story
            }
        `);
        project.file("story.js", `
            export default${JSON.stringify(gameModule)}
        `);
        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                download(content, `${gameConfig.name}.project.zip`);
            });
    }
    render() {
        const { gameModule, gameConfig, activeTab } = this.state;
        const { siteConfig } = this.props
        return (
            <Layour siteConfig={this.props.siteConfig} currentPage="编辑器">
                <WithNav siteConfig={this.props.siteConfig}>
                    <div className="row">
                        <div className="sm-6 md-8 lg-8 col">
                            <div className="container paper padding-small">
                                <div className="row flex-spaces tabs">
                                    {TAB_CONFIG.map(tab => (
                                        <React.Fragment key={tab.id}>
                                            <input id={tab.id} type="radio" name={tab.id} checked={activeTab === tab.id} />
                                            <label
                                                onClick={() => {
                                                    this.setState({
                                                        activeTab: tab.id
                                                    })
                                                }}
                                                for={tab.id}
                                            >{tab.text}</label>
                                        </React.Fragment>
                                    ))}
                                    <div className="content" id="content1">
                                        <Form
                                            defaultValue={gameConfig}
                                            onValueChange={values => {
                                                this.setState({
                                                    gameConfig: values
                                                })
                                            }}
                                            config={GAME_CONFIG_FORM} />
                                    </div>
                                    <div className="content" id="content2">
                                        <div className="row">
                                            {gameModule.length && gameModule.map((config, i) => (
                                                <GameModule
                                                    config={config}
                                                    returnValue={newConfig => {
                                                        gameModule[newConfig.id] = newConfig
                                                        this.setState({
                                                            gameModule: gameModule
                                                        })
                                                    }}
                                                    onDelete={() => {
                                                        gameModule.splice(i, 1)
                                                        this.setState({
                                                            gameModule: gameModule
                                                        })
                                                    }}
                                                    key={`${config.id}${i}`}
                                                />
                                            ))}
                                            {!gameModule.length && <div className="alert alert-secondary">点击右上角+添加一个模块</div>}
                                        </div>
                                        <button
                                            style={{
                                                position: 'absolute',
                                                top: '5px',
                                                right: '5px'
                                            }}
                                            onClick={this.addNewModule.bind(this)}>+</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="sm-6 md-4 lg-4 col">
                            <Menu github={siteConfig.github} onExport={this.export.bind(this)} />
                        </div>
                    </div>
                    <Help order={1} className="paper-btn btn-small">
                        <span ariaLable="帮助" role="img">❔</span>
                    </Help>
                </WithNav>
            </Layour>
        )
    }
}

export default Editor;
