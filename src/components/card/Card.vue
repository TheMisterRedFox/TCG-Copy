<script setup lang="ts">
import CardHeader from '@/components/card/CardHeader.vue';
import CardImage from '@/components/card/CardImage.vue';
import CardRarity from '@/components/card/CardRarity.vue';
import type { Ability, Type } from '@/interface/GeneralTypes';
import type { GeneratedCard } from '@/interface/GeneratedCard';

const props = defineProps<{
	item: GeneratedCard;
	getRarityName: (rarity: number) => string;
}>();
</script>

<template>
	<div
		class="card"
		:class="[
			props.item.clicked ? 'clicked' : '',
			props.item.card ? `rarity-${props.item.card?.rarity}` : '',
			props.item.card ? `type-${props.item.data?.types[0]?.type.name}` : '',
		]"
		@click="props.item.clicked = true"
	>
		<div class="card-inner">
			<!-- Header -->
			<CardHeader v-if="!props.item.loading && props.item.card" :name="props.item.card?.name" />

			<!-- Image -->
			<CardImage
				v-if="!props.item.loading && props.item.card"
				:id="props.item.card?.id"
				:name="props.item.card?.name"
				:image="props.item.data?.custom_image"
			/>

			<!-- Body -->
			<div class="card-body" v-if="!props.item.loading && props.item.data">
				<p>Rarity : {{ getRarityName(props.item.card?.rarity ?? 0) }}</p>
				<p>Type : {{ props.item.data.types.map((t: Type) => t.type.name).join(', ') }}</p>
				<p>Weight : {{ props.item.data.weight / 10 }} kg</p>
				<p>Height : {{ props.item.data.height / 10 }} m</p>
				<p>Abilities : {{ props.item.data.abilities.map((a: Ability) => a.ability.name).join(', ') }}</p>
			</div>
		</div>

		<!-- Rarity icon -->
		<CardRarity v-if="!props.item.loading && props.item.card" :rarity="props.item.card?.rarity" />
	</div>
</template>

<style scoped>
@import './Card.less';
</style>
