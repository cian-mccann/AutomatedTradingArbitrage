### Terra Blockchain
Terra is an open-source blockchain payment platform for an algorithmic stablecoin, which is a cryptocurrency that automatically tracks the price of currencies or other assets. The Terra blockchain enables users to instantly spend, save, trade, or exchange Terra stablecoins. Overall, Terra aims to bridge the gap between traditional finance and the world of cryptocurrencies, offering a stable and efficient means of transacting value on the blockchain.

### Terra.js

Terra.js is a JavaScript SDK for writing applications that interact with the Terra blockchain from either Node.js, the browser, or React Native environments, providing simple abstractions over core data structures, serialization, key management, and API request generation.

Features:
- Written in TypeScript, with type definitions
- Versatile support for key management solutions
- Works in Node.js, the browser, and React Native
- Exposes the Terra API through LCDClient
- Parses responses into native JavaScript types

### Arbitrage Trading

Arbitrage trading is a strategy employed in financial markets to exploit price disparities of the same asset or related assets across different exchanges or markets. The goal of arbitrageurs is to profit from these price differences by buying the asset at a lower price in one market and simultaneously selling it at a higher price in another, thereby making a risk-free profit. Arbitrage opportunities can arise due to various factors, including market inefficiencies, differences in supply and demand, or delays in information dissemination. Traders often use advanced algorithms and high-frequency trading techniques to execute arbitrage strategies swiftly, as these price disparities can be fleeting.
<br/><br/>
<br/><br/>
# This Repository

The code in this repository uses Terra.js to interact with the Terra blockchain to perform automated arbitrage trading, aiming to profit from the inefficiencies in the price of mETH vs bETH, and cLuna vs Luna. 
### mETHbETHPeg.js For Example 
mETH and bETH are two synthetic versions of ETH, both of which exist on the Terra blockchain rather than on the Ethereum blockchain (where ETH lives). Theoretically, both mETH and bETH should track the price of ETH, but due to market inefficiencies this is not always the case. These inefficiencies present quick and short trade opportunities which may or may not turn out to be profitable depending on how the trade is executed. The image below shows an example of 28 trades/transactions executed by mETHbETHPeg.js through the TerraSwap exchange router between the 4th of February 2022 and the 4th of April 2022, which turned 3.524982 bETH into 5.007678 bETH (Profit of 1.482696 ETH). These transactions can be verified here: [Terra Explorer](https://finder.terra.money/classic/address/terra17g83996ja3ckmrluzqxm675h4kmnukh0gxh00l).
![Transactions](https://github.com/cian-mccann/AutomatedTradingArbitrage/assets/2207018/bfe01ac5-2d30-473f-8c07-559ada72d459)

Note: I have only included source files in this repository; this repository does not include packages and libraries. The Terra blockchain essentially collapsed in May of 2022.
