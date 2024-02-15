import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { ethers } from "ethers";
import Modal from "../Modal/Modal";
import { get1InchSwapUrl } from "config/links";
import { getLowestFeeTokenForBuyGlp, InfoTokens, Token } from "domain/tokens";
import { getNativeToken } from "config/tokens";
import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";

const { AddressZero } = ethers.constants;

type Props = {
  swapToken: Token;
  isVisible: boolean;
  setIsVisible: () => void;
  chainId: number;
  ulpAmount: BigNumber;
  usdgSupply: BigNumber;
  totalTokenWeights: BigNumber;
  ulpPrice: BigNumber;
  swapUsdMin: BigNumber;
  infoTokens: InfoTokens;
};

export default function SwapErrorModal({
  swapToken,
  isVisible,
  setIsVisible,
  chainId,
  ulpAmount,
  usdgSupply,
  totalTokenWeights,
  ulpPrice,
  infoTokens,
  swapUsdMin,
}: Props) {
  const [lowestFeeToken, setLowestFeeToken] = useState<
    { token: Token; fees: number; amountLeftToDeposit: BigNumber } | undefined
  >();
  useEffect(() => {
    const lowestFeeTokenInfo = getLowestFeeTokenForBuyGlp(
      chainId,
      ulpAmount,
      ulpPrice,
      usdgSupply,
      totalTokenWeights,
      infoTokens,
      swapToken.address,
      swapUsdMin
    );
    setLowestFeeToken(lowestFeeTokenInfo);
  }, [chainId, ulpAmount, ulpPrice, usdgSupply, totalTokenWeights, infoTokens, swapUsdMin, swapToken.address]);

  const label = t`${swapToken?.symbol} Capacity Reached`;

  if (lowestFeeToken && swapUsdMin && swapUsdMin.gt(lowestFeeToken.amountLeftToDeposit)) {
    return (
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={label} className="Error-modal">
        <p>
          <Trans>
            There is not enough liquidity in a single token for your size. Please check the Save on Fees section and
            consider splitting your order into several different ones
          </Trans>
        </p>
        <p>
          <ExternalLink href={get1InchSwapUrl(chainId)}>
            <Trans>Swap on 1inch</Trans>
          </ExternalLink>
        </p>
      </Modal>
    );
  }

  const nativeToken = getNativeToken(chainId);
  const inputCurrency = swapToken.address === AddressZero ? nativeToken.symbol : swapToken.address;
  const outputCurrency =
    lowestFeeToken?.token.address === AddressZero ? nativeToken.symbol : lowestFeeToken?.token.address;
  const oneInchUrl = get1InchSwapUrl(chainId, inputCurrency, outputCurrency);

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={label} className="Error-modal">
      <Trans>
        <p>The pool's capacity has been reached for {swapToken.symbol}. Please use another token to buy ULP.</p>
        <p>Check the "Save on Fees" section for tokens with the lowest fees.</p>
      </Trans>
      <p>
        <ExternalLink href={oneInchUrl}>
          <Trans>
            Swap {swapToken.symbol} to {lowestFeeToken?.token.symbol} on 1inch
          </Trans>
        </ExternalLink>
      </p>
    </Modal>
  );
}
