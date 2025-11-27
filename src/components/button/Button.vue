<script setup lang="ts"></script>

<template>
	<button @click="$emit('click')">
		<slot />
	</button>
</template>

<style lang="less" scoped>
button {
	display: inline-block;
	outline: none;
	cursor: pointer;
	font-size: 14px;
	border-radius: 15px;
	padding: 10px;
	transition: 0.2s;
	border: none;
	box-shadow: 0 0 10px #808080;

	&:hover {
		color: #fff;
		background: linear-gradient(90deg, #ff8a00, #e52e71);
		box-shadow: 0 0 15px #3d3d3d;
		transition: 0.2s;
	}

	&.booster-button {
		width: 76px;
		height: 76px;
		padding: 10px;
		border-radius: 50%;
		position: relative;

		&:after {
			content: '+99';
			background-color: rgb(212, 33, 33);
			padding: 2px;
			width: 20px;
			height: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			position: absolute;
			top: 0px;
			right: 0px;
			font-size: 12px;
			box-shadow: 0 0 5px #292929;
			color: #ffffff;
		}
	}
	
}
</style>
