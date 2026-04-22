<script setup lang="ts">
const billAmount = ref<number>();
const tipPercentage = ref<number>(15);
const numberOfPeople = ref<number>(1);

const tipAmount = computed(() => {
  if (billAmount.value === undefined || tipPercentage.value === undefined) {
    return 0;
  }
  return (billAmount.value * tipPercentage.value) / 100;
});

const totalAmount = computed(() => {
  if (billAmount.value === undefined) {
    return 0;
  }
  return billAmount.value + tipAmount.value;
});

const amountPerPerson = computed(() => {
  if (totalAmount.value === 0 || numberOfPeople.value === undefined || numberOfPeople.value <= 0) {
    return 0;
  }
  return totalAmount.value / numberOfPeople.value;
});

function formatCurrency(value: number) {
  return new Intl.NumberFormat().format(value);
}

const tipAmountFormatted = computed(() => formatCurrency(tipAmount.value));
const totalAmountFormatted = computed(() => formatCurrency(totalAmount.value));
const amountPerPersonFormatted = computed(() => formatCurrency(amountPerPerson.value));
</script>

<template>
  <div style="margin: 0 auto; max-width: 600px">
    <c-card mb-3 title="Bill Details">
      <n-form label-placement="left" label-width="150px" label-align="left">
        <n-form-item label="Bill Amount:">
          <n-input-number v-model:value="billAmount" :min="0" placeholder="Total Bill" />
        </n-form-item>

        <n-form-item label="Tip Percentage:">
          <n-input-number v-model:value="tipPercentage" :min="0" placeholder="Tip %">
            <template #suffix>
              %
            </template>
          </n-input-number>
        </n-form-item>

        <n-form-item label="Number of person:">
          <n-input-number v-model:value="numberOfPeople" :min="1" placeholder="People" />
        </n-form-item>
      </n-form>
    </c-card>

    <c-card mb-3 title="Results">
      <input-copyable label="Tip Amount:" :value="tipAmountFormatted" readonly label-position="left" label-width="150px" mb-1 />
      <input-copyable label="Total Bill:" :value="totalAmountFormatted" readonly label-position="left" label-width="150px" mb-1 />
      <input-copyable label="Amount Per Person:" :value="amountPerPersonFormatted" readonly label-position="left" label-width="150px" mb-1 />
    </c-card>

    <c-card title="Quick Tip %">
      <n-space justify="center">
        <n-button v-for="tip in [10, 15, 18, 20, 25]" :key="tip" size="small" @click="tipPercentage = tip">
          {{ tip }}%
        </n-button>
      </n-space>
    </c-card>
  </div>
</template>
