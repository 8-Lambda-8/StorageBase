<template>
  {{ split[0] }}
  <sub v-if="split.length > 1">
    {{ split[1].split("]")[0] }}
  </sub>
</template>

<script setup lang="ts">
import { parameterLookup } from "../staticLists";

const props = defineProps<{
  paramId: string;
}>();

const paramId = props.paramId ?? "";
const split = parameterLookup[paramId].symbol.split("[");
</script>
