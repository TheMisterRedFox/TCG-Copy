<script setup lang="ts">
import CardHeader from '@/components/card/CardHeader.vue';
import CardImage from '@/components/card/CardImage.vue';
import CardRarity from '@/components/card/CardRarity.vue';
import type { Ability, Type } from '@/interface/GeneralTypes';
import type { GeneratedCard } from '@/interface/GeneratedCard';

const { item, getRarityName } = defineProps<{
	item: GeneratedCard;
	getRarityName: (rarity: number) => string;
}>();
</script>

<template>
	<div
		class="card"
		:class="[
			item.clicked ? 'clicked' : '',
			item.card ? `rarity-${item.card?.rarity}` : '',
			item.card ? `type-${item.data?.types[0]?.type.name}` : '',
		]"
		@click="item.clicked = true"
	>
		<div class="card-inner">
			<!-- Header -->
			<CardHeader v-if="!item.loading && item.card" :name="item.card?.name" />

			<!-- Image -->
			<CardImage
				v-if="!item.loading && item.card"
				:id="item.card?.id"
				:name="item.card?.name"
				:image="item.data?.custom_image"
			/>

			<!-- Body -->
			<div class="card-body" v-if="!item.loading && item.data">
				<p>Rarity : {{ getRarityName(item.card?.rarity ?? 0) }}</p>
				<p>Type : {{ item.data.types.map((t: Type) => t.type.name).join(', ') }}</p>
				<p>Weight : {{ item.data.weight / 10 }} kg</p>
				<p>Height : {{ item.data.height / 10 }} m</p>
				<p>Abilities : {{ item.data.abilities.map((a: Ability) => a.ability.name).join(', ') }}</p>
			</div>
		</div>

		<!-- Rarity icon -->
		<CardRarity v-if="!item.loading && item.card" :rarity="item.card?.rarity" />
	</div>
</template>

<style scoped>
@import './Card.less';
</style>
