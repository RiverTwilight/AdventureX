import React, { useState } from "react";
import Form from "../../utils/Form";
import styled, { css } from "styled-components";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

type ModuleConfig = {
	text: string;
	id: any;
	action: {
		to: string;
		text: string;
	}[];
};

interface IDrawer {
	show: boolean;
	className: string;
}

const AutoFill = styled.ul`
    max-height: 100px
    overflow: scroll
`;

const NoneStyledDrawer: React.SFC<IDrawer> = ({
	children,
	className,
	...props
}) => (
	<div className={className} {...props}>
		{children}
	</div>
);

const MODULE_CONFIG_FORM = [
	{
		header: "剧情文案*",
		id: "text",
		block: true,
		placeholder: "请填写链接，暂不支持上传",
	},
	{
		header: "模块名称",
		id: "name",
		block: true,
	},
];

const ModuleEditor = ({ show, returnValue, value }) => {
	const [moduleConfig, setModuleConfig] = useState(value || {});
	const { text, name, action, bgm } = moduleConfig;
	const [focusing, setFocusing] = useState(0);
	return (
		<>
			<Form
				defaultValue={{
					text,
					name,
					bgm,
				}}
				onValueChange={(newCon) => {
					setModuleConfig(Object.assign(newCon, action));
				}}
				config={MODULE_CONFIG_FORM}
			/>
			{action &&
				action.map((act, i) => (
					<React.Fragment key={act.to + act.text}>
						<Form
							focus={focusing}
							defaultValue={act}
							onValueChange={(newCon) => {
								moduleConfig.action[i] = newCon;
								setModuleConfig(moduleConfig);
							}}
							config={[
								{
									id: "text",
									placeholder: `选项${i}`,
								},
								{
									id: "to",
									placeholder: `指向的模块名称`,
									onFocus: () => {
										console.log("afdasd");
										setFocusing(i);
									},
								},
							]}
						/>
						<AutoFill
							style={{
								display: focusing === i ? "block" : "none",
							}}
						>
							sdafsadf
						</AutoFill>
						<button onClick={() => {}} className="btn-danger">
							X
						</button>
					</React.Fragment>
				))}
			<button
				onClick={() => {
					if (!moduleConfig.action) {
						moduleConfig.action = [];
					}
					moduleConfig.action = [
						...moduleConfig.action,
						{
							text: `选项${moduleConfig.action.length}`,
							to: "",
						},
					];
					console.log(moduleConfig);
					setModuleConfig(moduleConfig);
				}}
			>
				添加选项
			</button>
			<button
				onClick={() => {
					if (action) {
						returnValue(moduleConfig);
					} else {
					}
				}}
			>
				保存
			</button>
		</>
	);
};

const GameModule = ({
	onDelete,
	returnValue,
	config,
}: {
	onDelete(): void;
	config: ModuleConfig;
	returnValue(config: ModuleConfig): void;
}) => {
	if (!config) return null;
	const { text, id, action } = config;
	const [showEditor, setShowEditor] = useState(false);
	return (
		<>
			<Card>
				<CardContent>
					<Typography variant="h5" component="h2">
						{id || "未命名"}
					</Typography>
					{action && (
						<Typography component="h5">
							{action.map(({ text, to }) => (
								<span>{text}</span>
							))}
						</Typography>
					)}
					<p className="card-text">{`${text.substr(0, 50)}${
						text.length > 50 ? "..." : ""
					}`}</p>
					{showEditor && (
						<ModuleEditor
							value={config}
							returnValue={(newCon) => {
								setShowEditor(!showEditor);
								returnValue(newCon);
							}}
							show={showEditor}
						/>
					)}
				</CardContent>
				<CardActions>
					<Button
						onClick={() => {
							setShowEditor(!showEditor);
						}}
					>
						编辑
					</Button>
					<IconButton
						onClick={onDelete}
						color="primary"
						aria-label="删除这个模块"
					>
						<DeleteIcon />
					</IconButton>
				</CardActions>
			</Card>
		</>
	);
};

export default GameModule;
