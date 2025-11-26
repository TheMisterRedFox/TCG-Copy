<script setup lang="ts">
import CardAttack from '@/components/card/CardAttack.vue';
import CardHeader from '@/components/card/CardHeader.vue';
import CardImage from '@/components/card/CardImage.vue';
import CardRarity from '@/components/card/CardRarity.vue';
import CardType from '@/components/card/CardType.vue';
import type { GeneratedCard } from '@/interface/GeneratedCard';

const { index, item } = defineProps<{
	index: number;
	item: GeneratedCard;
	clickedIndices: number[];
	selectedIndex: number;
}>();

const emit = defineEmits<{
	(e: 'select', index: number): void;
	(e: 'clickCard', index: number): void;
}>();
</script>

<template>
	<div
		class="card"
		:class="[
			clickedIndices.includes(index) ? 'clicked' : '',
			item.card ? `rarity-${item.card?.rarity}` : '',
			item.card && item.data?.types[0] ? `type-${item.data.types[0].type.name}` : '',
            item.card ? `card-${item.card.id}` : '',
			`index-${index}`,
		]"
		@click="
			() => {
				emit('select', index);
				emit('clickCard', index);
			}
		"
	>
		<div class="card-inner">
			<!-- Header -->
			<CardHeader v-if="!item.loading && item.card" :name="item.card?.name">
				<CardType :type="item.data?.types[0]?.type.name" />
			</CardHeader>

			<!-- Image -->
			<CardImage
				v-if="!item.loading && item.card"
				:id="item.card?.id"
				:name="item.card?.name"
				:image="item.data?.custom_image"
			/>

			<!-- Body -->
			<div class="card-body" v-if="!item.loading && item.data">
				<CardAttack v-for="(attack, index) in item.data.attacks" :key="index" :attack="attack" />
			</div>
		</div>

		<!-- Rarity icon -->
		<CardRarity v-if="!item.loading && item.card" :rarity="item.card?.rarity" />
	</div>
</template>

<style scoped>
@import './Card.less';
</style>
