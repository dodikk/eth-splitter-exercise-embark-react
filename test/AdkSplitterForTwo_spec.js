

const BigNumber = require('bignumber.js');

// no *.sol extension is needed unlike truffle.js
// wasted some time debugging that
//
const AdkSplitterForTwo = embark.require("Embark/contracts/AdkSplitterForTwo");



let accounts;

var _samePerson    ; 
var _firstStranger ; 
var _secondStranger; 



config(

{
    contracts:
    {
        "AdkSplitterForTwo" :
        {
        }
    }
},

(_err, web3_accounts) =>
{
    accounts = web3_accounts;

    _samePerson = accounts[1]; // zero might be coinbase. avoiding that due to balance checks

    _firstStranger  = accounts[2];
    _secondStranger = accounts[3];
}

); // config


contract('AdkSplitterForTwo', 
function()
{

this.timeout(0);

it("should revert when fallback function is called", 
async function()
{
    var samePerson     = _samePerson    ;
    var firstStranger  = _firstStranger ;
    var secondStranger = _secondStranger;


    var initialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var initialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var initialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);


// https://github.com/embark-framework/embark/issues/362
//
// Currently, Embark doesn't have a deploy function 
// on Contracts imported like SimpleStorage.
//

    // .deploy().send() does not work for some reason
    var splitterContractInstance = AdkSplitterForTwo;
//        await AdkSplitterForTwo.deploy({ arguments: [] })
//                               .send();



// https://blog.status.im/embark-3-1-planet-express-60493ca0ad79
//
    assert.notEqual(AdkSplitterForTwo , null, JSON.stringify(AdkSplitterForTwo));
    assert.notEqual(AdkSplitterForTwo.methods , null, JSON.stringify(AdkSplitterForTwo));

    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");


// more verbose legacy syntax
//
//    var splitterInstanceAddress = 
//        await splitterContractInstance.methods
//                               .GetContractAddress()
//                               .call();

    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);


    var splitOpReceipt = null;

        try
        {
//            await splitterContractInstance.sendTransaction(


            splitOpReceipt =
            await web3.eth.sendTransaction(
            {
                to      : splitterInstanceAddress, 
                from    : samePerson             , 
                value   : 2000                   , 
                gasPrice: '0'
            });


// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/assertRevert.js
//=====
            assert.fail("expected revert function to terminate the contract");
            return;
       }
       catch (ex)
       {
           assert.equal(splitOpReceipt, null);


           var actualSenderBalance         = await web3.eth.getBalance(samePerson    );
           var actualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
           var actualSecondStrangerBalance = await web3.eth.getBalance(secondStranger);
           var actualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);



           assert.deepEqual(
               actualSenderBalance .toString(10),
               initialSenderBalance.toString(10),
               "unexpected sender balance change when split is supposed to do nothing");


           assert.deepEqual(
               actualFirstStrangerBalance.toString(10),
               initialFirstStrangerBalance.toString(10),
               "unexpected first balance change when split is supposed to do nothing");



           assert.deepEqual(
               actualSecondStrangerBalance.toString(10),
               initialSecondStrangerBalance.toString(10),
               "unexpected second balance change when split is supposed to do nothing");

          assert.deepEqual(
               actualContractBalance.toString(10),
               initialContractBalance.toString(10),
               "unexpected contract balance change");

       }

});






