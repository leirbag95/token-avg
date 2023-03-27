import React from 'react'
import { Table } from 'flowbite-react'
import BigNumber from "bignumber.js";

function CustomTable(props) {
    console.log(props)
    return (

        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Transaction
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Block number
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Type
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Token 1 ()
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Token 2 ()
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Price
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props?.transferedToken?.map((elm) => (
                            <tr class="border-b dark:bg-gray-800 dark:border-gray-700">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {elm.transactionHash.slice(-10)}
                                </th>
                                <td class="px-6 py-4">
                                    {elm.blockNumber}
                                </td>
                                <td class="px-6 py-4">
                                    {
                                        elm.isBuyTx ? 
                                        <span class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Buy</span> : 
                                        <span class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Sell</span>
                                    }
                                </td>
                                <td class="px-6 py-4">
                                    {Math.abs(BigNumber(elm.in * 10 ** -18)).toString()}
                                </td>
                                <td class="px-6 py-4">
                                    {Math.abs(BigNumber(elm.out * 10 ** -6)).toString()}
                                </td>
                                <td class="px-6 py-4">
                                    {elm.avg}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    )
}

export default CustomTable