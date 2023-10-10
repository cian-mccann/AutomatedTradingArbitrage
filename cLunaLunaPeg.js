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

const swapAll_cLuna_to_Luna = async (cLunaAccountBalance) => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);

    const { assets } = await terra.wasm.contractQuery("terra1ejyqwcemr5kda5pxwz27t2ja784j3d0nj0v6lh", { pool: {} });
    const beliefPrice = (assets[0].amount / assets[1].amount).toFixed(18);

    const msg = { 
        "execute_swap_operations":{
            "max_spread": "0.02",
            "belief_price": beliefPrice,
            "operations":[
               {
                  "terra_swap":{
                        "offer_asset_info":{
                            "token":{
                                "contract_addr":"terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau"
                            }
                        },
                        "ask_asset_info":{
                            "native_token":{
                                "denom":"uluna"
                            }
                        }
                    }
               }
            ]
        }
    };

    const terraSwap = new MsgExecuteContract(
        mk.accAddress,
        "terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau",
        {
            "send": {
                "contract": "terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex",
                "amount": cLunaAccountBalance,
                "msg": "eyAKICAgICAgICAiZXhlY3V0ZV9zd2FwX29wZ...XJhdGlvbnMiOnsKICAgICAgICAgICAgIm10="           
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

const swapAll_Luna_to_cLuna = async (lunaAccountBalance) => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);

    const { assets } = await terra.wasm.contractQuery("terra1ejyqwcemr5kda5pxwz27t2ja784j3d0nj0v6lh", { pool: {} });
    const beliefPrice = (assets[0].amount / assets[1].amount).toFixed(18);

    const terraSwap = new MsgExecuteContract(
        mk.accAddress,
        "terra1ejyqwcemr5kda5pxwz27t2ja784j3d0nj0v6lh",
        {
          swap: {
            offer_asset: { 
              amount: lunaAccountBalance, 
              info: { 
                native_token: { 
                  denom: "uluna" 
                } 
              } 
            },
          },
        },
        { uluna: lunaAccountBalance }
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

const getLunaBalance = async () => {
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    const mnemonic = '...';
    const mk = new MnemonicKey({mnemonic: mnemonic});
    const wallet = terra.wallet(mk);

    const balances = await terra.bank.balance(mk.accAddress);
    const balancesArray = balances[0].toString().split(",");
    const index = balancesArray.findIndex(element => element.includes("uluna"));
    const balance = balancesArray[index];
    try {
        return balance.replace("uluna", "");
    } catch {
        return 0;
    }
}

const main = async () => {
    // Chart: https://coinhall.org/charts/terra/terra1ejyqwcemr5kda5pxwz27t2ja784j3d0nj0v6lh
    const terra = new LCDClient({URL: 'https://columbus-5--lcd--full.datahub.figment.io/apikey/.../', chainID: 'columbus-5'});
    
    const rangeHigh= 1.023;
    const rangeLow=0.977;
    
    // Always looking to buy cLuna at rangeLow and sell it back to Luna at rangeHigh.
    while (true) {
        try {
            const { assets } = await terra.wasm.contractQuery("terra1ejyqwcemr5kda5pxwz27t2ja784j3d0nj0v6lh", { pool: {} });
            const cLunaLunaTerraSwap = (assets[1].amount / assets[0].amount).toFixed(18);

            if (cLunaLunaTerraSwap <= rangeLow) {
                const cLunaAccountBalance = await getAccountBalance("terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau");
                const lunaAccountBalance = await getLunaBalance();
                if (lunaAccountBalance > cLunaAccountBalance) {
                    let date_ob = new Date();
                    console.log("\n-----------------" + date_ob + "-----------------");
                    console.log("cLunaLunaTerraSwap = " + cLunaLunaTerraSwap);
                    console.log("Swapping Luna to cLuna.");
                    
                    // Swap all Luna to cLuna
                    var result = await swapAll_Luna_to_cLuna(lunaAccountBalance); 
                    if (result.includes("Transaction did not execute.")) {
                        date_ob = new Date();
                        console.log("\n" + date_ob);
                        console.log("Luna to cLuna transaction failed.");  
                        process.exit();            
                    } else {
                        console.log("Luna to cLuna transaction complete. Hash: " + result);
                        process.exit();
                    }
                }
            } else  if (cLunaLunaTerraSwap >= rangeHigh) { 
                console.log("cLunaLunaTerraSwap >= rangeHigh");
                const cLunaAccountBalance = await getAccountBalance("terra13zaagrrrxj47qjwczsczujlvnnntde7fdt0mau");
                const lunaAccountBalance = await getLunaBalance();
                console.log("cLunaLunaTerraSwap >= rangeHigh");
                console.log(cLunaAccountBalance);
                console.log(lunaAccountBalance);
                if (cLunaAccountBalance > lunaAccountBalance) {
                    let date_ob = new Date();
                    console.log("\n" + date_ob);
                    console.log("cLunaLunaTerraSwap = " + cLunaLunaTerraSwap);
                    console.log("Swapping cLuna back to Luna."); 
                    console.log(cLunaAccountBalance);
                    
                    // Swap all cLuna to Luna
                    result = await swapAll_cLuna_to_Luna(cLunaAccountBalance);
                    
                    if (result.includes("Transaction did not execute.")) {
                        date_ob = new Date();
                        console.log("\n" + date_ob);
                        console.log("cLuna to Luna transaction failed.");
                        process.exit();
                    } else {
                        console.log("cLuna to Luna transaction complete. Hash: " + result);
                        process.exit();
                    }
                }
            }
        }
        catch (error) {
            date_ob = new Date();               
            console.log("\n" + date_ob);
            console.log("Error caught: " + error);
        }

    }
}

main();