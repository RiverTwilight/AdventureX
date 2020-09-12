import React, { useState } from "react";
import Copy from "../../layout/copyright";
import Info from "../../layout/info";
import Layour from "../../layout";
import styled, { css } from "styled-components";
import glob from "glob";

export async function getStaticProps({ ...ctx }) {
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
		image: Object.keys(data.story)
			.map((key) => {
				console.log(data.story[key]);
				if (data.story[key].image) return data.story[key].image.src;
			})
			.filter((item) => item),
	};

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

const Menu = styled.div`
	position: fixed;
	top: 0;
	bottom: 0;
	right: -200px;
	width: 180px;
	background: white;
	transition: all 0.5s;
	padding-top: 20px;
	padding-left: 5px;
	border-left: 2px solid;
	${(props) =>
		props.visible &&
		css`
			right: 0px;
		`};
`;

const StyledImage = styled.img`
	order: 0;
	flex-grow: 2;
	height: 50vh;
`;

const StyledInteractive = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: white;
	height: 100px;
	border: 2px solid;
	border-radius: 3px;
	padding: 5px 10px;
	order: 1;
	cursor: pointer;
	flex-shrink: 0;
	-moz-user-select: none; /*火狐*/
	-webkit-user-select: none; /*webkit浏览器*/
	-ms-user-select: none; /*IE10*/
	-khtml-user-select: none; /*早期浏览器*/
	user-select: none;
	.caption: {
		font-size: 18px;
	}
	.btn {
		min-width: 120px;
		height: 40px;
		padding: 5px;
		background: none;
		margin-left: 5px;
		border: 1px solid;
	}
`;

const Lock = styled.div`
	@media screen and (orientation: landscape) {
		display: none !important;
	}
`;

const Container = styled.div`
	@media screen and (orientation: portrait) {
		display: none !important;
	}
	display: flex;
	min-height: 90vh;
	flex-direction: column;
	justify-content: space-between;
	font-size: calc(10px + 2vmin);
	transition: all 0.4s;
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

const Interactive = ({ text, action, onClick, onPointChange }) => {
	const [para, setPara] = useState(0);
	if (!text) return null;
	const paras = text.split("\n").filter((p) => p.trim().length !== 0);
	console.log(paras);
	return (
		<StyledInteractive
			onClick={() => {
				if (para < paras.length - 1) {
					setPara(para + 1);
					onPointChange(para + 1);
				}
			}}
		>
			<div class="caption">
				<p className="test">{paras[para].trim()}</p>
				{action &&
					para >= paras.length - 1 &&
					action.map((act, i, actions) => (
						<button
							key={act.to + act.text.substr(0, 3)}
							className="btn"
							onClick={() => {
								setPara(0);
								onClick(act.to);
							}}
						>
							{act.text}
						</button>
					))}
			</div>
		</StyledInteractive>
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
			music: false,
			// 当前展示的图片
			image: props.gameStory[0].image,
			// 执行到的行数
			point: 0,
			// 菜单状态
			menuVisible: false,
			/****Rewrite Only */
			gameConfig: props.gameConfig,
			gameStory: props.gameStory,
			/******* */
		};
	}
	componentDidMount() {
		if (localStorage.history) {
			// this.setState(JSON.parse(localStorage.histroy))
		}
		if (location.search.match(/dev\=true/)) {
			window.addEventListener(
				"message",
				(e) => {
					this.setState({
						gameConfig: e.data.gameConfig || {
							name: "Test",
						},
						gameStory: e.data.gameStory,
					});
				},
				false
			);
		}
		this.toggleBgm();
		this.toggleImage();
	}
	toggleImage() {
		const { image, point, id } = this.state;
		var data = this.state.gameStory[id].image;
		if (data && data.src !== image && data.point >= point) {
			this.setState({
				image: data.src,
			});
		}
	}
	toggleBgm() {
		var bgm = this.state.gameStory[this.state.id].bgm;
		if (bgm && this.audioDom.src !== `${window.location.origin + bgm}`) {
			// console.log("replace music", this.audioDom.src, bgm);
			this.audioDom.src = this.state.gameStory[this.state.id].bgm;
		}
		if (this.state.music) {
			this.audioDom.play();
		} else {
			this.audioDom.pause();
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		const { music, id, point, menuVisible, gameStory } = nextState;
		return (
			music !== this.state.music ||
			id !== this.state.id ||
			point !== this.state.point ||
			menuVisible !== this.state.menuVisible ||
			gameStory !== this.state.gameStory
		);
	}
	componentDidUpdate() {
		this.toggleBgm();
		this.toggleImage();
	}
	render() {
		const {
			id,
			historyText,
			image,
			menuVisible,
			gameStory,
			gameConfig,
		} = this.state;
		const { siteConfig } = this.props;
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
				<Lock>
					<i></i>
					<br></br>
					请把手机竖过来以获得更好体验。
				</Lock>
				<Container>
					<Image src={image} />
					<Interactive
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
						icon={menuVisible ? "X" : "菜单"}
						order={0}
						onClick={() => {
							this.setState({
								menuVisible: !menuVisible,
							});
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
					<Menu visible={menuVisible}>gfdsg</Menu>
				</Container>

				{/*<div className="col md-4">
						<Travia
							siteConfig={siteConfig}
							gameConfig={gameConfig}
						/>
							</div>*/}
			</Layour>
		);
	}
}

export default App;
