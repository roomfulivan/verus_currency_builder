import React, { Component } from "react";
import axios from 'axios';
import { QRCodeCanvas } from "qrcode.react";



export default class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
            isMappedCurrency: false,
            isLP: false,
            isBridgedERC20: false,
            rawUnsignedTxnHex: '',
            defineCurrencyCommand: '',
		};
        this.submitForm = this.submitForm.bind(this);
	}

    handleIsLPChange = (event) => {
        event.preventDefault();
        if (event.target.value == 'true') {
            this.setState({isLP: true});
        } else {
            this.setState({isLP: false});
        }
    }

    handleIsBridgedERC20Change = (event) => {
        event.preventDefault();
        if (event.target.value == 'true') {
            this.setState({isBridgedERC20: true});
        } else {
            this.setState({isBridgedERC20: false});
        }
    }

    handleMappedCurrencyChange = (event) => {
        event.preventDefault();
        if (event.target.value == 'true') {
            this.setState({isMappedCurrency: true});
        } else {
            this.setState({isMappedCurrency: false});
        }
    }

    submitForm = async (event) => {
        try {
            event.preventDefault();
            const creatorIdentity = document.getElementById('creatorIdentity') === null ? null: document.getElementById('creatorIdentity').value;
            const currencyName = document.getElementById('currencyName') === null ? null: document.getElementById('currencyName').value;
            const isMapped = document.getElementById('isMapped') === null ? null: document.getElementById('isMapped').value === 'true' ? true : false;
            const isLiquidityPool = document.getElementById('isLiquidityPool') === null ? null: document.getElementById('isLiquidityPool').value === 'true' ? true : false;
            const isCentralized = document.getElementById('isCentralized') === null ? null: document.getElementById('isCentralized').value === 'true' ? true : false;
            const isSubIDIssuancePrivate = document.getElementById('isSubIDIssuancePrivate') === null ? null: document.getElementById('isSubIDIssuancePrivate').value === 'true' ? true : false;
            const isNFTToken = document.getElementById('isNFTToken') === null ? null: document.getElementById('isNFTToken').value === 'true' ? true : false;
            const preAllocations = document.getElementById('preAllocations') === null ? null: document.getElementById('preAllocations').value;
            const currency = document.getElementById('singleCurrency') === null ? null: document.getElementById('singleCurrency').value;
            const currencies = document.getElementById('currencies') === null ? null: document.getElementById('currencies').value;
            const amounts = document.getElementById('amounts') === null ? null: document.getElementById('amounts').value;
            const isBridgedERC20 = document.getElementById('isBridgedERC20') === null ? null: document.getElementById('isBridgedERC20').value === 'true' ? true : false;
            const bridgedERC20TokenAddress = document.getElementById('bridgedERC20TokenAddress') === null ? null: document.getElementById('bridgedERC20TokenAddress').value;
            let idRegistrationFee = document.getElementById('idRegistrationFee') === null ? null: document.getElementById('idRegistrationFee').value;
            console.log(creatorIdentity, currencyName, isMapped, isLiquidityPool, isCentralized, isSubIDIssuancePrivate, isNFTToken, preAllocations, currency, currencies, amounts, isBridgedERC20, bridgedERC20TokenAddress, idRegistrationFee);

            //TODO: validate inputs, make API call to get definecurrency command and raw unsigned txn hex
            let preallocationsArray = [];
            if (preAllocations !== null && preAllocations !== '') {
                preallocationsArray = preAllocations.replace(/\s/g, "").split(',').map((item) => {
                    let formatted = {};
                    formatted[item.split(':')[0]] = item.split(':')[1];
                    return formatted;
                });
            }
            let currenciesArray = [];
            if (currencies !== null && currencies !== '') {
                currenciesArray = currencies.replace(/\s/g, "").split(',');
            }
            let amountsArray = [];
            if (amounts !== null && amounts !== '') {
                amountsArray = amounts.replace(/\s/g, "").split(',').map((item) => parseFloat(item));
            }
            if (idRegistrationFee !== null && idRegistrationFee !== '') {
                idRegistrationFee = parseFloat(idRegistrationFee);
            } else {
                idRegistrationFee = 0.0;
            }

            //make api call
            let requestParams = {
                currencyName: currencyName,
                mappedCurrencies: isMapped ? [currency] : isLiquidityPool ? currenciesArray : null,
                currencyAmounts: amountsArray.length ? amountsArray : null,
                idRegistrationFees: idRegistrationFee,
                preAllocations: (preAllocations && preAllocations.length) ? preallocationsArray : null,
                isSubIDIssuancePrivate: isSubIDIssuancePrivate,
                isLiquidityPool: isLiquidityPool,
                isCentralized: isCentralized,
                isERC20BridgedCurrency: isBridgedERC20,
                ERC20TokenAddress: isBridgedERC20 ? bridgedERC20TokenAddress : null,
            }
            console.log('API Call Params:', requestParams)
            const response = await axios.post('http://52.13.27.118:5001/createVerusCurrency', requestParams);
            console.log(response);
            this.setState({defineCurrencyCommand: response.data.defineCurrencyCommand, rawUnsignedTxnHex: response.data.rawUnsignedTxnHex});

        } catch (error) {
            console.error(error);
        }
    }
    

	render() {
        const inputStyle = {
            marginBottom:'2vh',
            width:'60%',
            backgroundColor:'#000000',
            border:'1px solid #ffffff',
            color:'#ffffff',
            fontSize:'2vh',
        }
        const descriptionLabelStyle = {
            marginBottom:'.5vh',
            fontSize:'1vh',
            fontStyle:'italic'
        }
        const buttonStyle = {
            marginTop:'2vh',
            width:'50%',
            marginLeft:'25%',
            height:'5vh',
            backgroundColor:'#ffffff',
            color:'#000000',
            fontSize:'2vh',
            fontStyle:'bold',
            border:'none',
            borderRadius:'1vh',
            cursor:'pointer',
            marginBottom:'5vh'
        }

        let QRCode = <></>;
        if (this.state.rawUnsignedTxnHex !== '') {
            QRCode = (
                <>
                    <h4>QR code for raw unsigned txn:</h4>
                    <QRCodeCanvas
                    id="qrCode"
                    value={this.state.rawUnsignedTxnHex}
                    size={300}
                    bgColor={"#00ff00"}
                    level={"H"}
                    />
                </>
            );
        }

        let defineCurrencyCommand = <></>;
        if (this.state.defineCurrencyCommand !== '') {
            defineCurrencyCommand = (
                <>
                    <h4 style={{marginTop:'4vh'}}>Define currency command:</h4>
                    <div style={{color:"#ffffff", marginBottom:'5vh', width: '70%'}}>
                        {this.state.defineCurrencyCommand}
                    </div>
                </>
            );
        }

        let mappedCurrencyBlock;
        if (this.state.isLP || this.state.isBridgedERC20) { // cannot be mapped if LP or bridged
            mappedCurrencyBlock = (
                <>
                    <label style={descriptionLabelStyle}>Mapped currency: A token mapped 1:1 with another currency. Must be decentralized, initial supply/preallocations must be 0.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginRight:'1vh'}}>Mapped Currency:</label>
                        <select id='isMapped' style={inputStyle} value="false" disabled >
                            <option value="false">No</option>
                        </select>
                    </div>
                </>
            )
        } else {
            mappedCurrencyBlock = (
                <>
                    <label style={descriptionLabelStyle}>Mapped currency: A token mapped 1:1 with another currency. Must be decentralized, initial supply/preallocations must be 0.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginRight:'1vh'}}>Mapped Currency:</label>
                        <select id='isMapped' style={inputStyle} onChange={this.handleMappedCurrencyChange} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </>
            )
        }

        let liquidityPoolBlock;
        if (this.state.isMappedCurrency || this.state.isBridgedERC20) { // cannot be LP if mapped or bridged
            liquidityPoolBlock = (
                <>
                    <label style={descriptionLabelStyle}>Liquidity Pool: You are creating a Liquidity Pool with multiple currencies and defining LP tokens that represent ownership over the pool</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Liquidity Pool:</label>
                        <select id='isLiquidityPool' style={inputStyle} value="false" disabled >
                            <option value="false">No</option>
                        </select>
                    </div>
                </>
            )
        } else {
            liquidityPoolBlock = (
                <>
                    <label style={descriptionLabelStyle}>Liquidity Pool: You are creating a Liquidity Pool with multiple currencies and defining LP tokens that represent ownership over the pool</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Liquidity Pool:</label>
                        <select id='isLiquidityPool' style={inputStyle} onChange={this.handleIsLPChange} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </>
            )
        }

        let centralizedBlock;
        if (this.state.isMappedCurrency || this.state.isLP || this.state.isBridgedERC20) { // cannot be centralized if mapped, LP, or bridged
            centralizedBlock = (
                <>
                    <label style={descriptionLabelStyle}>Centralized: You (owner) can mint tokens. Decentralized: no ownership over token/supply</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginRight:'1vh'}}>Centralized:</label>
                        <select id='isCentralized' style={inputStyle} value="false" disabled >
                            <option value="false">No</option>
                        </select>
                    </div>
                </>
            )
        } else {
            centralizedBlock = (
                <>
                    <label style={descriptionLabelStyle}>Centralized: You (owner) can mint tokens. Decentralized: no ownership over token/supply</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginRight:'1vh'}}>Centralized:</label>
                        <select id='isCentralized' style={inputStyle} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </>
            )
        }

        let preallocationsBlock = (<></>);
        if (!(this.state.isMappedCurrency || this.state.isBridgedERC20)) { // cannot have preallocations if mapped, or bridged
            preallocationsBlock = (
                <>
                    <label style={descriptionLabelStyle}>Preallocations: Mint/distribute tokens on launch. Comma seperated list.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Preallocations:</label>
                        <input id='preAllocations' style={inputStyle} type="text" placeholder="ivan@: 200, monkins@: 500, alex@: 300" />
                    </div>
                </>
            )
        }

        let currenciesBlock = (<></>);
        if (this.state.isLP) { // currencies param is only needed if LP
            currenciesBlock = (
                <>
                    <label style={descriptionLabelStyle}>Currencies: Comma seperated list of currency names to include in LP.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currencies:</label>
                        <input id='currencies' style={inputStyle} type="text" placeholder="IvanCoin, ETH, VRSC" required />
                    </div>
                </>
            )
        }

        let singleCurrencyBlock = (<></>);
        if (this.state.isMappedCurrency) { // only needed if mapped
            singleCurrencyBlock = (
                <>
                    <label style={descriptionLabelStyle}>Currency: The currency to map to. This currency will be swappable 1:1 for your currency.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency:</label>
                        <select id='singleCurrency' style={inputStyle} >
                            <option value="USDC">USDC</option>
                            <option value="VRSCTEST">VRSC</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                        </select>
                    </div>
                </>
            )
        }

        let isBridgedERC20Block;
        if (this.state.isLP || this.state.isMappedCurrency) { // cannot be bridged if LP or mapped
            isBridgedERC20Block = (
                <>
                    <label style={descriptionLabelStyle}>Bridged ERC20 Token: ERC20 Token bridged from Ethereum/EVM Blockchain</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Bridged ERC20 Token:</label>
                        <select id='isBridgedERC20' style={inputStyle} value="false" disabled >
                            <option value="false">No</option>
                        </select>
                    </div>
                </>
            )
        } else {
            isBridgedERC20Block = (
                <>
                    <label style={descriptionLabelStyle}>Bridged ERC20 Token: ERC20 Token bridged from Ethereum/EVM Blockchain</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Bridged ERC20 Token:</label>
                        <select id='isBridgedERC20' style={inputStyle} onChange={this.handleIsBridgedERC20Change} >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </>
            )
        }

        let bridgedERC20TokenAddressBlock = (<></>);
        if (this.state.isBridgedERC20) { // only needed if bridged
            bridgedERC20TokenAddressBlock = (
                <>
                    <label style={descriptionLabelStyle}>Bridged ERC20 Token Address: Address of ERC20 Token on Ethereum/EVM Blockchain</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>ERC20 Address:</label>
                        <input id='bridgedERC20TokenAddress' style={inputStyle} type="text" placeholder="0xA7c8DfLe9Dc8dw9eCdsf8Df8Df8Df8Df8Df8Df8Df" required />
                    </div>
                </>
            )
        }

        let amountsBlock = (<></>);
        if (this.state.isLP) { // only needed if LP
            amountsBlock = (
                <>
                    <label style={descriptionLabelStyle}>Amounts: Comma seperated list of amounts to mint for each currency in the LP. Must be in the same order as the currencies list.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Amounts:</label>
                        <input id='amounts' style={inputStyle} type="text" placeholder="100.0, 200.5, 300.0" required />
                    </div>
                </>
            )
        }

		return (
			<>
				<div style={{height:'100vh', width:'100vw', backgroundColor:'#000000', color:'#ffffff', display:'flex', alignItems:'center', flexDirection:'column', overflowY:'scroll'}}>
					<h1 style={{marginTop:'5vh'}}>Verus Currency Builder</h1>
                    <h4 style={{marginTop:'1vh', width:'40%'}}>This is an interactive tool to help define currencies. Simply fill out the form, and it will generate the appropriate daemon command, 
                    as well as an unsigned raw transaction hex that can be signed and uploaded to the blockchain.</h4>
                    <form style={{marginTop:'2vh', width:'30vw', display:'flex', flexDirection:'column', fontSize:'2vh'}} onSubmit={this.submitForm}>
                        <label style={descriptionLabelStyle}>The identity of the creator. Can be a friendlyname (eg. ivan@), iAddress, or rAddress.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Creator Identity:</label>
                            <input id='creatorIdentity' style={inputStyle} type="text" placeholder="ivan@" required />
                        </div>
                        <label style={descriptionLabelStyle}>The name of the currency to be defined.</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currency Name:</label>
                            <input id='currencyName' style={inputStyle} type="text" placeholder="IvanCoin" required />
                        </div>
                        {mappedCurrencyBlock}
                        {singleCurrencyBlock}
                        {liquidityPoolBlock}
                        {currenciesBlock}
                        {amountsBlock}
                        {centralizedBlock}
                        <label style={descriptionLabelStyle}>Public subIDs: anyone can mint subIDs. Private subIDs: only you (owner) can mint subIDs</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Private SubIDs:</label>
                            <select id='isSubIDIssuancePrivate' style={inputStyle} >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                        <label style={descriptionLabelStyle}>NFT Token: tokenized onwership over currency ID</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>NFT Token:</label>
                            <select id='isNFTToken' style={inputStyle} >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                        {isBridgedERC20Block}
                        {preallocationsBlock}
                        {bridgedERC20TokenAddressBlock}
                        <label style={descriptionLabelStyle}>The registration fee for subIDs. The fee is always in the native currency (ie. this currency).</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>ID Registration Fee:</label>
                            <input id='idRegistrationFee' style={inputStyle} type="text" placeholder="0.0" />
                        </div>
                        <button style={buttonStyle} type='submit'>Create Currency</button>
                    </form>
                    {QRCode}
                    {defineCurrencyCommand}
				</div>
			</>
		)
	}
}