import React from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			margin: theme.spacing(1),
		},
	},
}));

const Menu = ({ onExport, github }) => {
	const classes = useStyles();
	return (
		<Paper
			style={{
				padding: "5px",
			}}
		>
			<p>📄数据将自动保存到缓存中</p>
			<div className={classes.root}>
				<Button variant="contained" color="primary" onClick={onExport}>
					导出
				</Button>
				<Button
					onClick={() => {
						window.open("/game/test");
					}}
					variant="contained"
					color="primary"
				>
					🕹运行游戏
				</Button>
			</div>

			<p>
				想要将游戏发布到陈列柜里吗？ 你可以给我发送邮件或到
				<a href={github}>github</a>
				上PR
			</p>
			<Typography component="h3" gutterBottom>
				模块目录
			</Typography>
		</Paper>
	);
};

export default Menu;
