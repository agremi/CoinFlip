pragma solidity 0.5.12;

contract CoinFlip{

  address public contractOwner;

  struct Bet{
    address payable player;
    uint256 headOrTail;
    uint amount;
    bool result;
    bool played;
  }
  mapping(address => Bet) private bets;
  uint256 private balance;

  constructor() public {
    contractOwner = msg.sender;
  }

  modifier requireFunds(){
    require(address(this).balance >= uint256(msg.value)*2, "balance is too low");
    _;
  }
  modifier costs (uint cost){
    require(msg.value >= cost,"you need money to play");
    _;
  }
  function placeBet(uint256 _headOrTail) public payable costs(1 ether) requireFunds() {
    require(_headOrTail == 0 || _headOrTail == 1 );
    Bet memory newBet = Bet(msg.sender, _headOrTail, msg.value, false,false);
    bets[msg.sender] = newBet;
    randomFlip();
  }

  function randomFlip() internal returns(bool){
    uint256 result = now%2;
    Bet memory bet = bets[msg.sender];

    if(bet.headOrTail == result){
        bets[msg.sender].player.transfer(bet.amount*2);
        balance -= uint256(msg.value);
        return true;
    }else {
      balance += uint256(msg.value);
      return false;
    }
  }

    function getBet() view public returns(address player, uint256 headOrTail, uint amount, bool result){
    Bet memory bet = bets[msg.sender];
    return(bet.player, bet.headOrTail, bet.amount, bet.result);
  }
  //da rivedere
  function feedContract(uint256 _amount) public payable {
    balance +=_amount;
  }
}
