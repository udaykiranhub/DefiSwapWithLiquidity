
import Web3 from "web3";
import Button from 'react-bootstrap/Button';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
 
import { Alert, ButtonGroup } from "react-bootstrap";


import { useState } from "react";

import tokenAbi from "./token.json";

import { token } from "./addresses";
import Token from "./Token";
import "./connect.css"
function Connect(){

    const [web3Instance,setweb3Instance]=useState(null);
    const [contract,setContract]=useState(null);
    const [account,setAccount]=useState(null)
  const [message,setMessage]=useState(null);
//function to connect with block chain
    async function letconnect(){
   
        try{
    
    if(window.ethereum){
    
        setMessage(" Wallet Connected!");
        const web3=await new Web3(window.ethereum);
        await window.ethereum.request({method:"eth_requestAccounts"})
        const accounts=await web3.eth.getAccounts(0);
        setAccount(accounts[0])
        console.log("web3 instance is:",web3);
        setweb3Instance(web3);
    }
    else{
      alert("error in wallet connection")
        setMessage("Wallet Connected!");
        const web3=await new Web3("http://127.0.0.1:8545");
        setweb3Instance(web3);
        const accounts=await web3.eth.getAccounts(0);
        setAccount(accounts[0])
        console.log('Web instance is:',web3Instance);
    }
    
        }
        catch(err){
            console.log('Err:',err);
            setMessage("something went worng!")
      
        }
    }

    //connecting to the contract 
    async function connecTocontract(){
        try{
console.log("abi is:",tokenAbi);
const x= new  web3Instance.eth.Contract(tokenAbi.abi,token);
console.log("contract is:",x);

setMessage("Connected to Token!");
setContract(x);
        }
        catch(err){
  
            setMessage("failed to connect cotnract !")
            console.log('Errr:',err);
        }
    }



    return(

        <div className="connect">


            {message && <Alert variant="danger">{message}</Alert>}   
<Button variant="dark"   style={{width:"150px",color:'white' ,padding:'20px'}} onClick={letconnect}>Wallet</Button>
<br/>
<br/>
<Button variant="dark" style={{width:"150px",padding:'20px'}} onClick={connecTocontract}>MTK Token </Button>
{web3Instance && contract && <Token  web3={web3Instance} contract={contract} account={account}/>}




</div>
    )

}
export default Connect;