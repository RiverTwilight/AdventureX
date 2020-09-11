import React from "react";
import Layour from "../layout";
import styled from "styled-components";

const FirstSection = styled.div`
	display: flex;
	align-items: center;
	height: 100vh;
	.warpper {
		display: flex;
		flex: 1 0 auto;
		flex-wrap: wrap;
		justify-content: space-around;
		width: 100%;
		.title {
			font-size: 128px;
			color: rgb(255, 255, 255);
			line-height: 1.1;
			margin: 0px;
			white-space: nowrap;
			@media only screen and (max-width: 767.999px) {
				font-size: 68px;
			}
		}
		.subtitle {
			flex: 0 0 25%;
			padding: 28px;
			font-weight: 600;
			color: rgb(255, 255, 255);
		}
	}
`;

export async function getStaticProps() {
	const config = await import(`../data/config.json`);
	return {
		props: {
			siteConfig: config.default,
		},
	};
}

class Index extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Layour siteConfig={this.props.siteConfig}>
				<FirstSection>
					<div class="warpper">
						<h1 className="title">AdvenX</h1>
						<p className="subtitle">
							无需编程经验创造你自己的游戏！
						</p>
					</div>
				</FirstSection>
			</Layour>
		);
	}
}

export default Index;
