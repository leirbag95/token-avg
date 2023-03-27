import {ethers} from 'ethers';

export const scanEndpoint = (network) => {
    return `https://api.${network}.io/api`
}

export const isBuyTx = (tx)  => {
    const utils = ethers.utils
    let d = utils.defaultAbiCoder.decode(['int256', 'int256', 'uint160', 'uint128','int24'], tx.data)
    return d[0] > 0   
}