import React from 'react'
import styled, { css } from 'styled-components'

const Info = styled.button`
    border-top-left-radius: 185px 160px;
    border-top-right-radius: 200px 195px;
    border-bottom-right-radius: 160px 195px;
    border-bottom-left-radius: 185px 190px;
    position: fixed;
    top: 5px;
    z-index: 5;
   ${props => !isNaN(props.order) && css`
    right: ${props.order * 50 + 5 }px
  `};
    background: white
`
export default ({ icon, alt, ...props}) => (
    <Info {...props} className="paper-btn btn-small">
        <span ariaLable={alt} role="img">{icon}</span>
    </Info>
)
