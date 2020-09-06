import React, { useState } from "react";
import Copy from "../../layout/copyright";
import Info from "../../layout/info";
import Layour from "../../layout";
import styled, { css } from "styled-components";
import glob from "glob";

export async function getStaticProps({ ...ctx }) {
	console.log(ctx);
	const games = ((context) => {
		const keys = context.keys();
		const values = keys.map(context);
		const data = keys.map((key, index) => {
			// Create slug from filename
			const slug = key
				.split("/")[1]
				.split("/")[0]
				.replace(/ /g, "-")
				.trim();
			const value = values[index];
			return {
				gameConfig: value.default.config,
				gameStory: value.default.story,
				slug: slug,
			};
		});

		return data;
	})(require.context(`../../games/`, true, /index\.js$/));

	const { slug } = ctx.params;

	const content = await import(`../../games/${slug}/index.js`);
	const data = content.default;
	const config = await import(`../../data/config.json`);

	const preloadList = {
		image: Object.keys(data.story).map(key => {
			console.log(data.story[key])
			if(data.story[key].image)return data.story[key].image.src
		}).filter(item => item)
	} 

	console.log(preloadList)

	return {
		props: {
			allGames: games,
			slug,
			preloadList,
			gameStory: data.story,
			gameConfig: data.config,
			siteConfig: config.default,
		},
	};
}

export async function getStaticPaths() {
	//get all .md files in the posts dir
	const games = glob.sync("games/**/index.js");

	// remove path and extension to leave filename only
	const gameSlugs = games.map((file) =>
		file.split("/")[1].split("/")[0].replace(/ /g, "-").trim()
	);

	// create paths with `slug` param
	const paths = gameSlugs.map((slug) => `/theme1/${encodeURI(slug)}`);

	return {
		paths,
		fallback: false,
	};
}

