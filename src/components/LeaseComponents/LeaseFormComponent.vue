<template>
  <!-- Input Area -->
  <form
    @submit.prevent="submit"
    class="modal-form"
  >
    <div class="modal-send-receive-input-area">

      <div class="block text-left">
        <div class="block">
          <CurrencyField
            id="amount-investment"
            :currency-options="balances"
            :error-msg="modelValue.downPaymentErrorMsg"
            :is-error="modelValue.downPaymentErrorMsg !== ''"
            :option="modelValue.selectedDownPaymentCurrency"
            :value="modelValue.downPayment"
            :label="$t('message.down-payment-uppercase')"
            name="amountInvestment"
            :tooltip="$t('message.down-payment-tooltip')"
            :balance="formatCurrentBalance(modelValue.selectedDownPaymentCurrency)"
            :set-input-value="setAmount"
            @input="handleDownPaymentChange($event)"
            @update-currency="(event) => (modelValue.selectedDownPaymentCurrency = event)"
          />
        </div>

        <div class="block mt-[25px]">
          <Picker
            class="scrollbar"
            :default-option="coinList[selectedIndex]"
            :options="coinList"
            :label="$t('message.asset-to-lease')"
            @update-selected="updateSelected"
          />
        </div>
      </div>

      <div class="flex mt-6 justify-between text-primary text-[14px] garet-medium">
        <p class="pb-0">
          {{ $t('message.margin') }}
        </p>
        <p>
          ~{{ calculateMarginAmount }}
        </p>
      </div>

      <RangeComponent
        class="py-4 my-2"
        :disabled="false"
        @on-drag="onDrag"
      >
      </RangeComponent>

      <!-- <div
        v-if="liqudStakeShow"
        class="flex items-center w-full checkbox-container"
      >
        <input
          id="liquid-stake"
          v-model="liqudStake"
          aria-describedby="liquid-stake"
          name="liquid-stake"
          type="checkbox"
        />
        <label
          class="dark-text flex select-none"
          for="liquid-stake"
        >
          {{ $t("message.liquid-stake") }}
          <TooltipComponent content="content" />
        </label>
      </div> -->

      <div class="flex justify-end">
        <div class="grow-3 text-right nls-font-500 text-14 dark-text">
          <p class="mb-2 mt-[14px] mr-5">
            {{ $t("message.borrowed") }}
          </p>
          <p class="mb-2 mt-[14px] mr-5">
            {{ $t("message.price-per") }} {{ selectedAssetDenom }}
          </p>
          <p class="mb-2 mt-[14px] mr-5">
            {{ $t("message.interest") }}
          </p>
          <p class="mb-2 mt-[14px] mr-5">
            {{ $t("message.liquidation-price") }}
          </p>

        </div>
        <div class="text-right nls-font-700 text-14">
          <p class="mb-2 mt-[14px] flex justify-end align-center dark-text">
            ${{ borrowed }}
            <TooltipComponent :content="$t('message.borrowed-tooltip')" />
          </p>
          <p class="mb-2 mt-[14px] flex justify-end align-center dark-text">
            ~{{ selectedAssetPrice }}
          </p>
          <p class="mb-2 mt-[14px] flex justify-end align-center dark-text">
            {{ annualInterestRate ?? 0 }}%
            <TooltipComponent :content="$t('message.interest-tooltip')" />
          </p>
          <p class="mb-2 mt-[14px] flex justify-end align-center dark-text">
            {{ calculateLique }}
            <span class="text-[#8396B1]">
              &nbsp;|&nbsp; {{ percentLique }}
            </span>
            <TooltipComponent :content="$t('message.liquidation-price-tooltip')" />
          </p>
        </div>
      </div>
    </div>
    <!-- Actions -->
    <div class="modal-send-receive-actions flex flex-col">
      <button class="btn btn-primary btn-large-primary">
        {{ $t("message.open-position") }}
      </button>
      <div class="flex justify-between w-full text-light-blue text-[14px] my-2">
        <p>{{ $t("message.estimate-time") }}:</p>
        <p>~{{ NATIVE_NETWORK.leaseOpenEstimation }} {{ $t("message.min") }}</p>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import CurrencyField from "@/components/CurrencyField.vue";
import TooltipComponent from "@/components/TooltipComponent.vue";
import Picker, { type PickerOption } from "../Picker.vue";
import RangeComponent from "../RangeComponent.vue";