it("should revert undividable one wei", 
async function()
{
    var samePerson     = _samePerson    ;
    var firstStranger  = _firstStranger ;
    var secondStranger = _secondStranger;


    var initialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var initialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var initialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);


    var splitterContractInstance = AdkSplitterForTwo;

//    var splitterContractInstance = 
//        await AdkSplitterForTwo.deploy({ arguments: [] })
//                               .send();


    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");

    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);


    var splitOpReceipt = null;

        try
        {
	    splitOpReceipt =
            await splitterContractInstance.methods
            .Split(         
                samePerson, 
                samePerson) 
            .send(                    
            {                         
                from    : samePerson, 
                value   : 1         , 
                gasPrice: '0'
            });


// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/assertRevert.js
//=====
            assert.fail("expected revert function to terminate the contract");
            return;
       }
       catch (ex)
       {
           assert.equal(splitOpReceipt, null);

           var actualSenderBalance         = await web3.eth.getBalance(samePerson    );
           var actualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
           var actualSecondStrangerBalance = await web3.eth.getBalance(secondStranger);
           var actualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);



           assert.deepEqual(
               actualSenderBalance .toString(10),
               initialSenderBalance.toString(10),
               "unexpected sender balance change when split is supposed to do nothing");


           assert.deepEqual(
               actualFirstStrangerBalance.toString(10),
               initialFirstStrangerBalance.toString(10),
               "unexpected first balance change when split is supposed to do nothing");



           assert.deepEqual(
               actualSecondStrangerBalance.toString(10),
               initialSecondStrangerBalance.toString(10),
               "unexpected second balance change when split is supposed to do nothing");


          assert.deepEqual(
               actualContractBalance.toString(10),
               initialContractBalance.toString(10),
               "unexpected contract balance change");


       }

});



it("should revert undividable zero wei", 
async function()
{
    var samePerson     = _samePerson    ;
    var firstStranger  = _firstStranger ;
    var secondStranger = _secondStranger;


    var initialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var initialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var initialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);


    var splitterContractInstance = AdkSplitterForTwo;

//        var splitterContractInstance = 
//            await AdkSplitterForTwo.deployed();


    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");

    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);


        try
        {
	    var splitOpReceipt =
            await splitterContractInstance.methods
            .Split(         
                samePerson, 
                samePerson) 
            .send(                    
            {                         
                from    : samePerson, 
                value   : 0         , 
                gasPrice: '0'         
            });


// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/assertRevert.js
//=====
            assert.fail("expected revert function to terminate the contract");
            return;
       }
       catch (ex)
       {
           var actualSenderBalance         = await web3.eth.getBalance(samePerson    );
           var actualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
           var actualSecondStrangerBalance = await web3.eth.getBalance(secondStranger);
           var actualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);



           assert.deepEqual(
               actualSenderBalance .toString(10),
               initialSenderBalance.toString(10),
               "unexpected sender balance change when split is supposed to do nothing");


           assert.deepEqual(
               actualFirstStrangerBalance.toString(10),
               initialFirstStrangerBalance.toString(10),
               "unexpected first balance change when split is supposed to do nothing");



           assert.deepEqual(
               actualSecondStrangerBalance.toString(10),
               initialSecondStrangerBalance.toString(10),
               "unexpected second balance change when split is supposed to do nothing");

          assert.deepEqual(
               actualContractBalance.toString(10),
               initialContractBalance.toString(10),
               "unexpected contract balance change");


       }

});













    it("should create no transactions if all users are same", 
    async function()
    {
       var samePerson = _samePerson;

        var initialBalance = await web3.eth.getBalance(samePerson);


    var splitterContractInstance = AdkSplitterForTwo;


 //       var splitterContractInstance = 
 //           await AdkSplitterForTwo.deployed();


    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");

    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);


       
        try
        {
	    var splitOpReceipt =
            await splitterContractInstance.methods
            .Split(         
                samePerson, 
                samePerson) 
            .send(
            {
                from : samePerson, 
                value: 2000      , 
                gasPrice: '0'     
            });


// https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/assertRevert.js
//=====
            assert.fail("expected revert function to terminate the contract");
            return;
       }
       catch (ex)
       {
           var actualBalance = await web3.eth.getBalance(samePerson);
           var actualContractBalance = await web3.eth.getBalance(splitterInstanceAddress);



           assert.deepEqual(
               actualBalance .toString(10),
               initialBalance.toString(10),
               "unexpected balance change when split is supposed to do nothing");


          assert.deepEqual(
               actualContractBalance.toString(10),
               initialContractBalance.toString(10),
               "unexpected contract balance change");


       }

        // ??? revert ==> no transaction ==> no events
        // no transaction object to get tx.logs  from
        //
	// assert.fail("[debug] force fail to see the events log");

    });