const Mask = styled.div`
	height: 20px;
	position: inherit;
	${(props) =>
		props.bottom &&
		css`
			margin-top: -18px;
			background-image: linear-gradient(rgba(255, 255, 255, 0), #fff);
			background: -o-linear-gradient(
				bottom,
				rgba(255, 255, 255, 0.1),
				rgba(255, 255, 255, 0)
			);
		`}
	${(props) =>
		props.top &&
		css`
			margin-bottom: -20px;
			background-image: linear-gradient(#fff, rgba(255, 255, 255, 0));
			background: -o-linear-gradient(
				top,
				rgba(255, 255, 255, 0.1),
				rgba(255, 255, 255, 0)
			);
		`}
`;

const StyledImage = styled.img`
	order: 0;
	flex-grow: 2;
	height: 50vh;
`;

const StyledScrollText = styled.div`
	order: 1;
	cursor: pointer;
	flex-shrink: 0;
	-moz-user-select: none; /*火狐*/
	-webkit-user-select: none; /*webkit浏览器*/
	-ms-user-select: none; /*IE10*/
	-khtml-user-select: none; /*早期浏览器*/
	user-select: none;
`;

const Container = styled.div`
	display: flex;
	min-height: 90vh;
	flex-direction: column;
	justify-content: space-between;
	font-size: calc(10px + 2vmin);
	transition: all 0.4s;
`;

const Caption = styled.div`
	font-size: 18px;
`;

const Travia = ({ gameConfig, siteConfig }) => {
	return (
		<>
			<div className="padding-small container paper">
				<h4>Menu</h4>
			</div>
			<div className="padding-small container paper">
				<h4>{gameConfig.name}</h4>
				{gameConfig.intro && <p>{gameConfig.intro}</p>}
				<p>
					此游戏由
					{gameConfig.authors.map((au) => (
						<a>{au}&nbsp;</a>
					))}
					制作，发布在{" "}
					<a target="_blank" href="/">
						{siteConfig.siteName}
					</a>
					上。
				</p>
			</div>
			<Copy github={siteConfig.github} />
		</>
	);
};

const ScrollText = ({ text, action, onClick, onPointChange }) => {
	const [para, setPara] = useState(0);
	const paras = text.split("\n").filter((p) => p.trim().length !== 0);
	if (!text) return null;
	return (
		<StyledScrollText
			onClick={() => {
				if (para < paras.length - 1) {
					setPara(para + 1);
					onPointChange(para + 1);
				}
			}}
			className="paper"
		>
			<Caption>
				<p className="test">{paras[para].trim()}</p>
				{action &&
					para >= paras.length - 1 &&
					action.map((act, i, actions) => (
						<button
							key={act.to + act.text.substr(0, 3)}
							className="btn-small test"
							onClick={() => {
								setPara(0);
								onClick(act.to);
							}}
						>
							{act.text}
						</button>
					))}
			</Caption>
		</StyledScrollText>
	);
};

const Image = ({ src }) => {
	return <StyledImage src={src} />;
};

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// 执行到的游戏模块ID
			id: 0,
			// 执行过的游戏模块文案
			historyText: [props.gameStory[0].text],
			// 是否播放音乐
			music: true,
			image: "/images/bg2.png",
			point: 0,
		};
	}
	componentDidMount() {
		if (localStorage.history) {
			// this.setState(JSON.parse(localStorage.histroy))
		}
		if (location.pathname === "/game/test") {
			if (localStorage.editorCache) {
				console.log(JSON.parse(localStorage.editorCache));
				//this.setState(JSON.parse(localStorage.editorCache))
			}
		}
		this.toggleBgm();
		this.toggleImage();
		if (this.props.gameConfig.bg) {
			document.body.style.backgroundImage = `url(${this.props.gameConfig.bg})`;
		}
	}
	toggleImage() {
		const { image, point, id } = this.state;
		var data = this.props.gameStory[id].image;
		if (data && data.src !== image && data.point >= point) {
			this.setState({
				image: data.src,
			});
		}
	}
	toggleBgm() {
		var bgm = this.props.gameStory[this.state.id].bgm;
		if (bgm && this.audioDom.src !== `${window.location.origin + bgm}`) {
			// console.log("replace music", this.audioDom.src, bgm);
			this.audioDom.src = this.props.gameStory[this.state.id].bgm;
		}
		if (this.state.music) {
			this.audioDom.play();
		} else {
			this.audioDom.pause();
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		const { music, id, point } = nextState;
		return (
			music !== this.state.music ||
			id !== this.state.id ||
			point !== this.state.point
		);
	}
	componentDidUpdate() {
		this.toggleBgm();
		this.toggleImage();
	}
	render() {
		const { id, music, historyText, image } = this.state;
		const { gameStory, gameConfig, siteConfig } = this.props;
		return (
			<Layour
				currentPage={gameConfig.name}
				siteConfig={this.props.siteConfig}
			>
				<link
					rel="preload"
					href="https://i.loli.net/2020/09/06/x6a81HjLvI7tsPw.png"
					as="image"
				></link>
				<div className="row">
					<div className="md-8 col">
						<Container>
							<Image src={image} />
							<ScrollText
								action={gameStory[id].action}
								onClick={(to) => {
									this.setState({
										id: to,
										historyText: [
											...historyText,
											gameStory[to].text,
										],
									});
								}}
								onPointChange={(poi) => {
									this.setState({
										point: poi,
									});
								}}
								text={gameStory[id].text}
							/>
							<Info
								icon={music ? "🔊" : "🔈"}
								alt={"音乐"}
								order={0}
								onClick={() => {
									this.setState(
										{
											music: !music,
										},
										this.toggleBgm
									);
								}}
							/>
							<audio
								loop
								autoPlay
								volume={50}
								ref={(r) => (this.audioDom = r)}
								style={{ display: "none" }}
								controls={false}
								type="audio/m4a"
							>
								Your browser does not support the audio tag.
							</audio>
						</Container>
					</div>
					<div className="col md-4">
						<Travia
							siteConfig={siteConfig}
							gameConfig={gameConfig}
						/>
					</div>
				</div>
			</Layour>
		);
	}
}

export default App;
