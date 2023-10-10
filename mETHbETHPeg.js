const {LCDClient, MnemonicKey, MsgSwap, MsgExecuteContract} = require('@terra-money/terra.js');

const getAccountBalance = async (contractAdrr) => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);

    const balanceObject = await terra.wasm.contractQuery(contractAdrr, { balance: { address: mk.accAddress } });
    const balance = Object.values(balanceObject)[0];
    return balance;
}

const getPoolPriceTerraSwapWithTokenAsOffer = async (pool_contract, offerAsset) => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);
 
    const sim_msg = {
        "simulation": {
            "offer_asset": {
                "info" : {
                    "token": {
                        "contract_addr": offerAsset
                    }
                },
                "amount": "1000000"
            }
        }
    }

    const result = await terra.wasm.contractQuery(pool_contract, sim_msg);
    return result['return_amount']/1000000; 
}

function differenceNum(a, b) {
    return (a > b) ? (a - b) : (b - a);
}

function differencePercentage(a, b) {
    const difference = differenceNum(a,b);
    return (difference / a) * 100;
}

const swapAll_bETH_to_mETH = async (bETHAccountBalance) => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);

    const { assets } = await terra.wasm.contractQuery("terra1c5swgtnuunpf75klq5uztynurazuwqf0mmmcyy", { pool: {} });
    const beliefPrice = (assets[0].amount / assets[1].amount).toFixed(18);

    const msg = {
        "execute_swap_operations":{
            "max_spread": "0.01",
            "belief_price": beliefPrice,
           "operations":[
              {
                 "terra_swap":{
                    "offer_asset_info":{
                       "token":{
                          "contract_addr":"terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun"
                       }
                    },
                    "ask_asset_info":{
                       "token":{
                          "contract_addr":"terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx"
                       }
                    }
                 }
              }
           ]
        }
     };

    const terraSwap = new MsgExecuteContract(
        mk.accAddress,
        "terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun",
        {
            "send": {
                "contract": "terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex",
                "amount": bETHAccountBalance,
                "msg": "ewogICAgICAgICJleGVjdXRlExZHpoenVreWV6djBldHoyMnVkOTQwejd...hZHl2N3hnY2prYWh1dW4iCiAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgIF0KICAgICAgICB9CiAgICAgfQ=="           
            }
        }
    );

    var result;
    try {
        const tx = await wallet.createAndSignTx({ msgs: [terraSwap], denoms: "uusd", gasPrices: { uusd: 0.15 }});
        result = await terra.tx.broadcast(tx);
        if (result.code != 0) {
            console.log(result);
            console.log("Transaction did not execute. Error is above.");
            return "Transaction did not execute.";
        } else {
            console.log(result.raw_log);
            const txHash = await terra.tx.hash(tx);
            return txHash;
        }
    } catch (error) {
        console.log(error);
        console.log("Transaction did not execute. Error is above.");
        return "Transaction did not execute.";
    }
}


const swapAll_mETH_to_bETH = async (mETHAccountBalance) => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);

    const { assets } = await terra.wasm.contractQuery("terra1c5swgtnuunpf75klq5uztynurazuwqf0mmmcyy", { pool: {} });
    const beliefPrice = (assets[0].amount / assets[1].amount).toFixed(18);

    const msg = {
        "execute_swap_operations":{
            "max_spread": "0.01",
            "belief_price": beliefPrice,
           "operations":[
              {
                 "terra_swap":{
                    "offer_asset_info":{
                       "token":{
                          "contract_addr":"terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx"
                       }
                    },
                    "ask_asset_info":{
                       "token":{
                          "contract_addr":"terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun"
                       }
                    }
                 }
              }
           ]
        }
     };

    const terraSwap = new MsgExecuteContract(
        mk.accAddress,
        "terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx",
        {
            "send": {
                "contract": "terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex",
                "amount": mETHAccountBalance,
                "msg": "ewogICAgICAgICJleGVjdXRlExZHpoenVreWV6djBldHoyMnVkOTQwejd...hZHl2N3hnY2prYWh1dW4iCiAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgICAgIF0KICAgICAgICB9CiAgICAgfQ===="           
            }
        }
    );

    var result;
    try {
        const tx = await wallet.createAndSignTx({ msgs: [terraSwap], denoms: "uusd", gasPrices: { uusd: 0.15 }});
        result = await terra.tx.broadcast(tx);
        if (result.code != 0) {
            console.log(result);
            console.log("Transaction did not execute. Error is above.");
            return "Transaction did not execute.";
        } else {
            console.log(result.raw_log);
            const txHash = await terra.tx.hash(tx);
            return txHash;
        }
    } catch (error) {
        console.log(error);
        console.log("Transaction did not execute. Error is above.");
        return "Transaction did not execute.";
    }
}


const main = async () => {
    // Chart: https://coinhall.org/charts/terra/terra1c5swgtnuunpf75klq5uztynurazuwqf0mmmcyy
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    
    const rangeHigh= 1.08;
    const rangeLow=1.0400;
    
    // Always looking to buy mETH at rangeLow and sell it back to bETH at rangeHigh.
    while (true) {
        try {
            const { assets } = await terra.wasm.contractQuery("terra1c5swgtnuunpf75klq5uztynurazuwqf0mmmcyy", { pool: {} });
            const mETHbETHTerraSwap = (assets[1].amount / assets[0].amount).toFixed(18);

            if (mETHbETHTerraSwap <= rangeLow) {
                const mETHAccountBalance = await getAccountBalance("terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx");
                const bETHAccountBalance = await getAccountBalance("terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun");
                if (bETHAccountBalance > mETHAccountBalance) {
                    let date_ob = new Date();
                    console.log("\n-----------------" + date_ob + "-----------------");
                    console.log("ETHbETHTerraSwap = " + mETHbETHTerraSwap);
                    console.log("Swapping bETH to mETH.");

                    // Swap all bETH to mETH
                    var result = await swapAll_bETH_to_mETH(bETHAccountBalance); 
                    if (result.includes("Transaction did not execute.")) {
                        date_ob = new Date();
                        console.log("\n" + date_ob);
                        console.log("bETH to mETH transaction failed.");  
                        process.exit();            
                    } else {
                        console.log("bETH to mETH transaction complete. Hash: " + result);
                        //process.exit();
                    }
                }
            } else  if (mETHbETHTerraSwap >= rangeHigh) { 
                const mETHAccountBalance = await getAccountBalance("terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx");
                const bETHAccountBalance = await getAccountBalance("terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun");
                if (mETHAccountBalance > bETHAccountBalance) {
                    let date_ob = new Date();
                    console.log("\n" + date_ob);
                    console.log("ETHbETHTerraSwap = " + mETHbETHTerraSwap);
                    console.log("Swapping mETH back to bETH."); 
                    
                    // Swap all mETH to bETH
                    result = await swapAll_mETH_to_bETH(mETHAccountBalance);
                    
                    if (result.includes("Transaction did not execute.")) {
                        date_ob = new Date();
                        console.log("\n" + date_ob);
                        console.log("mETH to bETH transaction failed.");
                        process.exit();
                    } else {
                        console.log("mETH to bETH transaction complete. Hash: " + result);
                        //process.exit();
                    }
                }
            }
        }
        catch (error) {
            date_ob = new Date();               
            console.log("\n" + date_ob);
            console.log("Error caught: " + error);
        }

        var delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        await delay(800);
    }
}

main();
