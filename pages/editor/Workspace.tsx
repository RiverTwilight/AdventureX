import * as React from "react";
import Form from "../../utils/Form";
import GameModule from "./GameModule";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const GAME_CONFIG_FORM = [
	{
		header: "游戏名称",
		id: "name",
		block: true,
	},
	{
		header: "游戏介绍",
		id: "intro",
		block: true,
		placeholder: "让更多的人对你的游戏感兴趣",
	},
	{
		header: "背景图片",
		id: "bg",
		placeholder: "请填写链接，暂不支持上传，图床推荐http://sm.ms",
	},
	{
		id: "scrollBg",
		header: "图片滚动",
		type: "switch",
	},
];

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: any) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const Workspace = ({ setState, gameModule, gameConfig }) => {
	const [tabValue, setTabValue] = React.useState(0);
	const toggleTab = (event: React.ChangeEvent<{}>, index: number) => {
		setTabValue(index);
	};
	return (
		<Paper className="workspace">
			<AppBar position="static">
				<Tabs
					value={tabValue}
					onChange={toggleTab}
					aria-label="simple tabs example"
				>
					<Tab label="游戏配置" {...a11yProps(0)} />
					<Tab label="模块" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={tabValue} index={0}>
				<Form
					defaultValue={gameConfig}
					onValueChange={(values) => {
						this.setState({
							gameConfig: values,
						});
					}}
					config={GAME_CONFIG_FORM}
				/>
				<Button variant="contained" color="primary">
					导出
				</Button>
				<Button
					onClick={() => {
						setState({
                            iframeLoaded: true
                        })
					}}
					variant="contained"
					color="primary"
				>
					🕹运行游戏
				</Button>
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				{gameModule.length &&
					gameModule.map((config, i) => (
						<GameModule
							config={config}
							returnValue={(newConfig) => {
								gameModule[newConfig.id] = newConfig;
								this.setState({
									gameModule: gameModule,
								});
							}}
							onDelete={() => {
								gameModule.splice(i, 1);
								setState({
									gameModule: gameModule,
								});
							}}
							key={`${config.id}${i}`}
						/>
					))}
				{!gameModule.length && (
					<div className="alert alert-secondary">
						点击右上角+添加一个模块
					</div>
				)}
				<Fab
					color="primary"
					style={{
						position: "absolute",
						bottom: "20px",
						left: "44%",
					}}
					aria-label="add"
					onClick={() => {
						setState({
							gameModule: [
								...gameModule,
								{
									text: "推动剧情的文本",
								},
							],
						});
					}}
				>
					<AddIcon />
				</Fab>
			</TabPanel>
		</Paper>
	);
};

export default Workspace;