it("should give equal shares to strangers", async function()
{
    var samePerson     = accounts[4]    ;
    var firstStranger  = _firstStranger ;
    var secondStranger = _secondStranger;



    var strInitialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strInitialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strInitialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);

    assert.notEqual(strInitialSenderBalance         , null, "sender balance is null");
    assert.notEqual(strInitialFirstStrangerBalance  , null, "sender balance is null");
    assert.notEqual(strInitialSecondStrangerBalance , null, "sender balance is null");


    // web3.eth.getBalance() returns a string in wei
    // as of web3.js v1.0.0
    //
    // https://web3js.readthedocs.io/en/1.0/web3-eth.html#getbalance
    //
    assert.equal(typeof strInitialSenderBalance        , "string", "string balance expected. Received : " + typeof initialSenderBalance);
    assert.equal(typeof strInitialFirstStrangerBalance , "string", "string balance expected. Received : " + typeof initialSenderBalance);
    assert.equal(typeof strInitialSecondStrangerBalance, "string", "string balance expected. Received : " + typeof initialSenderBalance);


    var initialSenderBalance         = new BigNumber(strInitialSenderBalance        );
    var initialFirstStrangerBalance  = new BigNumber(strInitialFirstStrangerBalance );
    var initialSecondStrangerBalance = new BigNumber(strInitialSecondStrangerBalance);


    var gasPriceWei   = 10000;
    var weiToSplit    = 2000 ;
    var strangerShare = 1000 ;


    var splitterContractInstance = AdkSplitterForTwo;
//    var splitterContractInstance = await AdkSplitterForTwo.deployed();

    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");

    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);



    var splitTransactionReceipt = null;
    try
    {
        // https://embark.status.im/tutorials/token_factory_1.html
        //

        splitTransactionReceipt =
        await splitterContractInstance.methods
         .Split(
             firstStranger , 
             secondStranger) 
         .send(
         {
             from    : samePerson , 
             value   : weiToSplit , 
             gasPrice: gasPriceWei.toString(10)
         });

    }
    catch (ex)
    {
        console.log(ex);
        assert.fail("unexpected exception generated by the contract" + ex);

        return;
    }


    var gasUsed_bn  = new BigNumber(splitTransactionReceipt.gasUsed);
    var gasPrice_bn = new BigNumber(gasPriceWei);
    var minerReward_bn = gasUsed_bn.multipliedBy(gasPrice_bn);



    var expectedSenderBalance = 
        initialSenderBalance.minus(weiToSplit)
                            .minus(minerReward_bn);

    var expectedFirstStrangerBalance  = 
        initialFirstStrangerBalance.plus(strangerShare);


    var expectedSecondStrangerBalance = 
        initialSecondStrangerBalance.plus(strangerShare);


    var strActualSenderBalance         = await web3.eth.getBalance(samePerson    ); 
    var strActualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger ); 
    var strActualSecondStrangerBalance = await web3.eth.getBalance(secondStranger); 
    var strActualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);

    var actualSenderBalance         = new BigNumber(strActualSenderBalance        ); 
    var actualFirstStrangerBalance  = new BigNumber(strActualFirstStrangerBalance ); 
    var actualSecondStrangerBalance = new BigNumber(strActualSecondStrangerBalance); 
    var actualContractBalance       = new BigNumber(strActualContractBalance      ); 



    assert.deepEqual(actualSenderBalance        .toString(10), expectedSenderBalance        .toString(10), "sender balance mismatch"         );
    assert.deepEqual(actualFirstStrangerBalance .toString(10), expectedFirstStrangerBalance .toString(10), "first stranger balance mismatch" );
    assert.deepEqual(actualSecondStrangerBalance.toString(10), expectedSecondStrangerBalance.toString(10), "second stranger balance mismatch");

    assert.deepEqual(
         actualContractBalance.toString(10),
         initialContractBalance.toString(10),
         "unexpected contract balance change");


    // https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
    //
    var events = splitTransactionReceipt.events;
    var eventsCount = Object.keys(events).length;
    assert.equal(6, eventsCount);

    assert.notEqual(events["LogBeginSplit"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogEndSplit"], null, JSON.stringify(splitTransactionReceipt));


    assert.equal(events["LogBeginSplit"                   ].logIndex, 0, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverBegin" ].logIndex, 1, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverEnd"   ].logIndex, 2, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverBegin"].logIndex, 3, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverEnd"  ].logIndex, 4, "exact events order check failed");
    assert.equal(events["LogEndSplit"                     ].logIndex, 5, "exact events order check failed");


});


