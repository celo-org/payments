import { CeloTx, EncodedTransaction, RLPEncodedTx, } from '@celo/connect'
import { account as Account, bytes as Bytes, hash as Hash, RLP } from 'eth-lib'
import { inputCeloTxFormatter } from '@celo/connect/lib/utils/formatter'

function stringNumberToHex(num?: number | string): string {
  const auxNumber = Number(num)
  if (num === '0x' || num === undefined || auxNumber === 0) {
    return '0x'
  }
  return Bytes.fromNumber(auxNumber)
}

export function rlpEncodedTx(tx: CeloTx): RLPEncodedTx {
  if (!tx.gas) {
    throw new Error('"gas" is missing')
  }

  if (
    !(tx.chainId) ||
    !(tx.gasPrice) ||
    !(tx.nonce)
  ) {
    throw new Error(
      'One of the values "chainId", "gasPrice", or "nonce" couldn\'t be fetched: ' +
        JSON.stringify({ chainId: tx.chainId, gasPrice: tx.gasPrice, nonce: tx.nonce })
    )
  }

  if (tx.nonce! < 0 || tx.gas! < 0 || tx.gasPrice! < 0 || tx.chainId! < 0) {
    throw new Error('Gas, gasPrice, nonce or chainId is lower than 0')
  }
  const transaction: CeloTx = inputCeloTxFormatter(tx)
  transaction.to = Bytes.fromNat(tx.to || '0x').toLowerCase()
  transaction.nonce = Number(((tx.nonce as any) !== '0x' ? tx.nonce : 0) || 0)
  transaction.data = Bytes.fromNat(tx.data || '0x').toLowerCase()
  transaction.value = stringNumberToHex(tx.value?.toString())
  transaction.feeCurrency = Bytes.fromNat(tx.feeCurrency || '0x').toLowerCase()
  transaction.gatewayFeeRecipient = Bytes.fromNat(tx.gatewayFeeRecipient || '0x').toLowerCase()
  transaction.gatewayFee = stringNumberToHex(tx.gatewayFee)
  transaction.gasPrice = stringNumberToHex(tx.gasPrice?.toString())
  transaction.gas = stringNumberToHex(tx.gas)
  transaction.chainId = tx.chainId || 1

  // This order should match the order in Geth.
  // https://github.com/celo-org/celo-blockchain/blob/027dba2e4584936cc5a8e8993e4e27d28d5247b8/core/types/transaction.go#L65
  const rlpEncode = RLP.encode([
    stringNumberToHex(transaction.nonce),
    transaction.gasPrice,
    transaction.gas,
    transaction.feeCurrency,
    transaction.gatewayFeeRecipient,
    transaction.gatewayFee,
    transaction.to,
    transaction.value,
    transaction.data,
    stringNumberToHex(transaction.chainId),
    '0x',
    '0x',
  ])

  return { transaction, rlpEncode }
}


export function computeTransactionHash () {

}
