import React, { Component } from "react";
import axios from 'axios';
import { QRCodeCanvas } from "qrcode.react";
import Wizard from './Wizard.js';



export default class Main extends Component {

	constructor(props) {
		super(props);
		this.state = {
            rawUnsignedTxnHex: '',
            defineCurrencyCommand: '',
		};
        this.createCurrency = this.createCurrency.bind(this);
	}

    createCurrency = async (params) => {
        try {
            console.log('Create Currency Params:', params);
            
            //TODO: validate inputs, make API call to get definecurrency command and raw unsigned txn hex
            let requestParams = {
                currencyName: params.currencyName,
                mappedCurrencies: params.singleCurrency ? [params.singleCurrency] : (params.currencies && params.currencies.length) ? params.currencies : null,
                currencyAmounts: params.amount && params.amounts.length ? params.amounts : null,
                idRegistrationFees: params.idRegistrationFee,
                preAllocations: params.preAllocations && params.preAllocations.length ? params.preAllocations : null,
                isSubIDIssuancePrivate: params.isSubIDIssuancePrivate,
                isLiquidityPool: params.currencyType === 'LPToken' ? true : false,
                isCentralized: params.isCentralized,
                isERC20BridgedCurrency: params.currencyType === 'BridgedERC20' ? true : false,
                ERC20TokenAddress: params.bridgedERC20TokenAddress ? params.bridgedERC20TokenAddress : null,
            }
            console.log('API Call Params:', requestParams)
            const response = await axios.post('http://52.13.27.118:5001/createVerusCurrency', requestParams);
            console.log(response);
            this.setState({defineCurrencyCommand: response.data.defineCurrencyCommand, rawUnsignedTxnHex: response.data.rawUnsignedTxHex.result ? response.data.rawUnsignedTxHex.result.hex.slice(0,200) : response.data.rawUnsignedTxnHex});

        } catch (error) {
            console.error(error);
        }
    }
    

	render() {

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

		return (
			<>
				<div style={{height:'100vh', width:'100vw', backgroundColor:'#000000', color:'#ffffff', display:'flex', alignItems:'center', flexDirection:'column', overflowY:'scroll'}}>
					<h1 style={{marginTop:'5vh'}}>Verus Currency Builder</h1>
                    <h4 style={{marginTop:'1vh', width:'40%'}}>This is an interactive tool to help define currencies. Simply fill out the form, and it will generate the appropriate daemon command, 
                    as well as an unsigned raw transaction hex that can be signed and uploaded to the blockchain.</h4>
                    <Wizard createCurrency={this.createCurrency}/>
                    {QRCode}
                    {defineCurrencyCommand}
				</div>
			</>
		)
	}
}