it("should give equal shares to strangers -- odd amount", async function()
{
    var samePerson     = _samePerson    ;
    var firstStranger  = _firstStranger ;
    var secondStranger = _secondStranger;

    assert.notEqual(samePerson    , null, "sender address is null");
    assert.notEqual(firstStranger , null, "first receiver address is null");
    assert.notEqual(secondStranger, null, "second receiver address is null");



    var strInitialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strInitialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strInitialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);

    assert.notEqual(strInitialSenderBalance         , null, "sender balance is null");
    assert.notEqual(strInitialFirstStrangerBalance  , null, "sender balance is null");
    assert.notEqual(strInitialSecondStrangerBalance , null, "sender balance is null");


    // web3.eth.getBalance() returns a string in wei
    // as of web3.js v1.0.0
    //
    // https://web3js.readthedocs.io/en/1.0/web3-eth.html#getbalance
    //
    assert.equal(typeof strInitialSenderBalance        , "string", "string balance expected. Received : " + typeof initialSenderBalance);
    assert.equal(typeof strInitialFirstStrangerBalance , "string", "string balance expected. Received : " + typeof initialSenderBalance);
    assert.equal(typeof strInitialSecondStrangerBalance, "string", "string balance expected. Received : " + typeof initialSenderBalance);


    var initialSenderBalance         = new BigNumber(strInitialSenderBalance        );
    var initialFirstStrangerBalance  = new BigNumber(strInitialFirstStrangerBalance );
    var initialSecondStrangerBalance = new BigNumber(strInitialSecondStrangerBalance);



    var weiToSplit    = 15;
    var strangerShare = 7 ;

    var splitterContractInstance = AdkSplitterForTwo;
//    var splitterContractInstance = await AdkSplitterForTwo.deployed();

    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");


    var initialContractBalance  = await web3.eth.getBalance(splitterInstanceAddress);
    var actualContractBalance   = await web3.eth.getBalance(splitterInstanceAddress);



    var splitTransactionReceipt = null;
    try
    {
        splitTransactionReceipt =
        await splitterContractInstance.methods
         .Split(
             firstStranger,  
             secondStranger) 
         .send(
         {
             from    : samePerson , 
             value   : weiToSplit , 
             gasPrice: '0'          
         });
    }
    catch (ex)
    {
        console.log(ex);
        assert.fail("unexpected exception generated by the contract");

        return;
    }



    var expectedSenderBalance         = initialSenderBalance.minus(2 * strangerShare);
    var expectedFirstStrangerBalance  = initialFirstStrangerBalance.plus(strangerShare);
    var expectedSecondStrangerBalance = initialSecondStrangerBalance.plus(strangerShare);


    var strActualSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strActualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strActualSecondStrangerBalance = await web3.eth.getBalance(secondStranger);
    var strActualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);


    var actualSenderBalance         = new BigNumber(strActualSenderBalance        ); 
    var actualFirstStrangerBalance  = new BigNumber(strActualFirstStrangerBalance ); 
    var actualSecondStrangerBalance = new BigNumber(strActualSecondStrangerBalance); 
    var actualContractBalance       = new BigNumber(strActualContractBalance      ); 



    assert.deepEqual(actualSenderBalance        .toString(10), expectedSenderBalance        .toString(10), "sender balance mismatch"         );
    assert.deepEqual(actualFirstStrangerBalance .toString(10), expectedFirstStrangerBalance .toString(10), "first stranger balance mismatch" );
    assert.deepEqual(actualSecondStrangerBalance.toString(10), expectedSecondStrangerBalance.toString(10), "second stranger balance mismatch");

    assert.deepEqual(
         actualContractBalance.toString(10),
         initialContractBalance.toString(10),
         "unexpected contract balance change");




    // https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
    //
    var events = splitTransactionReceipt.events;
    var eventsCount = Object.keys(events).length;
    assert.equal(8, eventsCount);

    assert.notEqual(events["LogBeginSplit"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferChangeToSenderBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferChangeToSenderEnd"  ], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogEndSplit"], null, JSON.stringify(splitTransactionReceipt));


    assert.equal(events["LogBeginSplit"                   ].logIndex, 0, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverBegin" ].logIndex, 1, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverEnd"   ].logIndex, 2, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverBegin"].logIndex, 3, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverEnd"  ].logIndex, 4, "exact events order check failed");
    assert.equal(events["LogTransferChangeToSenderBegin"  ].logIndex, 5, "exact events order check failed");
    assert.equal(events["LogTransferChangeToSenderEnd"    ].logIndex, 6, "exact events order check failed");
    assert.equal(events["LogEndSplit"                     ].logIndex, 7, "exact events order check failed");


});





