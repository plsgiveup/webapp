import type { Keplr } from "@keplr-wallet/types";
import type { Window as KeplrWindow } from "@keplr-wallet/types/build/window";

import { KeyUtils } from "@nolus/nolusjs";
import { WalletConnectMechanism } from "@/types";
import { WalletManager } from "@/utils";
import { pubkeyToAddress, encodeSecp256k1Pubkey } from "@cosmjs/amino";
import { Buffer } from "buffer";

export class WalletUtils {
  public static async getKeplr(): Promise<Keplr | undefined> {
    const keplrWindow = window as KeplrWindow;

    if (keplrWindow.keplr) {
      return keplrWindow.keplr;
    }

    if (document.readyState === "complete") {
      return keplrWindow.keplr;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === "complete"
        ) {
          resolve(keplrWindow.keplr);
          document.removeEventListener("readystatechange", documentStateChange);
        }
      };

      document.addEventListener("readystatechange", documentStateChange);
    });
  }

  public static async getLeap(): Promise<Keplr | undefined> {
    const leapWindow = window as any;

    if (leapWindow.leap) {
      return leapWindow.leap;
    }

    if (document.readyState === "complete") {
      return leapWindow.leap;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === "complete"
        ) {
          resolve(leapWindow.leap);
          document.removeEventListener("readystatechange", documentStateChange);
        }
      };

      document.addEventListener("readystatechange", documentStateChange);
    });
  }

  public static isAuth(): boolean {
    return (
      KeyUtils.isAddressValid(WalletManager.getWalletAddress()) &&
      WalletManager.getWalletConnectMechanism() !== null
    );
  }

  public static isConnectedViaMnemonic(): boolean {
    return (
      WalletManager.getWalletConnectMechanism() ===
      WalletConnectMechanism.MNEMONIC
    );
  }

  public static isConnectedViaExtension(): boolean {
    return (
      WalletManager.getWalletConnectMechanism() ===
      WalletConnectMechanism.EXTENSION
    );
  }

  public static isConnectedViaLeap(): boolean {
    return (
      WalletManager.getWalletConnectMechanism() ===
      WalletConnectMechanism.LEAP
    );
  }

  public static transformWallet(prefix: string) {
    const hex = WalletManager.getPubKey() ?? "";
    const pubKey = encodeSecp256k1Pubkey(
      Uint8Array.from(Buffer.from(hex, "hex"))
    );
    return pubkeyToAddress(pubKey, prefix);
  }
}