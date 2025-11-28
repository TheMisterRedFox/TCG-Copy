<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CardFooter from '@/components/card/CardFooter.vue';
import CardHeader from '@/components/card/CardHeader.vue';
import CardImage from '@/components/card/CardImage.vue';
import CardRarity from '@/components/card/CardRarity.vue';
import CardRetreat from '@/components/card/CardRetreat.vue';
import CardType from '@/components/card/CardType.vue';
import CardWeakness from '@/components/card/CardWeakness.vue';
import type { GeneratedCard } from '@/interfaces/GeneratedCard';
import { useTCGdexStore } from '@/stores/tcgdexStore';
import CardAttackV2 from './CardAttackV2.vue';
import type { CardV2 } from '@/interfaces/GeneralTypes';

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

const tcgStore = useTCGdexStore();
const baseCard = ref<CardV2 | null>(null);

onMounted(async () => {
	if (item.card?.name) {
		baseCard.value = await tcgStore.getBaseSetCard(item.card.name);
	}
});
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
				<CardType :hp="item.data?.stats[0]?.base_stat" :type="item.data?.types[0]?.type.name" />
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
				<!-- <CardAttack v-for="(attack, index) in item.data.attacks" :key="index" :attack="attack" /> -->
				<CardAttackV2 v-for="(attack, index) in baseCard?.attacks" :key="index" :attack="attack" />
			</div>
			
			<CardFooter v-if="!item.loading && item.card">
				<CardWeakness :type="item.data?.types[0]?.type.name" />
				<CardRetreat :type="item.data?.types[0]?.type.name" />
			</CardFooter>
		</div>

		<!-- Rarity icon -->
		<CardRarity v-if="!item.loading && item.card" :rarity="item.card?.rarity" />
	</div>
</template>

<style scoped>
@import './Card.less';

.card-body {
	display: flex;
	flex-direction: column;
	gap: 8px;
	flex: 1;
}
</style>
