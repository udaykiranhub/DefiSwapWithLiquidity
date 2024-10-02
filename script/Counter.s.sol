// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Defi} from "../src/Counter.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
contract CounterScript is Script {
    Defi public defi;
    function run() public {
        vm.startBroadcast();

        IERC20 token = IERC20(0x6Fe5D32cFc253deeb4E6fBbd4Ce436F1d68C696D);
        defi = new Defi(token);  // Now this will work

        vm.stopBroadcast();
    }
}
