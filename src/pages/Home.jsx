import React, { useState } from 'react';
import { Button, Card } from 'flowbite-react'
import { CustomTable } from '../components';
import { scanEndpoint, isBuyTx } from '../utils/etherscan';
import axios from 'axios'
import Web3 from 'web3';
import { ethers, utils } from 'ethers';
import BigNumber from "bignumber.js";

function Home() {
    const [transferedToken, setTransferedToken] = useState([])
    const [holder, setHolder] = useState('')
    const [lpAddress, setLPAddress] = useState('')
    const [totalAvg, setTotalAvg] = useState(0)
    const [totalBuy, setTotalBuy] = useState(0)
    const [totalSell, setTotalSell] = useState(0)

    async function getSwapEvents(scaner, LPAddress, topics, fromBlock, toBlock) {
        var config = {
            method: 'get',
            url: scanEndpoint(scaner) + `?module=logs&action=getLogs&address=${LPAddress}&fromBlock=${fromBlock}&toBlock=${toBlock}&page=1&offset=1000&apikey=${process.env.REACT_APP_ARBISCAN_APIKEY}&topic0=${topics[0]}&topic0_2_opr=and&topic2=${topics[2]}`,
            headers: {}
        };
        axios(config)
            .then(function (response) {
                const data = JSON.stringify(response.data);
                const result = JSON.parse(data).result
                let tokenTransferTmp = []
                result.forEach((elm) => {
                    let d = utils.defaultAbiCoder.decode(['int256', 'int256', 'uint160', 'uint128', 'int24'], elm.data)

                    let avg = Math.abs(BigNumber(d[1] * 10 ** -6).dividedBy(BigNumber(d[0] * 10 ** -18)))
                    let tokenAvg = {
                        in: d[0], // token
                        out: d[1], // stablecoin
                        avg: avg,
                        isBuyTx: isBuyTx(elm),
                        transactionHash: elm.transactionHash,
                        blockNumber: parseInt(elm.blockNumber)
                    }
                    tokenTransferTmp.push(tokenAvg)
                })
                setTransferedToken(tokenTransferTmp)
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    const getTotalAvg = async () => {
        let totalAvgTmp = 0;
        let totalBuyTmp = 0;
        let totalSellTmp = 0;
        transferedToken.forEach((elm) => {
            console.log(elm)
            totalAvgTmp += elm.avg
            if (elm.in > 0) {
                totalBuyTmp += Math.abs(elm.out)
            } else {
                totalSellTmp += Math.abs(elm.out)
            }
        })
        setTotalAvg(totalAvgTmp / transferedToken.length)
        setTotalBuy(totalBuyTmp*10**-6)
        setTotalSell(totalSellTmp*10**-6)
    }

    const handleClick = async (e) => {
        await getSwapEvents('arbiscan', lpAddress,
            ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67',
                '0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45',
                utils.hexZeroPad(holder, 32)],
            '37825904',
            '71629643'
        )
        await getTotalAvg()
    }

    const handleLP = (e) => {
        setLPAddress(e.target.value)
    }

    const handleHolder = (e) => {
        setHolder(e.target.value)
    }

    return (
        <div className="App">
            <div>
                <div>
                    <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900">Holder</label>
                    <input type="text" id="small-input"
                        value={holder}
                        onChange={handleHolder}
                        class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label for="small-input" class="block mb-2 text-sm font-medium text-gray-900 ">LP contract</label>
                    <input type="text" id="small-input"
                        value={lpAddress}
                        onChange={handleLP}
                        class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
            </div>
            <Button onClick={handleClick}>test</Button>
            <div class="flex justify-around my-2">
                <Card>
                    <div>
                        <div class="font-bold text-slate-300">Average</div>
                        <div class="text-lg text-white">{totalAvg}</div>
                    </div>
                </Card>
                <Card>
                    <div>
                        <div class="font-bold text-slate-300">Total spent ($USDC)</div>
                        <div class="text-lg text-white">{totalBuy}</div>
                    </div>
                </Card>
                <Card>
                    <div>
                        <div class="font-bold text-slate-300">Total earn ($USDC)</div>
                        <div class="text-lg text-white">{totalSell}</div>
                    </div>
                </Card>
            </div>
            <CustomTable transferedToken={transferedToken}></CustomTable>
        </div>
    );
}

export default Home;
