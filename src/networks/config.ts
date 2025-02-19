import type { NetworkData } from "@/types/Network";

import { NATIVE_NETWORK } from "@/config/env";
import { NETWORK as OSMO_NETWORK } from './osmo/network';
import { embedChainInfo as osmoChainInfo } from './osmo/contants';

import { NETWORK as ATOM_NETWORK } from './cosmos/network';
import { embedChainInfo as atomChainInfo } from './cosmos/contants';

import { NETWORK as AXELAR_NETWORK } from './axelar/network';
import { embedChainInfo as alexarChainInfo } from './axelar/contants';

import { NETWORK as STRIDE_NETWORK } from './stride/network';
import { embedChainInfo as strideChainInfo } from './stride/contants';

import { NETWORK as JUNO_NETWORK } from './juno/network';
import { embedChainInfo as junoChainInfo } from './juno/contants';

import { NETWORK as EVMOS_NETWORK } from './evmos/network';
import { embedChainInfo as evmosChainInfo } from './evmos/contants';

import { useApplicationStore } from "@/stores/application";
import type { ExternalCurrenciesType } from "@/types/CurreciesType";

export const SUPPORTED_NETWORKS_DATA: {
    [key: string]: {
        prefix: string,
        value: string,
        label: string,
        native: boolean,
        estimation: number,
        key: string,
        symbol: string,
        forward?: boolean
    }
} = {
    NOLUS: NATIVE_NETWORK,
    OSMOSIS: {
        prefix: "osmo",
        value: "osmo",
        label: "Osmosis",
        native: false,
        estimation: 20,
        key: "OSMOSIS",
        symbol: "OSMO"
    },
    COSMOS_HUB: {
        prefix: "cosmos",
        value: "cosmos",
        label: "Cosmos Hub",
        native: false,
        estimation: 20,
        key: "COSMOS_HUB",
        symbol: "ATOM",
        forward: true
    },
    AXELAR: {
        prefix: "axelar",
        value: "axelar",
        label: "Axelar",
        native: false,
        estimation: 20,
        key: "AXELAR",
        symbol: "AXL",
        forward: true
    },
    STRIDE: {
        prefix: "stride",
        value: "stride",
        label: "Stride",
        native: false,
        estimation: 20,
        key: "STRIDE",
        symbol: "STRD",
        forward: true
    },
    JUNO: {
        prefix: "juno",
        value: "juno",
        label: "Juno",
        native: false,
        estimation: 20,
        key: "JUNO",
        symbol: "JUNO",
        forward: true
    },
    EVMOS: {
        prefix: "evmos",
        value: "evmos",
        label: "Evmos",
        native: false,
        estimation: 20,
        key: "EVMOS",
        symbol: "EVMOS",
        forward: true
    }
}

