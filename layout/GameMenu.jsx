import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const Main = styled.main`
    padding-top: 75px;
    .title{
        text-align: center
    }
`

const Navbar = ({ siteConfig, children }) => (
    <>
        <nav className="border fixed split-nav">
            <div className="nav-brand">
                <h3><a title={siteConfig.siteName} href="/">{siteConfig.siteName}</a></h3>
            </div>
            <div className="collapsible">
                <input id="collapsible1" type="checkbox" name="collapsible1" />
                <label for="collapsible1">
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </label>
                <div className="collapsible-body">
                    <ul className="inline">
                        <li><Link href="/editor">+创建游戏</Link></li>
                        <li><Link href="/game/duck">🎮游玩</Link></li>
                        <li><a href="https://github.com/RiverTwilight/AdventureX">Github</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <Main>{children}</Main>
    </>
)

export default Navbar
