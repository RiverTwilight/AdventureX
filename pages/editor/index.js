import * as React from "react";
import Layour from "../../layout";
import Menu from "./Sidebar";
import Workspace from "./Workspace";
import JSZip from "jszip";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import styled, { css } from "styled-components";
import Typography from "@material-ui/core/Typography";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import Fab from "@material-ui/core/Fab";

export async function getStaticProps() {
	const config = await import(`../../data/config.json`);
	return {
		props: {
			siteConfig: config.default,
		},
	};
}

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	})
);

const TAB_CONFIG = [
	{
		id: "tab1",
		text: "配置",
	},
	{
		id: "tab2",
		text: "剧情",
	},
];

const Help = styled.button`
	border-top-left-radius: 185px 160px;
	border-top-right-radius: 200px 195px;
	border-bottom-right-radius: 160px 195px;
	border-bottom-left-radius: 185px 190px;
	position: fixed;
	right: 30px;
	${(props) =>
		!isNaN(props.order) &&
		css`
			bottom: ${props.order * 50 + 5}px;
		`};
	background: white;
`;

const StyledEditor = styled.div`
	display: flex;
	-webkit-box-align: start;
	-ms-flex-align: start;
	align-items: flex-start;
	.workspace {
		height: 100vh;
		position: static;
		flex-basis: 50%;
	}
	.right-warpper {
		flex-grow: 1;
	}
	.editor {
		width: 100%;
		height: 50vh;
	}
	.preview {
		background: white;
		width: 100%;
		height: 50vh;
		border-left: 2px solid;
		border-bottom: 2px solid;
		box-sizing: border-box;
	}
	.preview iframe {
		width: 100%;
		height: 100%;
		border-style: none;
	}
	.preview-alert {
		position: relative;
		top: 50%;
		left: 50%;
	}
`;

function download(file, name) {
	var a = document.createElement("a");
	a.href = URL.createObjectURL(file);
	a.download = name;
	a.click();
}

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gameModule: [],
			gameConfig: null,
			activeTab: "tab1",
			showEditor: false,
			previewLoaded: false,
		};
	}
	componentDidMount() {
		/*window.onbeforeunload = function (event) {
            return '您可能有数据没有保存';
        };*/
		if (localStorage.editorCache) {
			const { gameConfig, gameModule } = JSON.parse(
				localStorage.editorCache
			);
			this.setState({
				gameModule,
				gameConfig,
			});
		}
	}
	componentWillUnmount() {
		// window.onbeforeunload = null
	}
	updatePreview = () => {
		const { gameModule, gameConfig, previewLoaded } = this.state;
		const updateData = {
			gameStory: { ...gameModule },
			gameConfig,
		};
		if (previewLoaded) {
			const iframe = this.iframeDom;
			iframe.contentWindow.postMessage(updateData, location.origin);
		}
	};
	componentDidUpdate() {
		const { gameModule, gameConfig, previewLoaded } = this.state;
		this.updatePreview();
		localStorage.setItem(
			"editorCache",
			JSON.stringify({
				gameModule,
				gameConfig,
			})
		);
	}
	input() {
		// todo
	}
	export() {
		const { gameModule, gameConfig } = this.state;
		const zip = new JSZip();
		var project = zip.folder(gameConfig.name);
		project.file(
			"index.js",
			`
            import story from './story.js'; export default{
                config: ${JSON.stringify(gameConfig)},
                story
            }
        `
		);
		project.file(
			"story.js",
			`
            export default${JSON.stringify(gameModule)}
        `
		);
		zip.generateAsync({ type: "blob" }).then(function (content) {
			download(content, `${gameConfig.name}.project.zip`);
		});
	}
	render() {
		const { gameModule, gameConfig, activeTab, previewLoaded } = this.state;
		const { siteConfig } = this.props;
		return (
			<Layour siteConfig={this.props.siteConfig} currentPage="编辑器">
				<StyledEditor>
					<Workspace
						setState={this.setState.bind(this)}
						gameModule={gameModule}
						gameConfig={gameConfig}
					/>
					<div className="right-warpper">
						<div className="preview">
							<iframe
								onLoad={() => {
									this.setState({
										previewLoaded: true,
									});
								}}
								ref={(r) => (this.iframeDom = r)}
								src="/theme1/duck?dev=true"
							></iframe>

							{/*<div class="preview-alert">
									<SportsEsportsIcon />
								</div>*/}

							<Fab
								size="small"
								color="secondary"
								aria-label="add"
								style={{
									position: "relative",
									left: "1%",
									top: "30vh",
								}}
							>
								<FullscreenIcon />
							</Fab>
						</div>
						<div className="editor"></div>
					</div>
				</StyledEditor>
			</Layour>
		);
	}
}

export default Editor;