import type { LeaseComponentProps } from "@/types/component/LeaseComponentProps";
import type { AssetBalance } from "@/stores/wallet/state";

import { onMounted, ref, type PropType } from "vue";
import { CurrencyUtils } from "@nolus/nolusjs";
import { computed, watch } from "vue";
import { useWalletStore } from "@/stores/wallet";
import { NATIVE_NETWORK, calculateLiquidation, PERMILLE, IGNORE_LEASE_ASSETS } from "@/config/env";
import { coin } from "@cosmjs/amino";
import { Dec } from "@keplr-wallet/unit";
import { useOracleStore } from "@/stores/oracle";
import { AssetUtils } from "@/utils";
import { useApplicationStore } from "@/stores/application";

const wallet = useWalletStore();
const app = useApplicationStore();

const liqudStake = ref(false);
const liqudStakeShow = ref(false);
const selectedIndex = ref(0);
const oracle = useOracleStore();

const liquiStakeTokens = {
  OSMO: {
    key: 'stOsmo'
  },
  ATOM: {
    key: 'stAtom'
  }
}

onMounted(() => {
  if (props.modelValue.dialogSelectedCurrency) {
    const index = coinList.findIndex((item) => {
      return item.value == props.modelValue.dialogSelectedCurrency
    });

    if (index > -1) {
      selectedIndex.value = index;
      props.modelValue.selectedCurrency = {
        balance: coin(0, coinList[index].value)
      }
    }
  }

  if (liquiStakeTokens[coinList[selectedIndex.value].ticker as keyof typeof liquiStakeTokens]) {
    liqudStakeShow.value = true;
  }
})

const props = defineProps({
  modelValue: {
    type: Object as PropType<LeaseComponentProps>,
    required: true,
  },
});


const borrowValue = ref(props.modelValue.leaseApply?.borrow);
const tottalValue = ref(props.modelValue.leaseApply?.total);

watch(() => props.modelValue.leaseApply, (value) => {
  if (value) {
    borrowValue.value = value.borrow;
    tottalValue.value = value.total;
  }
});

const handleDownPaymentChange = (value: string) => {
  props.modelValue.downPayment = value;
};

const balances = computed(() => {
  const balances = wallet.balances;
  return balances.filter((item) => {
    const currency = wallet.currencies[item.balance.denom];
    if (IGNORE_LEASE_ASSETS.includes(currency.ticker)) {
      return false;
    }
    return app.lpn?.ticker == currency.ticker || app.lease.includes(currency.ticker);
  });
});

const coinList = props.modelValue.currentBalance.filter((item) => {
  const currency = wallet.currencies[item.balance.denom];
  if (IGNORE_LEASE_ASSETS.includes(currency.ticker)) {
    return false;
  }
  return app.lease.includes(currency.ticker);
}).map((item) => {
  const asset = wallet.getCurrencyInfo(item.balance.denom);
  return {
    ticker: asset.ticker,
    label: asset.shortName as string,
    value: asset.coinMinimalDenom,
    icon: asset.coinIcon as string
  }
});

const annualInterestRate = computed(() => {
  return (props.modelValue?.leaseApply?.annual_interest_rate ?? 0) + (props.modelValue?.leaseApply?.annual_interest_rate_margin ?? 0);
});

const calculateMarginAmount = computed(() => {
  const total = props.modelValue.leaseApply?.total;
  if (total) {
    const asset = wallet.getCurrencyByTicker(total.ticker);
    const ibcDenom = wallet.getIbcDenomBySymbol(asset.symbol);
    const info = wallet.getCurrencyInfo(ibcDenom as string);

    const token = CurrencyUtils.convertMinimalDenomToDenom(
      total.amount,
      info.coinMinimalDenom as string,
      info.shortName as string,
      info.coinDecimals
    );

    return token.toString();
  }

  const currency = props.modelValue.selectedCurrency;
  const info = wallet.getCurrencyInfo(currency.balance.denom);

  const token = CurrencyUtils.convertMinimalDenomToDenom(
    '0',
    info.coinMinimalDenom as string,
    info.shortName as string,
    info.coinDecimals
  );

  return token.toString();
});


