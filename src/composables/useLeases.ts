import type { LeaseData } from "@/types/LeaseData";
import { ref, onMounted } from "vue";

import { ChainConstants, NolusClient } from "@nolus/nolusjs";
import { Lease, Leaser, type LeaseStatus } from "@nolus/nolusjs/build/contracts";

import { CONTRACTS } from "@/config/contracts";
import { WalletManager, EnvNetworkUtils } from "@/utils";
import { ApptUtils } from "@/utils/AppUtils";

export function useLeases(
  onError: (error: unknown) => void
) {
  const leases = ref<LeaseData[]>([]);
  const leaseLoaded = ref(false);

  const getLeases = async () => {
    try {

      const cosmWasmClient = await NolusClient.getInstance().getCosmWasmClient();
      const leaserClient = new Leaser(
        cosmWasmClient,
        CONTRACTS[EnvNetworkUtils.getStoredNetworkName()].leaser.instance
      );

      const openedLeases: string[] = await leaserClient.getCurrentOpenLeasesByOwner(
        WalletManager.getWalletAddress()
      );

      const promises: Promise<{
        leaseAddress: string,
        leaseStatus: LeaseStatus,
      } | undefined>[] = [];

      for (const leaseAddress of openedLeases) {
        const fn = async () => {
          const leaseClient = new Lease(cosmWasmClient, leaseAddress);
          const url = (await ApptUtils.fetchEndpoints(ChainConstants.CHAIN_KEY)).rpc;

          const [req, leaseInfo] = await Promise.all([
            fetch(`${url}/tx_search?query="wasm.lease_address='${leaseAddress}'"&prove=true`),
            leaseClient.getLeaseStatus()
          ]);

          const data = await req.json();
          const item = data.result?.txs?.[0];
          if (leaseInfo && !leaseInfo.closed && !leaseInfo.liquidated) {
            return {
              leaseAddress: leaseAddress,
              leaseStatus: leaseInfo,
              height: item.height
            }
          }
        }
        promises.push(fn())
      }

      const items = (await Promise.all(promises)).filter((item) => {
        if(!item){
          return false;
        }
        return true;
      })

      leases.value = items as {
        leaseAddress: string,
        leaseStatus: LeaseStatus,
      }[];

    } catch (e) {
      onError(e);
    } finally {
      leaseLoaded.value = true;
    }
  };

  onMounted(async () => {
    await getLeases();
  });

  return { leases, leaseLoaded, getLeases };
}

export function useLease(
  leaseAddress: string,
  onError: (error: unknown) => void
) {

  const getLease = async () => {
    try {

      const cosmWasmClient = await NolusClient.getInstance().getCosmWasmClient();
      const leaseClient = new Lease(cosmWasmClient, leaseAddress);
      const leaseInfo: LeaseStatus = await leaseClient.getLeaseStatus();

      return {
        leaseAddress,
        leaseStatus: leaseInfo
      } as {
        leaseAddress: string,
        leaseStatus: LeaseStatus,
      };

    } catch (e) {
      onError(e);
    }
  };

  onMounted(async () => {
    await getLease();
  });

  return { getLease };
}
