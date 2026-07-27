"use client";

import { useEffect, useMemo, useRef } from "react";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

import { useCryptoPrice } from "~/hooks";

const SYMBOLS = ["ETH"];
const RANGES = ["1H", "1D", "1W", "1M", "1Y", "ALL"];

export default function EthereumChart() {
    const { prices } = useCryptoPrice(SYMBOLS);

    return <></>;
}
