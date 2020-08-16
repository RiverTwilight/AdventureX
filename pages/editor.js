import React, { useState } from 'react';
import Layour from '../layout'
import WithNav from '../layout/WithNav';
import Form from '../utils/Form'
import JSZip from 'jszip'
import styled, { css } from 'styled-components'

export async function getStaticProps() {
    const config = await import(`../data/config.json`)
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

const MODULE_CONFIG_FORM = [{
    header: "模块名称",
    id: "name",
    block: true
}, {
    header: "剧情文案",
    id: "bgm",
    block: true,
    placeholder: "请填写链接，暂不支持上传"
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

const Drawer = styled.div`
    transition: all 1s;
    position: fixed;
    top: 0px;
    background: #fff;
    z-index: 40;
    padding-top: 70px;
    bottom: 0px;
    right: -400px;
    width: 400px;
    @media only screen and (max-width: 768px) {
        right: -305px;
        width: 300px;
    }
    ${props => props.show && css`
        right: 0px !important
    `};
`

const TextEditor = ({ show, onValueChange }) => {
    return (
        <Drawer className="border" show={show}>
            <Form onValueChange={onValueChange} config={MODULE_CONFIG_FORM} />
        </Drawer>
    )
}

function download(file, name) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click()
}

const GameModule = ({ onDelete, onEdit, config: { text, id, action } }) => {
    const [showEditor, setShowEditor] = useState(false)
    return (
        <>
            <TextEditor onValueChange={onEdit} show={showEditor} />
            <div className="card sm-6 md-6 lg-6 col">
                <div className="card-body">
                    <h4 className="card-title">{id || '未命名'}</h4>
                    {/*<h5 className="card-subtitle">{action.map(({ text, to }) => (
                        <span>{text}</span>
                    ))}</h5>*/}
                    <p className="card-text">{`${text.substr(0, 50)}${text.length > 50 ? '...' : ''}`}</p>
                    <button
                        onClick={() => {
                            setShowEditor(!showEditor)
                        }}
                    >编辑</button>
                    <button
                        onClick={onDelete}
                        className="btn-danger"
                    >X</button>
                </div>
            </div>
        </>
    )
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
                // see FileSaver.js
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
                                        <React.Fragment key={tab.if}>
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
                                            {gameModule.map((config, i) => (
                                                <GameModule
                                                    config={config}
                                                    onEdit={(i, newConfig) => {
                                                        gameModule[i] = newConfig
                                                        this.setState({
                                                            gameModule: gameModule
                                                        })
                                                    }}
                                                    onDelete={i => {
                                                        this.setState({
                                                            gameModule: gameModule.splice(i, 1)
                                                        })
                                                    }}
                                                    key={config.id || i}
                                                />
                                            ))}
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
                            <div className="padding-small container paper">
                                <p>📄数据将自动保存到缓存中</p>
                                <button
                                    onClick={this.export.bind(this)}
                                    className="btn-small">导出</button>
                                <input onChange={e => {
                                    console.log(e)
                                }} className="btn-small" />
                                <button
                                    onClick={() => {
                                        window.open('/game/test')
                                    }}
                                    className="btn-success btn-small">🕹运行游戏</button>
                                <p>
                                    想要将游戏发布到陈列柜里吗？
                                    你可以给我发送邮件或到
                                    <a href={siteConfig.github}>github</a>
                                    上PR
                                </p>
                                <h4>模块目录</h4>
                            </div>
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