it("should make only one transaction if first receiver is same as sender", async function()
{
    var samePerson     = accounts[5]    ;
    var firstStranger  = samePerson     ;
    var secondStranger = _secondStranger;


    var weiToSplit    = 2000 ;
    var strangerShare = 1000 ;


    var strInitialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strInitialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strInitialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);


    var initialSenderBalance         = new BigNumber(strInitialSenderBalance        ); 
    var initialFirstStrangerBalance  = new BigNumber(strInitialFirstStrangerBalance ); 
    var initialSecondStrangerBalance = new BigNumber(strInitialSecondStrangerBalance); 



    var splitterContractInstance = AdkSplitterForTwo;


    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");


    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);



    var splitTransactionReceipt = null;
    try
    {
        splitTransactionReceipt =
        await splitterContractInstance.methods
        .Split(
            firstStranger,
            secondStranger)
        .send(
         {
             from    : samePerson ,
             value   : weiToSplit ,
             gasPrice: '0'
         });
    }
    catch (ex)
    {
        console.log(ex);
        assert.fail("unexpected exception generated by the contract");

        return;
    }


    var expectedFirstStrangerBalance  = initialFirstStrangerBalance.minus(strangerShare);
    var expectedSenderBalance         = expectedFirstStrangerBalance;
    var expectedSecondStrangerBalance = initialSecondStrangerBalance.plus(strangerShare);


    var strActualSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strActualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strActualSecondStrangerBalance = await web3.eth.getBalance(secondStranger);
    var strActualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);


    var actualSenderBalance         = new BigNumber(strActualSenderBalance        ); 
    var actualFirstStrangerBalance  = new BigNumber(strActualFirstStrangerBalance ); 
    var actualSecondStrangerBalance = new BigNumber(strActualSecondStrangerBalance); 
    var actualContractBalance       = new BigNumber(strActualContractBalance      ); 




    assert.deepEqual(actualSenderBalance        .toString(10), expectedSenderBalance        .toString(10), "sender balance mismatch"         );
    assert.deepEqual(actualFirstStrangerBalance .toString(10), expectedFirstStrangerBalance .toString(10), "first stranger balance mismatch" );
    assert.deepEqual(actualSecondStrangerBalance.toString(10), expectedSecondStrangerBalance.toString(10), "second stranger balance mismatch");


    assert.deepEqual(
         actualContractBalance.toString(10),
         initialContractBalance.toString(10),
         "unexpected contract balance change");



    var events = splitTransactionReceipt.events;
    assert.notEqual(events, null, JSON.stringify(splitTransactionReceipt));


    // https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
    //
    var eventsCount = Object.keys(events).length;
    assert.equal(6, eventsCount);

    assert.notEqual(events["LogBeginSplit"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogEndSplit"], null, JSON.stringify(splitTransactionReceipt));


    assert.equal(events["LogBeginSplit"                   ].logIndex, 0, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverBegin" ].logIndex, 1, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverEnd"   ].logIndex, 2, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverBegin"].logIndex, 3, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverEnd"  ].logIndex, 4, "exact events order check failed");
    assert.equal(events["LogEndSplit"                     ].logIndex, 5, "exact events order check failed");

});




