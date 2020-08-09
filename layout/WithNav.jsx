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
        <nav class="border fixed split-nav">
            <div class="nav-brand">
                <h3><a href="#">{siteConfig.siteName}</a></h3>
            </div>
            <div class="collapsible">
                <input id="collapsible1" type="checkbox" name="collapsible1" />
                <label for="collapsible1">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                </label>
                <div class="collapsible-body">
                    <ul class="inline">
                        <li><Link href="/editor">创建游戏</Link></li>
                        <li><Link href="/game/duck">游玩</Link></li>
                        <li><a href="https://github.com/RiverTwilight/AdventureX">Github</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <Main>{children}</Main>
    </>
)

export default Navbar
