import mongoose, { SchemaTypes } from "mongoose";

/*
    My Assumptions;
    - Any transaction performed using debit card will be an checking account transaction
    - Money must be moved from saving to checking before 
        it can go to other user's account

    - Transactions types;
        - saving to checking(same account)
        - checking to saving(same account)
        - debit/checking to another user's checking account
        - credit to another user(business or regular) checking account
*/

/*
    - This collection will be huge, so we can create an index on accountNumber 
*/

const TransactionSchema = new mongoose.Schema({
    // origin from user can be checking, saving/debit, credit
    accountNumber: { type: BigInt, required: true },
    cardNUmber:  {type: BigInt, required: false },

    // debit(incoming) or credit(outgoing) (so, no need for different incoming and outgoing transactin types)
    transactionType: { type: String, required: true },
    // if debit(incoming) will represent from which account
    // if credit(outgoing) will represent to which account
    // *the name can be improved
    transactionToFrom: { type: BigInt, required: true},
    // i don't think rounding money is good idea :)
    amount: { type: SchemaTypes.Decimal128, required: true },
    currency: { type: String, required: true },
    transactionTime: { type: Date, required: true },
    // pending/complete: will be used in split bill and request payment features
    status: { type: String, required: true}
})