import React, { useState } from 'react'
import Form from '../../utils/Form'
import styled, { css } from 'styled-components'

type ModuleConfig = {
    text: string,
    id: any,
    action: {
        to: string,
        text: string
    }[]
}

interface IDrawer {
    show: boolean,
    className: string
}

const AutoFill = styled.ul`
    max-height: 100px
    overflow: scroll
`

const NoneStyledDrawer: React.SFC<IDrawer> = ({ children, className, ...props }) => (
    <div className={className} {...props}>
        {children}
    </div>
)

const Drawer = styled(NoneStyledDrawer)`
    transition: all 1s;
    position: fixed;
    top: 0px;
    background: #fff;
    overflow: scroll;
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

const MODULE_CONFIG_FORM = [{
    header: "剧情文案*",
    id: "text",
    block: true,
    placeholder: "请填写链接，暂不支持上传"
}, {
    header: "模块名称",
    id: "name",
    block: true
}]

const ModuleEditor = ({ show, returnValue, value }) => {
    const [moduleConfig, setModuleConfig] = useState(value || {});
    const { text, name, action, bgm } = moduleConfig;
    const [focusing, setFocusing] = useState(0);
    //console.log(moduleConfig)
    return (
        <Drawer className="padding-small" show={show}>
            <Form defaultValue={{
                text,
                name,
                bgm
            }} onValueChange={newCon => {
                setModuleConfig(Object.assign(newCon, action))
            }} config={MODULE_CONFIG_FORM} />
            {action && action.map((act, i) => (
                <React.Fragment key={act.to + act.text}>
                    <Form focus={focusing} defaultValue={act} onValueChange={newCon => {
                        moduleConfig.action[i] = newCon;
                        setModuleConfig(moduleConfig)
                    }} config={[{
                        id: 'text',
                        placeholder: `选项${i}`
                    }, {
                        id: 'to',
                        placeholder: `指向的模块名称`,
                        onFocus: () => {
                            console.log('afdasd')
                            setFocusing(i)
                        }
                    }]} />
                    <AutoFill style={{
                        display: focusing === i ? 'block' : 'none'
                    }}>sdafsadf</AutoFill>
                    <button
                        onClick={() => {
                        }}
                        className="btn-danger"
                    >X</button>
                </React.Fragment>
            ))}
            <button onClick={() => {
                if (!moduleConfig.action) {
                    moduleConfig.action = []
                }
                moduleConfig.action = [...moduleConfig.action, {
                    text: `选项${moduleConfig.action.length}`,
                    to: ''
                }]
                console.log(moduleConfig)
                setModuleConfig(moduleConfig)
            }}>
                添加选项
            </button>
            <button onClick={() => {
                if (action) {
                    returnValue(moduleConfig)
                } else {

                }
            }}>
                保存
            </button>
        </Drawer>
    )
}

const GameModule = ({ onDelete, returnValue, config }: {
    onDelete(): void,
    config: ModuleConfig,
    returnValue(config: ModuleConfig): void
}) => {
    if(!config)return null
    const { text, id, action } = config
    const [showEditor, setShowEditor] = useState(false)
    return (
        <>
            <ModuleEditor value={config} returnValue={newCon => {
                setShowEditor(!showEditor)
                returnValue(newCon)
            }} show={showEditor} />
            <div className="card sm-6 md-6 lg-6 col">
                <div className="card-body">
                    <h4 className="card-title">{id || '未命名'}</h4>
                    {action && <h5 className="card-subtitle">{action.map(({ text, to }) => (
                        <span>{text}</span>
                    ))}</h5>}
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

export default GameModule
