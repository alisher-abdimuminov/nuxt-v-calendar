<template>
    <ClientOnly>
        <VCalendar :initial-page="{ month: 4, year: 2019 }" :attributes="attrs" />
    </ClientOnly>
</template>
<script setup>
import { ref } from 'vue';

const selectedColor = ref('red');
const attrs = ref([
    {
        highlight: true,
        dates: { start: new Date(2019, 3, 15), end: new Date(2019, 3, 25) },
    },
    {
        dot: "red",
        dates: new Date(2019, 3, 3)
    },
    {
        bar: "bar",
        dates: new Date(2019, 3, 9)
    }
]);
</script>
