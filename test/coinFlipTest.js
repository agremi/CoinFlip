const CoinFlip = artifacts.require("CoinFlip");
const truffleAssert = require("truffle-assertions");

contract("CoinFlip", async function(accounts){
  let instance;

  before(async function (){
    instance = await CoinFlip.deployed();
    await instance.feedContract(15,{value: web3.utils.toWei('15','ether'),from: accounts[5]});
  })
  it("should create a new bet", async function(){
    await instance.placeBet(1,{ from: accounts[1], value: web3.utils.toWei("1", "ether")});
  })
  it("should not create a new bet without value", async function(){
    await truffleAssert.fails(instance.placeBet(1));
  })
  it("should not create a bet if the balance is insufficient", async function(){
    await truffleAssert.fails(instance.placeBet(1,{value: web3.utils.toWei("30","ether")}));
  })
  it ("should set player's address correctly", async function (){
    await instance.placeBet(1,{from: accounts[0], value: web3.utils.toWei("1","ether")});
    let thisBet = await instance.getBet();
    assert(thisBet.player == "0xfEEB85F556df20752fFD6aD5a9f47d43EbD65E75");
  })
  it("should set player's choice correctly TRUE", async function(){
    await instance.placeBet(1, {value: web3.utils.toWei("1","ether")});
    let thisBet = await instance.getBet();
    assert(thisBet.headOrTail == 1);
  })
  it("should set player's choice correctly FALSE", async function(){
    await instance.placeBet(0, {value: web3.utils.toWei("1","ether")});
    let thisBet = await instance.getBet();
    assert(thisBet.headOrTail == 0);
  })
  it("should fail if a number different from zero or one is chosen", async function(){
    await truffleAssert.fails(instance.placeBet(567,{value: web3.utils.toWei("1","ether")}));
  })
  it("should set bet amount correctly", async function(){
    await instance.placeBet(1, {value: web3.utils.toWei("1","ether")});
    let thisBet = await instance.getBet();
    assert(thisBet.amount ==  web3.utils.toWei("1","ether"));
  })

})
