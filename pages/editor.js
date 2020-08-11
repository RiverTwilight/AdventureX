import React from 'react';
import Layour from '../layout/index'
import WithNav from '../layout/WithNav';
import Form from '../utils/Form'
import styled, { css } from 'styled-components'

const GAME_CONFIG_FORM = [{
    header: "游戏名称",
    id: "name",
    block: true
}, {
    header: "背景音乐",
    id: "bgm",
    block: true,
    placeholder: "请填写链接，暂不支持上传"
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
            module: [],
            gameConfig: {}
        }
    }
    render() {
        return (
            <Layour siteConfig={this.props.siteConfig} currentPage="编辑器">
                <WithNav siteConfig={this.props.siteConfig}>
                    <div class="row">
                        <div class="sm-6 md-8 lg-8 col">
                            <div className="container paper padding-small">
                                <div class="row flex-spaces tabs">
                                    <input id="tab1" type="radio" name="tabs" checked />
                                    <label for="tab1">游戏配置</label>

                                    <input id="tab2" type="radio" name="tabs" />
                                    <label for="tab2">剧情</label>

                                    <div class="content" id="content1">
                                        <Form onValueChange={values => {
                                            console.log(values)
                                        }} config={GAME_CONFIG_FORM} />
                                        <button>导出配置文件</button>
                                        <button className="btn-success">🕹运行游戏</button>
                                    </div>

                                    <div class="content" id="content2">
                                        <button>+</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="sm-6 md-4 lg-4 col">
                            <div className="padding-small container paper">
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

export default App;
