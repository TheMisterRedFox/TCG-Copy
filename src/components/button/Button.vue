<script setup lang="ts"></script>

<template>
	<button @click="$emit('click')">
		<slot />
	</button>
</template>

<style scoped>
button {
	display: inline-block;
	outline: none;
	cursor: pointer;
	font-size: 14px;
	line-height: 1;
	border-radius: 500px;
	transition-property: background-color, border-color, color, box-shadow, filter;
	transition-duration: 0.3s;
	border: 1px solid transparent;
	letter-spacing: 2px;
	min-width: 160px;
	text-transform: uppercase;
	white-space: normal;
	font-weight: 700;
	text-align: center;
	padding: 16px 14px 18px;
	color: #616467;
	box-shadow: inset 0 0 0 2px #616467;
	background-color: transparent;
	height: 48px;
}
button:hover {
	color: #fff;
	background-color: #616467;
}
</style>
