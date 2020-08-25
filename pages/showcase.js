import React from 'react';
import Layour from '../layout'
import WithNav from '../layout/WithNav';
import styled from 'styled-components'

export async function getStaticProps({ ...ctx }) {

    const games = (context => {
        const keys = context.keys()
        const values = keys.map(context)
        const data = keys.map((key, index) => {
            // Create slug from filename
            const slug = key
                .split('/')[1]
                .split('/')[0]
                .replace(/ /g, '-')
                .trim()
            const value = values[index]
            return {
                gameConfig: value.default.config,
                gameStory: value.default.story,
                slug: slug,
            }
        })
        return data
    })(require.context(`../games/`, true, /index\.js$/))

    const config = await import(`../data/config.json`);

    return {
        props: {
            allGames: games,
            siteConfig: config.default
        },
    }
}

class ShowCase extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { allGames } = this.props
        return (
            <Layour currentPage="陈列柜" siteConfig={this.props.siteConfig}>
                <WithNav siteConfig={this.props.siteConfig}>
                    <div className="container row paper">
                        {allGames.map(({ slug, gameConfig: { name, authors, cover, privateMode } }) => {
                            if (privateMode) return null
                            return (
                                <div className="paper card sm-6 md-6 lg-6 col">
                                    {cover && <img src={cover} alt="Cover"></img>}
                                    <div className="card-body">
                                        <h4 className="card-title">{name}</h4>
                                        <h5 className="card-subtitle">{authors.map(author => (
                                            <>{author}&nbsp;</>
                                        )) || '匿名'}</h5>
                                        <p className="card-text"></p>
                                        <a
                                            className="paper-btn"
                                            href={`/theme1/${slug}`}
                                        >开始游戏</a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </WithNav>
            </Layour>
        )
    }
}

export default ShowCase;
