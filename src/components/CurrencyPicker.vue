<template>
  <div :class="[
    type.length > 0 ? 'picker ' + type : 'picker',
    isError ? ' error' : '',
  ]">
    <Listbox
      v-model="selected.value"
      v-slot="{ open }"
      as="div"
      :disabled="disabled"
      @update:modelValue="$emit('update-currency', selected.value)"
    >
      <div v-if="label.length > 0">
        <ListboxLabel class="block text-14 nls-font-500 text-primary">
          {{ label }}
        </ListboxLabel>
      </div>
      <div class="mt-1 relative picker-container icon">
        <ListboxButton
          class="relative w-full background border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <span class="flex items-center">
            <img
              :src="selected.value?.icon ?? getAssetInfo(selected.value?.balance?.denom)?.coinIcon"
              class="flex-shrink-0 h-6 w-6 rounded-full"
              alt=""
            />
            <span class="block truncate dark-text">
              {{
                selected.value?.shortName ?? getAssetInfo(
                  selected.value?.balance?.denom
                ).shortName
              }}
            </span>
            <span
              v-if="isLoading"
              class="loading"
            >

            </span>
          </span>
          <span class="ml-[2px] mt-[2px] inset-y-0 right-0 flex items-center pointer-events-none" v-if="optionsValue.length > 0">
            <ChevronUpIcon
              v-if="open"
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <ChevronDownIcon
              v-else
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <span
          class="msg error"
          :class="{ hidden: !errorMsg.length }"
        >
          {{ errorMsg }}
        </span>

        <transition
          name="collapse"
          appear
        >
          <ListboxOptions
            class="absolute z-10 mt-1 background shadow-lg max-h-56 w-[125px] rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm top-[46px] scrollbar"
            v-if="optionsValue.length > 0"
          >
            <ListboxOption
              v-for="option in optionsValue"
              :key="option.balance.denom"
              :value="option"
              v-slot="{ active, selected }"
              as="template"
            >
              <li
                class="cursor-default select-none relative py-2 pl-3 pr-9 dropdown-elements my-1"
                :class="{ selected: selected }"
              >
                <div class="flex items-center">
                  <img
                    :src="option.icon ?? getAssetInfo(option.balance.denom).coinIcon"
                    class="flex-shrink-0 h-6 w-6 rounded-full mr-3"
                    alt=""
                  />
                  <span class="block truncate font-normal">
                    {{
                      option.name ?? getAssetInfo(
                        option.balance.denom
                      ).shortName
                    }}
                  </span>
                </div>

                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 flex items-center pr-4"
                  :class="[active ? 'text-white' : 'text-indigo-600']"
                >
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import type { AssetBalance } from "@/stores/wallet/state";
import { type PropType, ref, onMounted, watch, computed } from "vue";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid";
import { useWalletStore } from "@/stores/wallet";
import { NATIVE_ASSET } from "@/config/env";
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from "@headlessui/vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
  options: {
    type: Array as PropType<AssetBalance[]>,
  },
  currencyOption: {
    type: Object as PropType<AssetBalance>,
  },
  disabled: {
    type: Boolean,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  errorMsg: {
    type: String,
    default: "",
  },
});

const wallet = useWalletStore();

function getAssetInfo(denom: string) {
  return wallet.getCurrencyInfo(denom ?? NATIVE_ASSET.denom);
};

const selected = ref({
  value: {} as AssetBalance,
});

const optionsValue = computed(() => {
  return (props.options ?? [])?.filter((item) => {
    if (item.balance.denom == props.currencyOption?.balance.denom) {
      return false;
    }
    return true;
  });

});

onMounted(() => {
  selected.value.value = props.currencyOption as AssetBalance;
});

watch(() => props.currencyOption, () => {
  selected.value.value = props.currencyOption as AssetBalance
});
</script>