// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Defi} from "../src/Counter.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
contract CounterTest is Test {
Defi public defi;

    function setUp() public {
        IERC20 token = IERC20(0x8Ab1C13dfB3FCc4b834ef5c08503e2711f569708);
        defi = new Defi(token);  // Now this will work
       
    }

function test_Reserve()public view{
    console.log("ETHreserve:",defi.ethReserve());
    console.log("Token Reserve:",defi.tokenReserve());
}
}