it("should make only one transaction if second receiver is same as sender", async function()
{
    var samePerson     = accounts[6]    ;
    var firstStranger  = _firstStranger ;
    var secondStranger = samePerson     ;


    var weiToSplit    = 2000 ;
    var strangerShare = 1000 ;


    var strInitialSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strInitialFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strInitialSecondStrangerBalance = await web3.eth.getBalance(secondStranger);


    var initialSenderBalance         = new BigNumber(strInitialSenderBalance        ); 
    var initialFirstStrangerBalance  = new BigNumber(strInitialFirstStrangerBalance ); 
    var initialSecondStrangerBalance = new BigNumber(strInitialSecondStrangerBalance); 





    var splitterContractInstance = AdkSplitterForTwo;
//    var splitterContractInstance = await AdkSplitterForTwo.deployed();

    var splitterInstanceAddress = 
        await splitterContractInstance.methods
                                      .GetContractAddress()
                                      .call();
    assert.notEqual(splitterInstanceAddress, null, "instance address is null");

    var initialContractBalance  = 
        await web3.eth.getBalance(splitterInstanceAddress);




    var splitTransactionReceipt = null;
    try
    {
        splitTransactionReceipt =
        await splitterContractInstance.methods
        .Split(
            firstStranger,
            secondStranger)
        .send(
         {
             from    : samePerson ,
             value   : weiToSplit ,
             gasPrice: '0'
         });
    }
    catch (ex)
    {
        console.log(ex);
        assert.fail("unexpected exception generated by the contract");

        return;
    }


    var expectedFirstStrangerBalance  = initialFirstStrangerBalance.plus(strangerShare);
    var expectedSecondStrangerBalance = initialSecondStrangerBalance.minus(strangerShare);
    var expectedSenderBalance         = expectedSecondStrangerBalance;



    var strActualSenderBalance         = await web3.eth.getBalance(samePerson    );
    var strActualFirstStrangerBalance  = await web3.eth.getBalance(firstStranger );
    var strActualSecondStrangerBalance = await web3.eth.getBalance(secondStranger);
    var strActualContractBalance       = await web3.eth.getBalance(splitterInstanceAddress);


    var actualSenderBalance         = new BigNumber(strActualSenderBalance        ); 
    var actualFirstStrangerBalance  = new BigNumber(strActualFirstStrangerBalance ); 
    var actualSecondStrangerBalance = new BigNumber(strActualSecondStrangerBalance); 
    var actualContractBalance       = new BigNumber(strActualContractBalance      ); 





    assert.deepEqual(actualSenderBalance        .toString(10), expectedSenderBalance        .toString(10), "sender balance mismatch"         );
    assert.deepEqual(actualFirstStrangerBalance .toString(10), expectedFirstStrangerBalance .toString(10), "first stranger balance mismatch" );
    assert.deepEqual(actualSecondStrangerBalance.toString(10), expectedSecondStrangerBalance.toString(10), "second stranger balance mismatch");


    assert.deepEqual(
         actualContractBalance.toString(10),
         initialContractBalance.toString(10),
         "unexpected contract balance change");




    var events = splitTransactionReceipt.events;
    assert.notEqual(events, null, JSON.stringify(splitTransactionReceipt));


    // https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
    //
    var eventsCount = Object.keys(events).length;
    assert.equal(6, eventsCount);

    assert.notEqual(events["LogBeginSplit"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToFirstReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverBegin"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogTransferToSecondReceiverEnd"], null, JSON.stringify(splitTransactionReceipt));
    assert.notEqual(events["LogEndSplit"], null, JSON.stringify(splitTransactionReceipt));


    assert.equal(events["LogBeginSplit"                   ].logIndex, 0, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverBegin" ].logIndex, 1, "exact events order check failed");
    assert.equal(events["LogTransferToFirstReceiverEnd"   ].logIndex, 2, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverBegin"].logIndex, 3, "exact events order check failed");
    assert.equal(events["LogTransferToSecondReceiverEnd"  ].logIndex, 4, "exact events order check failed");
    assert.equal(events["LogEndSplit"                     ].logIndex, 5, "exact events order check failed");


});





}); // contract

