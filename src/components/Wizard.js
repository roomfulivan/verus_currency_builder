import React from "react";
import { inputStyle, descriptionLabelStyle, buttonStyle, invisibleButtonStyle} from "../styles/Styles";


export default class Wizard extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            step: 1,
            currencyType: 'simpleToken',
            currencyName: '',
            creatorIdentity: '',
            isCentralized: false,
            singleCurrency: '',
            currencies: [],
            amounts: [],
            bridgedERC20TokenAddress: '',
            isSubIDIssuancePrivate: false,
            isNFTToken: false,
            idRegistrationFee: 0.0,
            startBlock: '',
            endBlock: '',
            preAllocations: [],
            initialSupply: 0.0,
		};
        this.submitForm = this.submitForm.bind(this);
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

    submitForm = async (e) => {
        e.preventDefault();
        if (this.state.step === 1) {
            await this.setState({
                creatorIdentity: document.getElementById('creatorIdentity').value,
                currencyName: document.getElementById('currencyName').value,
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
                try {
                    await this.setState({
                        currencies: document.getElementById('currencies').value.replace(/\s/g, "").split(','),
                        amounts: document.getElementById('amounts').value.replace(/\s/g, "").split(',').map((amount) => parseFloat(amount)),
                    });
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
                let preallocationsArray;
                if (document.getElementById('preAllocations') && document.getElementById('preAllocations').value) {
                    preallocationsArray = document.getElementById('preAllocations').value.replace(/\s/g, "").split(',').map((item) => {
                        let formatted = {};
                        formatted[item.split(':')[0]] = item.split(':')[1];
                        return formatted;
                    });
                }
                await this.setState({
                    isSubIDIssuancePrivate: document.getElementById('isSubIDIssuancePrivate').value === 'true' ? true : false,
                    isNFTToken: document.getElementById('isNFTToken').value === 'true' ? true : false,
                    idRegistrationFee: document.getElementById('idRegistrationFee').value ? parseFloat(document.getElementById('idRegistrationFee').value) : 0.0,
                    startBlock: document.getElementById('startBlock').value ? parseInt(document.getElementById('startBlock').value) : null,
                    endBlock: document.getElementById('endBlock').value ? parseInt(document.getElementById('endBlock').value) : null,
                    preAllocations: preallocationsArray,
                    initialSupply: (document.getElementById('initialSupply') && document.getElementById('initialSupply').value) ? parseInt(document.getElementById('initialSupply').value) : null,
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
            questionnaire = (
                <>
                    <label style={descriptionLabelStyle}>The identity of the creator. Can be a friendlyname (eg. ivan@), iAddress, or rAddress.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Creator Identity:</label>
                        <input id='creatorIdentity' style={inputStyle} type="text" placeholder="ivan@" defaultValue={this.state.creatorIdentity} required />
                    </div>
                    <label style={descriptionLabelStyle}>The name of the currency to be defined.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency Name:</label>
                        <input id='currencyName' style={inputStyle} type="text" placeholder="IvanCoin" defaultValue={this.state.currencyName} required />
                    </div>
                    <label style={descriptionLabelStyle}>The type of currency to be defined.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency Type:</label>
                        <select id='currencyType' style={inputStyle} defaultValue={this.state.currencyType} >
                            <option value="simpleToken">Simple Token</option>
                            <option value="mappedToken">Mapped Token</option>
                            <option value="LPToken">Liquidity Pool Token</option>
                            <option value="bridgedERC20">Bridged ERC20 Token</option>
                            {/* TODO: add PBAAS stuff */}
                        </select>
                    </div>
                </>
            );
        } else if (this.state.step === 2) {
            let centralizedBlock = <></>;
            let singleCurrencyBlock = <></>;
            let currenciesBlock = <></>;
            let amountsBlock = <></>;
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
                                <option value="VRSCTEST">VRSC</option>
                                <option value="BTC">BTC</option>
                                <option value="ETH">ETH</option>
                            </select>
                        </div>
                    </>
                );
            } else if (this.state.currencyType === 'LPToken') {
                currenciesBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Currencies: Comma seperated list of currency names to include in LP.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currencies:</label>
                            <input id='currencies' style={inputStyle} type="text" placeholder="IvanCoin, ETH, VRSC" defaultValue={this.state.currencies} required />
                        </div>
                    </>
                );
                amountsBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Amounts: Comma seperated list of amounts to mint for each currency in the LP. Must be in the same order as the currencies list.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Amounts:</label>
                            <input id='amounts' style={inputStyle} type="text" placeholder="100.0, 200.5, 300.0" defaultValue={this.state.amounts} required />
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
                    {currenciesBlock}
                    {amountsBlock}
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
                    <label style={descriptionLabelStyle}>NFT Token: tokenized onwership over currency ID</label>
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
                        <input id='idRegistrationFee' style={inputStyle} type="text" placeholder="0.0" defaultValue={this.state.idRegistrationFee} />
                    </div>
                    <label style={descriptionLabelStyle}>Start Block (optional, default 15 blocks from now): The launch block of your currency (when it becomes available to the public).</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Start Block:</label>
                        <input id='startBlock' style={inputStyle} type="text" placeholder="1511384" defaultValue={this.state.startBlock} />
                    </div>
                    <label style={descriptionLabelStyle}>End Block (optional, default never): The block at which your currency's life will end (wont be tradable or available to the public).</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>End Block:</label>
                        <input id='endBlock' style={inputStyle} type="text" placeholder="1520000" defaultValue={this.state.endBlock} />
                    </div>
                </>
            );
            let preallocationsBlock = <></>;
            let initialSupplyBlock = <></>;
            if (this.state.currencyType === 'simpleToken' || this.state.currencyType === 'LPToken') {
                preallocationsBlock = (
                    <>
                        <label style={descriptionLabelStyle}>Preallocations (optional): Mint/distribute tokens on launch - if your currency is an LP Token, preallocations must add up to initial supply. Comma seperated list.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Preallocations:</label>
                            <input id='preAllocations' style={inputStyle} type="text" placeholder="ivan@: 200, monkins@: 500, alex@: 300" />
                        </div>
                    </>
                );
                if (this.state.currencyType === 'LPToken') {
                    initialSupplyBlock = (
                        <>
                            <label style={descriptionLabelStyle}>Initial Supply (required): Amount of LP tokens to mint on launch.</label>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Initial Supply:</label>
                                <input id='initialSupply' style={inputStyle} type="text" placeholder="1000.0" defaultValue={this.state.initialSupply} required />
                            </div>
                        </>
                    );
                }
            }
            questionnaire = (
                <>
                    {initialSupplyBlock}
                    {preallocationsBlock}
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
                <form style={{marginTop:'2vh', width:'30vw', display:'flex', flexDirection:'column', fontSize:'2vh'}} onSubmit={this.submitForm}>
                    {questionnaire}
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        {this.state.step !== 1 ? <button style={buttonStyle} type='button' onClick={() => this.setState({step: this.state.step - 1})}>{backStr}</button> : <button style={invisibleButtonStyle} disabled>{backStr}</button>}
                        {this.state.step !== 3 ? <button style={buttonStyle} type='submit'>{nextStr}</button> : <button style={buttonStyle} type='submit'>Create Currency</button>}
                    </div>
                </form>
            </>
        );
    }
}