const setAmount = (p: number) => {
  const asset = wallet.getCurrencyInfo(
    props.modelValue.selectedDownPaymentCurrency.balance.denom
  );
  const percent = new Dec(p).quo(new Dec(100));
  const amount = CurrencyUtils.convertMinimalDenomToDenom(props.modelValue.selectedDownPaymentCurrency.balance.amount, asset.coinMinimalDenom, asset.coinDenom, asset.coinDecimals).toDec();
  const value = amount.mul(percent);
  props.modelValue.downPayment = value.toString(asset.coinDecimals);

};

const formatCurrentBalance = (selectedCurrency: AssetBalance) => {
  if (selectedCurrency?.balance?.denom && selectedCurrency?.balance?.amount) {
    const asset = wallet.getCurrencyInfo(
      props.modelValue.selectedDownPaymentCurrency.balance.denom
    );
    return CurrencyUtils.convertMinimalDenomToDenom(
      selectedCurrency.balance.amount.toString(),
      selectedCurrency.balance.denom,
      asset.shortName,
      asset.coinDecimals
    ).toString();
  }
};

const updateSelected = (event: PickerOption) => {

  props.modelValue.selectedCurrency = {
    balance: coin(0, event.value)
  };

  const asset = wallet.getCurrencyInfo(event.value);

  if (liquiStakeTokens[asset.coinAbbreviation as keyof typeof liquiStakeTokens]) {
    liqudStakeShow.value = true;
  } else {
    liqudStakeShow.value = false;
    liqudStake.value = false;
  }

}

const calculateLique = computed(() => {
  const d = getLquidation();
  return `$${d.toString(2)}`;
});

const getLquidation = () => {
  const lease = props.modelValue.leaseApply;
  if (lease) {

    const unitAssetInfo = wallet.getCurrencyByTicker(lease.borrow.ticker);
    const stableAssetInfo = wallet.getCurrencyByTicker(lease.total.ticker);

    const unitAsset = new Dec(getBorrowedAmount(), Number(unitAssetInfo.decimal_digits));

    const stableAsset = new Dec(getTotalAmount(), Number(stableAssetInfo.decimal_digits));
    return calculateLiquidation(unitAsset, stableAsset);
  }

  return new Dec(0);
}

const percentLique = computed(() => {

  const asset = wallet.getCurrencyInfo(props.modelValue.selectedCurrency.balance.denom);
  const currecy = wallet.getCurrencyByTicker(asset.ticker);

  const price = new Dec(oracle.prices[currecy.symbol]?.amount ?? '0', asset.coinDecimals);
  const lprice = getLquidation();

  if (lprice.isZero() || price.isZero()) {
    return `0%`
  }

  const p = price.sub(lprice).quo(price);

  return `-${p.mul(new Dec(100)).toString(0)}%`


});

const onDrag = (event: number) => {
  const pos = new Dec(event / 100);
  props.modelValue.ltd = Number(pos.mul(new Dec(PERMILLE)).truncate().toString())
}

const borrowed = computed(() => {
  const borrow = props.modelValue.leaseApply?.borrow;

  if (borrow) {
    const info = AssetUtils.getAssetInfo(borrow.ticker);

    const token = CurrencyUtils.convertMinimalDenomToDenom(
      borrow.amount,
      info.coinMinimalDenom as string,
      info.coinDenom as string,
      info.coinDecimals
    );

    return token.hideDenom(true).toString();
  }

  return "0";
});

const getBorrowedAmount = () => {
  const borrow = props.modelValue.leaseApply?.borrow;

  if (borrow) {
    const amount = new Dec(borrow.amount).truncate();
    return amount;
  }

  return new Dec(0).truncate();
}

const getTotalAmount = () => {
  const total = props.modelValue.leaseApply?.total;
  return new Dec(total?.amount ?? 0).truncate();
}

const selectedAssetDenom = computed(() => {
  const asset = wallet.getCurrencyInfo(props.modelValue.selectedCurrency.balance.denom);
  return asset.shortName;
});

const selectedAssetPrice = computed(() => {
  const asset = wallet.getCurrencyInfo(props.modelValue.selectedCurrency.balance.denom);
  const currecy = wallet.getCurrencyByTicker(asset.ticker);

  const price = oracle.prices[currecy.symbol];

  return CurrencyUtils.formatPrice(price?.amount ?? 0);
});

const submit = () => {
  const lease = props.modelValue.leaseApply;

  if (lease) {
    props.modelValue.onNextClick(selectedAssetPrice.value.toDec().toString());
  }

}
</script>