export const NETWORKS_DATA: {
    [key: string]: {
        list: {
            prefix: string,
            value: string,
            label: string,
            native: boolean,
            estimation: number,
            key: string,
            symbol: string,
        }[],
        supportedNetworks: {
            [key: string]: NetworkData
        }
    }
} = {
    localnet: {
        list: [
            SUPPORTED_NETWORKS_DATA.NOLUS,
            SUPPORTED_NETWORKS_DATA.OSMOSIS,
            SUPPORTED_NETWORKS_DATA.COSMOS_HUB,
            SUPPORTED_NETWORKS_DATA.AXELAR,
        ],
        supportedNetworks: {
            OSMOSIS: {
                ...OSMO_NETWORK,
                explorer: 'https://testnet.mintscan.io/osmosis-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[OSMO_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: osmoChainInfo
            },
            COSMOS_HUB: {
                ...ATOM_NETWORK,
                explorer: 'https://testnet.mintscan.io/cosmoshub-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[ATOM_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: atomChainInfo,
            },
            AXELAR: {
                ...AXELAR_NETWORK,
                explorer: 'https://testnet.mintscan.io/axelar-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[AXELAR_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: alexarChainInfo,
            }
        }
    },
    devnet: {
        list: [
            SUPPORTED_NETWORKS_DATA.NOLUS,
            SUPPORTED_NETWORKS_DATA.OSMOSIS,
            SUPPORTED_NETWORKS_DATA.COSMOS_HUB,
            SUPPORTED_NETWORKS_DATA.AXELAR,
        ],
        supportedNetworks: {
            OSMOSIS: {
                ...OSMO_NETWORK,
                explorer: 'https://testnet.mintscan.io/osmosis-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[OSMO_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: osmoChainInfo
            },
            COSMOS_HUB: {
                ...ATOM_NETWORK,
                explorer: 'https://testnet.mintscan.io/cosmoshub-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[ATOM_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: atomChainInfo,
            },
            AXELAR: {
                ...AXELAR_NETWORK,
                explorer: 'https://testnet.mintscan.io/axelar-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[AXELAR_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: alexarChainInfo,
            }
        }
    },
    testnet: {
        list: [
            SUPPORTED_NETWORKS_DATA.NOLUS,
            SUPPORTED_NETWORKS_DATA.OSMOSIS,
            SUPPORTED_NETWORKS_DATA.COSMOS_HUB,
            SUPPORTED_NETWORKS_DATA.AXELAR,
            SUPPORTED_NETWORKS_DATA.JUNO
        ],
        supportedNetworks: {
            OSMOSIS: {
                ...OSMO_NETWORK,
                explorer: 'https://testnet.mintscan.io/osmosis-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[OSMO_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: osmoChainInfo
            },
            COSMOS_HUB: {
                ...ATOM_NETWORK,
                explorer: 'https://testnet.mintscan.io/cosmoshub-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[ATOM_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: atomChainInfo,
            },
            AXELAR: {
                ...AXELAR_NETWORK,
                explorer: 'https://testnet.mintscan.io/axelar-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[AXELAR_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: alexarChainInfo,
            },
            JUNO: {
                ...JUNO_NETWORK,
                explorer: 'https://testnet.mintscan.io/juno-testnet/txs',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[JUNO_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: junoChainInfo,
            }
        }
    },
    mainnet: {
        list: [
            SUPPORTED_NETWORKS_DATA.NOLUS,
            SUPPORTED_NETWORKS_DATA.OSMOSIS,
            SUPPORTED_NETWORKS_DATA.COSMOS_HUB,
            SUPPORTED_NETWORKS_DATA.AXELAR,
            SUPPORTED_NETWORKS_DATA.STRIDE,
            SUPPORTED_NETWORKS_DATA.JUNO,
        ],
        supportedNetworks: {
            OSMOSIS: {
                ...OSMO_NETWORK,
                explorer: 'https://mintscan.io/osmosis/transactions',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[OSMO_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: osmoChainInfo
            },
            COSMOS_HUB: {
                ...ATOM_NETWORK,
                explorer: 'https://mintscan.io/cosmoshub/transactions',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[ATOM_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: atomChainInfo,
            },
            AXELAR: {
                ...AXELAR_NETWORK,
                explorer: 'https://mintscan.io/axelar/transactions',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[AXELAR_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: alexarChainInfo,
            },
            STRIDE: {
                ...STRIDE_NETWORK,
                explorer: 'https://mintscan.io/stride/transactions',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[STRIDE_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: strideChainInfo,
            },
            JUNO: {
                ...JUNO_NETWORK,
                explorer: 'https://mintscan.io/juno/transactions',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[JUNO_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: junoChainInfo,
            },
            EVMOS: {
                ...EVMOS_NETWORK,
                explorer: 'https://mintscan.io/evmos/transactions',
                currencies: () => {
                    const app = useApplicationStore();
                    return app?.networks?.[EVMOS_NETWORK.key] as ExternalCurrenciesType;
                },
                embedChainInfo: evmosChainInfo,
            }
        }
    },
};