pragma solidity ^0.4.23;


contract AdkSplitterForTwo 
{
    event LogBeginSplit();
    event LogEndSplit();
    event LogSamePersonRevert();
    
    event LogTransferToFirstReceiverBegin();
    event LogTransferToFirstReceiverEnd();
    
    event LogTransferToSecondReceiverBegin();
    event LogTransferToSecondReceiverEnd();
    
    event LogTransferChangeToSenderBegin();
    event LogTransferChangeToSenderEnd();
    
    function () payable public
    {
        revert("the contract is not supposed to hold ether");
    }
    
    function GetContractAddress() 
        public
        constant
        returns (address result)
    {
        result = this;
    }
    
    function Split(
        address firstReceiver ,
        address secondReceiver) 
    public 
    payable
    {
        emit LogBeginSplit();
        
        // https://medium.com/blockchannel/the-use-of-revert-assert-and-require-in-solidity-and-the-new-revert-opcode-in-the-evm-1a3a7990e06e
        require(msg.value >= 2, "Not enough wei for splitting");
        
        // ???
        // require(msg.sender.balance >= msg.value, "Sender has insufficient wei");
        
        bool isAllActorsSamePerson = 
               (msg.sender == firstReceiver ) 
            && (msg.sender == secondReceiver);
        
        if (isAllActorsSamePerson)
        {
            assert(firstReceiver == secondReceiver);
            
            // seems like no work needs to be done
            // refund the gas to the sender
            
            revert("Sender and both receivers are same. Nothing to do. ==> reverting");
            emit LogSamePersonRevert();
            
            return;
        }
            
        uint fundsToSplit = msg.value;
        uint shareOfReceivers = fundsToSplit / 2;
        uint change = fundsToSplit - 2 * shareOfReceivers;
        assert(shareOfReceivers > 0);

        
        // if (msg.sender != firstReceiver)
        // {

            // still need to transfer back to the sender
            // because the sent ether now belongs to the contract

            emit LogTransferToFirstReceiverBegin();
            firstReceiver.transfer(shareOfReceivers);
            emit LogTransferToFirstReceiverEnd();
        // }
        
        // if (msg.sender != secondReceiver)
        // {

            // still need to transfer back to the sender
            // because the sent ether now belongs to the contract

            emit LogTransferToSecondReceiverBegin();
            secondReceiver.transfer(shareOfReceivers);
            emit LogTransferToSecondReceiverEnd();
        // }
        
        
        if (0 != change)
        {
            emit LogTransferChangeToSenderBegin();
            msg.sender.transfer(change);
            emit LogTransferChangeToSenderEnd();
        }
        
        
        emit LogEndSplit();
        
    } // function Split() 
    
} // contract AdkSplitterForTwo

