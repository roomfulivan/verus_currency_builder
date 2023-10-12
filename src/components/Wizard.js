import React from "react";
import { inputStyle,
    descriptionLabelStyle,
    descriptionLabelStyle2,
    buttonStyle,
    buttonStyle2,
    invisibleButtonStyle,
    plusButtonStyle,
    plusButtonStyle2,
    tableStyle,
    tableStyle2,
    tdStyle,
    inputStyleTable,
    inputStyleCurrency1,
    inputStyleCurrency2,
    inputStyleWithInfo
} from "../styles/Styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default class Wizard extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            step: 1,
            currencyType: 'simpleToken',
            currencyTypeInfo: false,
            currencyName: '',
            currencyTicker: '',
            creatorIdentity: '',
            isCentralized: false,
            singleCurrency: '',
            currencies: [],
            numCurrencies: 1,
            amounts: [],
            bridgedERC20TokenAddress: '',
            isSubIDIssuancePrivate: false,
            isNFTToken: false,
            isPresale: false,
            presaleInfoClicked: false,
            idRegistrationFee: 0.0,
            startDate: '',
            endDate: '',
            preAllocations: [],
            numPreallocations: 1,
            initialSupply: 0.0,
            conversions: [],
            minPreconversions: [],
		};
        this.submitForm = this.submitForm.bind(this);
        this.handleCurrencyTypeChange = this.handleCurrencyTypeChange.bind(this);
	}

    
    // //trace state updates
    // componentDidUpdate(prevProps, prevState) {
    //     Object.entries(this.props).forEach(([key, val]) =>
    //       prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    //     );
    //     if (this.state) {
    //       Object.entries(this.state).forEach(([key, val]) =>
    //         prevState[key] !== val && console.log(`State '${key}' changed`)
    //       );
    //     }
    // }

    getDatePicker = (startMode) => {
        return (
          <DatePicker
            className='datepicker'
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            selected={startMode ? this.state.startDate : this.state.endDate}
            onChange={(date) => {
                if (startMode) this.setState({startDate: date});
                else this.setState({endDate: date});
            }}
          />
        );
    };

    //changes number of rows in table
    handleRowsChange = (mode, plusMinus) => {
        if (mode === 'preallocations') {
            if (plusMinus) {
                this.setState({
                    numPreallocations: this.state.numPreallocations + 1,
                });
            } else {
                if (this.state.numPreallocations === 1) return;
                this.setState({
                    numPreallocations: this.state.numPreallocations - 1,
                });
            }
        } else if (mode === 'currencies') {
            if (plusMinus) {
                this.setState({
                    numCurrencies: this.state.numCurrencies + 1,
                });
            } else {
                if (this.state.numCurrencies === 1) return;
                this.setState({
                    numCurrencies: this.state.numCurrencies - 1,
                });
            }
        }
    }

    handleInfoClick = (mode) => {
        if (mode === 'currencyType') {
            this.setState({currencyTypeInfo: this.state.currencyTypeInfo ? false : true});
        } else if (mode === 'presaleInfo') {
            this.setState({presaleInfoClicked: this.state.presaleInfoClicked ? false : true});
        }
    }

    handleCurrencyTypeChange = async (e) => {
        e.preventDefault();
        await this.setState({currencyType: e.target.value});
    }

    //submits form in each step of wizard, updates state variables.
    submitForm = async (e) => {
        e.preventDefault();
        if (this.state.step === 1) {
            await this.setState({
                creatorIdentity: document.getElementById('creatorIdentity').value,
                currencyName: document.getElementById('currencyName').value,
                currencyTicker: document.getElementById('currencyTicker').value,
                currencyType: document.getElementById('currencyType').value,
                step: this.state.step + 1,
            });
        } else if (this.state.step === 2) {
            if (this.state.currencyType === 'simpleToken') {
                await this.setState({
                    isCentralized: document.getElementById('isCentralized').value === 'true' ? true : false,
                });
            } else if (this.state.currencyType === 'mappedToken') {
                await this.setState({
                    singleCurrency: document.getElementById('singleCurrency').value,
                });
            } else if (this.state.currencyType === 'LPToken') {
                let currencies = [];
                let amounts = [];
                for (let i=0; i<this.state.numCurrencies; i++) {
                    currencies.push(document.getElementById('currenciesName' + (i+1).toString()).value);
                    amounts.push(document.getElementById('currenciesAmount' + (i+1).toString()).value);
                }
                try {
                    await this.setState({
                        currencies: currencies,
                        amounts: amounts,
                        isPresale: document.getElementById('isPresale').value === 'true' ? true : false,
                    });
                    console.log('stateAfter', this.state);
                } catch (e) {
                    console.error(e);
                }
            } else if (this.state.currencyType === 'bridgedERC20') {
                await this.setState({
                    bridgedERC20TokenAddress: document.getElementById('bridgedERC20TokenAddress').value,
                });
            } else {
                console.error('Invalid currency type');
            }
            await this.setState({step: this.state.step + 1});
        } else if (this.state.step === 3) {
            try {
                let preallocations = [];
                for (let i=0; i<this.state.numPreallocations; i++) {
                    preallocations.push({
                        identity: document.getElementById('preAllocationsIdentity' + (i+1).toString()).value,
                        amount: document.getElementById('preAllocationsAmount' + (i+1).toString()).value,
                    });
                }
                let conversions = [];
                let minpreconversions = [];
                if (this.state.isPresale) {
                    for (let i=0; i<this.state.numCurrencies; i++) {
                        conversions.push(document.getElementById('presaleConversion' + (i+1).toString()).value);
                        minpreconversions.push(document.getElementById('presaleMinimumAmount' + (i+1).toString()).value);
                    }
                } else {
                    conversions = null;
                    minpreconversions = null;
                }
                await this.setState({
                    isSubIDIssuancePrivate: document.getElementById('isSubIDIssuancePrivate').value === 'true' ? true : false,
                    isNFTToken: document.getElementById('isNFTToken').value === 'true' ? true : false,
                    idRegistrationFee: document.getElementById('idRegistrationFee').value ? parseFloat(document.getElementById('idRegistrationFee').value) : 0.0,
                    startBlock: document.getElementById('startBlock').value ? parseInt(document.getElementById('startBlock').value) : null,
                    endBlock: document.getElementById('endBlock').value ? parseInt(document.getElementById('endBlock').value) : null,
                    preAllocations: preallocations,
                    initialSupply: (document.getElementById('initialSupply') && document.getElementById('initialSupply').value) ? parseInt(document.getElementById('initialSupply').value) : null,
                    minPreconversions: minpreconversions,
                    conversions: conversions,
                });
                await this.props.createCurrency(this.state);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.error('Invalid step');
        }
    };

    render() {
        let questionnaire;
        if (this.state.step === 1) {
            let currencyTypeInfoBlock;
            if (this.state.currencyType === 'simpleToken') {
                currencyTypeInfoBlock = (
                    <>
                    <label style={descriptionLabelStyle2}> <b>Simple Token</b>: The simplest form of currency on the Verus blockchain, identical to an Ethereum ERC-20 token.</label>
                    </>
                );
            } else if (this.state.currencyType === 'mappedToken') {
                currencyTypeInfoBlock = (
                    <>
                    <label style={descriptionLabelStyle2}> <b>Mapped Token</b>: A currency that is mapped 1:1 to another currency. This enables branded currencies that are pegged to other currencies.</label>
                    </>
                );
            } else if (this.state.currencyType === 'bridgedERC20') {
                currencyTypeInfoBlock = (
                    <>
                    <label style={descriptionLabelStyle2}> <b>Bridged ERC20 Token</b>: A currency that is bridged from Ethereum or an EVM blockchain to the Verus blockchain.</label>
                    </>
                );
            } else if (this.state.currencyType === 'LPToken') {
                currencyTypeInfoBlock = (
                    <>
                    <label style={descriptionLabelStyle2}> <b>Liquidity Pool</b>: A liquidity pool is a basket of existing currencies that enables trading between currencies in the basket. By creating a liquidity pool, you are creating a fractional reserve currency that represents ownership over the liquidity pool (basket of currencies). For example, if you own 50% of the supply of this currency, then you own 50% of all the other currencies in the pool. </label>
                    </>
                );
            } else if (this.state.currencyType === 'IndexToken') {
                currencyTypeInfoBlock = (
                    <>
                    <label style={descriptionLabelStyle2}> <b>Index Token</b>: A currency that is backed by a basket of other currencies. This works similarly to a stock/forex index fund.</label>
                    </>
                );
            } else {
                console.error('Invalid currency type');
            }
            questionnaire = (
                <>
                    <label style={descriptionLabelStyle}>The identity of the creator. Can be a friendlyname (eg. ivan@), iAddress, or rAddress.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Creator Identity:</label>
                        <input id='creatorIdentity' style={inputStyle} type="text" placeholder="ivan@" defaultValue={this.state.creatorIdentity} required />
                    </div>
                    <label style={descriptionLabelStyle}>The name of the currency to be defined (must be a top-level identity).</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency Name:</label>
                        <input id='currencyName' style={inputStyle} type="text" placeholder="Bitcoin" defaultValue={this.state.currencyName} required />
                    </div>
                    <label style={descriptionLabelStyle}>The ticker of the currency - for example, the ticker of Bitcoin is BTC.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency Ticker:</label>
                        <input id='currencyTicker' style={inputStyle} type="text" placeholder="BTC" defaultValue={this.state.currencyTicker} required />
                    </div>
                    <label style={descriptionLabelStyle}>The type of currency to be defined.</label>
                    {this.state.currencyTypeInfo ?
                    currencyTypeInfoBlock
                    :
                    <></>   
                    }
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency Type:</label>
                        <select id='currencyType' style={inputStyleWithInfo} defaultValue={this.state.currencyType} onChange={this.handleCurrencyTypeChange} >
                            <option value="simpleToken">Simple Token</option>
                            <option value="mappedToken">Mapped Token</option>
                            <option value="bridgedERC20">Bridged ERC20 Token</option>
                            <option value="LPToken">Liquidity Pool</option>
                            <option value="IndexToken">Index Token</option>
                            {/* TODO: add PBAAS stuff */}
                        </select>
                        <button style={plusButtonStyle2} type='button' onClick={() => this.handleInfoClick('currencyType')}>?</button>
                    </div>
                </>
            );
        } else if (this.state.step === 2) {
            let centralizedBlock = <></>;
            let singleCurrencyBlock = <></>;
            let currenciesBlock = <></>;
            let presaleBlock = <></>;
            let bridgedERC20TokenAddressBlock = <></>;
            if (this.state.currencyType === 'simpleToken') {
                centralizedBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Centralized: Owner can mint tokens (control supply). Decentralized: no ownership/control over token/supply</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginRight:'1vh'}}>Centralized:</label>
                            <select id='isCentralized' style={inputStyle} defaultValue={this.state.isCentralized ? "true" : "false"} >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </>
                );
            } else if (this.state.currencyType === 'mappedToken') {
                singleCurrencyBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Currency: The currency to map to. This currency will be swappable 1:1 for your currency.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency:</label>
                            <select id='singleCurrency' style={inputStyle} defaultValue={this.state.singleCurrency} >
                                <option value="USDC">USDC</option>
                                <option value="VRSCTEST">VRSCTEST</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                            </select>
                        </div>
                    </>
                );
            } else if (this.state.currencyType === 'LPToken' || this.state.currencyType === 'IndexToken') {
                let currenciesTableContent = [];
                for (let i=0; i<this.state.numCurrencies; i++) {
                    let identity = 'currenciesName' + (i+1).toString();
                    let amount = 'currenciesAmount' + (i+1).toString();
                    currenciesTableContent.push(
                        <tr>
                            {this.state.currencies.length <= i ?
                            <td style={tdStyle}><input id={identity} style={inputStyleTable} type="text" placeholder="USDC" required /></td>
                            :
                            <td style={tdStyle}><input id={identity} style={inputStyleTable} type="text" defaultValue={this.state.currencies[i]} required /></td>
                            }
                            {this.state.amounts.length <= i ?
                            <td style={tdStyle}><input id={amount} style={inputStyleTable} type="text" placeholder="500.0" required /></td>
                            :
                            <td style={tdStyle}><input id={amount} style={inputStyleTable} type="text" placeholder="500.0" defaultValue={this.state.amounts[i]} required /></td>
                            }
                        </tr>
                    )
                }
                currenciesBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Reserves: Currencies and their respective amounts to include in the Liquidity Pool.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Reserves:</label>
                            <table style={tableStyle}>
                                <tr>
                                    <th style={tdStyle}>Currency</th>
                                    <th style={tdStyle}>Amount</th>
                                </tr>
                                {currenciesTableContent}
                            </table>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <button style={plusButtonStyle} type='button' onClick={() => this.handleRowsChange('currencies', true)}>+</button>
                                <button style={plusButtonStyle} type='button' onClick={() => this.handleRowsChange('currencies', false)}>-</button>
                            </div>
                        </div>
                    </>
                );
                presaleBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Presale: Sell tokens for a fixed price/ratio prior to public launch.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Presale:</label>
                            <select id='isPresale' style={inputStyle} defaultValue={this.state.isPresale ? "true" : "false"} >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </>
                );
            } else if (this.state.currencyType === 'bridgedERC20') {
                bridgedERC20TokenAddressBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Bridged ERC20 Token Address: Address of ERC20 Token on Ethereum/EVM Blockchain</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>ERC20 Address:</label>
                            <input id='bridgedERC20TokenAddress' style={inputStyle} type="text" placeholder="0xA7c...deAD" defaultValue={this.state.bridgedERC20TokenAddress} required />
                        </div>
                    </>
                )
            } else {
                console.error('Invalid currency type');
            }

            questionnaire = (
                <>
                    {centralizedBlock}
                    {singleCurrencyBlock}
                    {presaleBlock}
                    {currenciesBlock}
                    {bridgedERC20TokenAddressBlock}
                </>
            );
        } else if (this.state.step === 3) {
            const invariantBlocks = (
                <>
                    <label style={descriptionLabelStyle}>Public subIDs: anyone can mint subIDs. Private subIDs: only you (owner) can mint subIDs</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Private SubIDs:</label>
                        <select id='isSubIDIssuancePrivate' style={inputStyle} defaultValue={this.state.isSubIDIssuancePrivate ? "true" : "false"} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <label style={descriptionLabelStyle}>NFT Token: tokenized onwership over currency ID. Royalties on subIDs get split amongst holders of currency.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>NFT Token:</label>
                        <select id='isNFTToken' style={inputStyle} defaultValue={this.state.isNFTToken ? "true" : "false"} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <label style={descriptionLabelStyle}>The registration fee for subIDs. The fee is always in the native currency (ie. this currency).</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>ID Registration Fee:</label>
                        <input id='idRegistrationFee' style={inputStyleCurrency1} type="text" placeholder="0.0" defaultValue={this.state.idRegistrationFee} />
                        <input style={inputStyleCurrency2} type="text" value={this.state.currencyTicker} disabled />
                    </div>
                    <label style={descriptionLabelStyle}>Start Date/Time (optional, default 15 blocks from now): The launch time of your currency (when it becomes available to the public). Average blocktime on Verus: 1 minute/block. Currency will not be tradable before launch block.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Start Date/Time:</label>
                        {this.getDatePicker(true)}
                    </div>
                    <label style={descriptionLabelStyle}>End Date/Time (optional, default never): The time at which your currency's life will end (wont be tradable or available to the public).</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>End Date/Time:</label>
                        {this.getDatePicker(false)}
                    </div>
                </>
            );
            let preallocationsBlock = <></>;
            let initialSupplyBlock = <></>;
            let presaleBlock = <></>;
            if (this.state.currencyType === 'simpleToken' || this.state.currencyType === 'LPToken') {
                let preAllocationsTableContent = [];
                for (let i=0; i<this.state.numPreallocations; i++) {
                    let identity = 'preAllocationsIdentity' + (i+1).toString();
                    let amount = 'preAllocationsAmount' + (i+1).toString();
                    preAllocationsTableContent.push(
                        <tr>
                            <td style={tdStyle}><input id={identity} style={inputStyleTable} type="text" placeholder="ivan@" /></td>
                            <td style={tdStyle}><input id={amount} style={inputStyleTable} type="text" placeholder="50.0" /></td>
                        </tr>
                    )
                }
                preallocationsBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Preallocations (optional): % distribution of tokens on launch. If it doesn't add up to 100%, the remainder will be minted to creator by default.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Preallocations:</label>
                            <table style={tableStyle}>
                                <tr>
                                    <th style={tdStyle}>Identity</th>
                                    <th style={tdStyle}>Allocation (%)</th>
                                </tr>
                                {preAllocationsTableContent}
                            </table>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <button style={plusButtonStyle} type='button' onClick={() => this.handleRowsChange('preallocations', true)}>+</button>
                                <button style={plusButtonStyle} type='button' onClick={() => this.handleRowsChange('preallocations', false)}>-</button>
                            </div>
                        </div>
                    </>
                );
                initialSupplyBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Initial Supply (required): Amount of tokens to mint on launch.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Initial Supply:</label>
                            <input id='initialSupply' style={inputStyleCurrency1} type="text" placeholder="1000.0" defaultValue={this.state.initialSupply} required />
                            <input style={inputStyleCurrency2} type="text" value={this.state.currencyTicker} disabled />
                        </div>
                    </>
                );
                if (this.state.currencyType === 'LPToken' && this.state.isPresale) {
                    let presaleTableContent = [];
                    for (let i=0; i<this.state.numCurrencies; i++) {
                        let conversion = 'presaleConversion' + (i+1).toString();
                        let minimum = 'presaleMinimumAmount' + (i+1).toString();
                        presaleTableContent.push(
                            <tr>
                                <td style={tdStyle}><input style={inputStyleTable} type="text" value={this.state.currencies[i]} disabled /></td>
                                <td style={tdStyle}><input id={conversion} style={inputStyleTable} type="text" placeholder="0.75" required/></td>
                                <td style={tdStyle}><input id={minimum} style={inputStyleTable} type="text" placeholder="500.0" /></td>
                            </tr>
                        )
                    }
                    presaleBlock = (
                        <>
                            <label style={descriptionLabelStyle}>Presale Info: Presale conversion rates, minimum amounts to be raised.
                                {this.state.presaleInfoClicked ?
                                <>
                                <br/> <b>Conversion Ratio</b>: The fixed presale conversion rate for each currency in the basket. Must add up to 1.0. For example, if the basket contains 2 currencies, and the conversion ratio is 0.75 to 0.25, the second currency is worth 3 of the first currency, making the exchange rate 1:3.
                                <br/> <b>Minimum Amount to Raise</b>: The minimum amount of each currency that must be raised in the presale. If the minimum amount is not raised, the presale will fail and all funds will be returned to the presale participants.
                                </>
                                :
                                <></>   
                                }
                            </label>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Presale:</label>
                                <table style={tableStyle2}>
                                    <tr>
                                        <th style={tdStyle}>Currency</th>
                                        <th style={tdStyle}>Conversion Ratio</th>
                                        <th style={tdStyle}>Minimum Amount to Raise</th>
                                    </tr>
                                    {presaleTableContent}
                                </table>
                                <button style={plusButtonStyle} type='button' onClick={() => this.handleInfoClick('presaleInfo')}>?</button>
                                {/* <div style={{display:'flex', flexDirection:'row'}}>
                                    <button style={plusButtonStyle} type='button' onClick={() => this.handleRowsChange('preallocations', true)}>+</button>
                                    <button style={plusButtonStyle} type='button' onClick={() => this.handleRowsChange('preallocations', false)}>-</button>
                                </div> */}
                            </div>
                        </>
                    );
                }
            }
            questionnaire = (
                <>
                    {initialSupplyBlock}
                    {preallocationsBlock}
                    {presaleBlock}
                    {invariantBlocks}
                </>
            );
        } else {
            console.error('Invalid step');
        }


        const backStr = '< Back'
        const nextStr = 'Next >'
        return (
            <>
                <form style={{marginTop:'2vh', width:'35vw', display:'flex', flexDirection:'column', fontSize:'2vh'}} onSubmit={this.submitForm}>
                    {questionnaire}
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        {this.state.step !== 1 ? <button style={buttonStyle} type='button' onClick={() => this.setState({step: this.state.step - 1})}>{backStr}</button> : <button style={invisibleButtonStyle} disabled>{backStr}</button>}
                        {this.state.step !== 3 ? 
                            <button style={buttonStyle} type='submit'>{nextStr}</button> 
                            : 
                            this.state.currencyType === "LPToken" ? 
                                <button style={buttonStyle} type='submit'>Create Currency</button>
                                : 
                                <div style={{display:'flex', flexDirection:'column', width:'30%'}}>
                                    <button style={buttonStyle2} type='submit'>Create Currency</button>
                                    <button style={buttonStyle2} type='button' onClick={() => {
                                        this.setState({
                                            step: this.state.step - 1,
                                            numCurrencies: 2,
                                            currencies: [this.state.currencyName],
                                            currencyName: this.state.currencyName + 'LP',
                                            currencyTicker: this.state.currencyTicker + 'LP',
                                            currencyType: 'LPToken',
                                        });
                                        }}>Create Liquidity Pool</button>
                                </div>
                        }
                    </div>
                </form>
            </>
        );
    }
}