import React from 'react'

const Menu = ({ onExport, github }) => {
    return (
        <div className="padding-small container paper">
            <p>📄数据将自动保存到缓存中</p>
            <button
                onClick={onExport}
                className="btn-small">导出</button>
            <input type="file" onChange={e => {
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
                    <a href={github}>github</a>
                    上PR
                </p>
            <h4>模块目录</h4>
        </div>
    )
}

export default Menu
