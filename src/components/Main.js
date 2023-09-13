import React, { Component } from "react";



export default class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
            isMappedCurrency: false,
            isLP: false,
            isBridgedERC20: false,
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
            const currencyName = document.getElementById('currencyName').value;
            const isMapped = document.getElementById('isMapped').value;
            const isLiquidityPool = document.getElementById('isLiquidityPool').value;
            const isCentralized = document.getElementById('isCentralized').value;
            const isSubIDIssuancePrivate = document.getElementById('isSubIDIssuancePrivate').value;
            const isNFTToken = document.getElementById('isNFTToken').value;
            const preAllocations = document.getElementById('preAllocations').value;
            const currencies = document.getElementById('currencies').value;
            const isBridgedERC20 = document.getElementById('isBridgedERC20').value;
            const bridgedERC20TokenAddress = document.getElementById('bridgedERC20TokenAddress').value;
            //TODO: validate inputs, make API call to get definecurrency command and raw unsigned txn hex
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
        if (this.state.isLP || this.state.isMappedCurrency) { // currencies param is only needed if LP or mapped
            currenciesBlock = (
                <>
                    <label style={descriptionLabelStyle}>Currencies: Comma seperated list of currency names to include in LP or map to. Must only contain 1 currency if it is a Mapped Currency.</label>
                    <div style={{display:'flex', flexDirection:'row'}}>
                        <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Currencies:</label>
                        <input id='currencies' style={inputStyle} type="text" placeholder="IvanCoin, MonkinsCoin, AlexCoin" required />
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
                        {liquidityPoolBlock}
                        {currenciesBlock}
                        {centralizedBlock}
                        <label style={descriptionLabelStyle}>Public subIDs: anyone can mint subIDs. Private subIDs: only you (owner) can mint subIDs</label>
                        <div style={{display:'flex', flexDirection:'row'}}>
                            <label style={{marginBottom:'2vh', marginRight:'1vh'}}>Public SubIDs:</label>
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
				</div>
			</>
		)
	}
}