import React from 'react';
import Layour from '../layout/index'
import WithNav from '../layout/WithNav';

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
            module: []
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
                                        <div class="form-group">
                                            <label for="paperInputs1">Input</label>
                                            <input type="text" placeholder="Nice input" id="paperInputs1" />
                                        </div>
                                    </div>
                                    <div class="content" id="content2">
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
                </WithNav>
            </Layour>
        )
    }
}

export default App;
