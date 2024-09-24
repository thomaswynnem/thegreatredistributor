// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


interface ERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract TetherTrader {

    struct Trader {
        address publicAddress;
        uint winnings;
        bool acceptance;
    }


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);


    address private constant TETHER_CONTRACT_ADDRESS = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    

    ERC20 private tether = ERC20(TETHER_CONTRACT_ADDRESS);

    function findTeth(address _addy) public view returns(uint) {
        uint _teth = tether.balanceOf(_addy);
        return _teth;
    }

    mapping(address => uint256) public maxRetrieval;

    function requestedReturns(address _addy, uint256 money) external {
        require(msg.sender == _addy, "Requester != Adjusted Address");
        uint256 contractBalance = findTeth(address(this));
        require(contractBalance >= money);

        maxRetrieval[_addy] = money;
    }

    
    function potUSDT(address _from, uint256 _amount) external {
        
        require (msg.sender == _from, "Requester != Destination");

        require (findTeth(_from) >= _amount, "Not enough Tether in your wallet");
       
        tether.transferFrom(_from, address(this), _amount);

        emit Transfer(_from, address(this), _amount);
    }

    function withdrawalUSDT(address _to, uint256 _amount) internal {
        require(maxRetrieval[_to] >= _amount, "Real slick pal");
        maxRetrieval[_to] -= _amount;
        tether.transfer(_to, _amount);

        emit Transfer(address(this), _to, _amount);

    }

    function totalFundWinnings(Trader[] memory traders) public pure returns(uint256) {
        uint totalFunds = 0;
        for(uint i = 0; i < traders.length; i++) {
            totalFunds += traders[i].winnings;
        }
        return totalFunds;
    }

    function totalAcceptance(Trader[] memory traders) public pure returns(bool) {
        for(uint i = 0; i < traders.length; i++) {
            if (!traders[i].acceptance){
                return false;
            }
        }
        return true;
    }

    function TheGreatDistribution(Trader[] memory traders) public {
        uint totalTether = findTeth(address(this));
        require(totalTether >= totalFundWinnings(traders), "Redistribution Quantities Flawed");
        require(totalAcceptance(traders) == true, "Not all traders accepted!");

        for (uint i = 0; i < traders.length; i++){

            withdrawalUSDT(traders[i].publicAddress, traders[i].winnings);
        }
    }
}