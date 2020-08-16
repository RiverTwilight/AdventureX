import React from 'react'
import styled from 'styled-components'

const LoveIcon = styled.svg`
    display: inline-block;
    width: 0.944444rem;
    color: rgb(255, 85, 85);
    transform: translateY(10%);
`

export default ({ github }) => (
    <div className="padding-small container paper">
        Made With
        <LoveIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></LoveIcon>
        by RiverTwilight - <a href={github}>Github</a>
    </div>
)