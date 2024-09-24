const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

const port = 3001;

const uri = process.env.MONGODB_CONNECT;

const User = require('./user');

mongoose.connect(uri, {
    })

const connection = mongoose.connection

connection.once("open", () => {
    console.log("MONGODB connected")
})

app.post("/user", async (req,res) => {
    try {
        console.log("req.body: ", req.body);
        const { userWallet } = req.body;
        let user = await User.findOne({ userWallet });
        if (!user) {
            user = new User({
                userWallet: userWallet,
                userEmail: '',
                transactions: [],
                userReturns: 0,
                userName: '',
                decision: 0,
            });
        } 
        await user.save(); 
        res.send("User Added/Updated");
    } catch(err) {
        console.log("Error: ", err)
    }
})

app.post("/submission", async (req,res) => {
    try {
        console.log("req.body: ", req.body);
        const { userWallet, amount } = req.body;
        let user = await User.findOne({ userWallet });
        if (!user) {
            res.send("Do you even exist?");
        } else{
            user.transactions.push({ amount });
            await user.save();    
            res.send("User Added/Updated");
        }
        }
    catch(err) {
        res.send("Error: ", err)
    }
})

app.post("/username", async (req,res) => {
    try {
        console.log("req.body: ", req.body);
        const { userWallet, userName} = req.body;
        let user = await User.findOne({ userWallet });
        if (!user) {
            console.log("Do you even exist?");
        } else{
            user.userName =  userName
            await user.save(); 
            res.send("Username updated")
        }
        } catch (err) {
            console.log('Error:', err)
        }
})

const getSubmissionForWallet = async (wallet) => {
    try {
        const transactions = await User.aggregate([
            { $match: { userWallet: wallet } },
            { $unwind: "$transactions" },
            { $sort: { "transactions.timeStamp": -1 } },
            { $project: {
                _id: 0,
                amount: "$transactions.amount"

            }}
        ]);
        const amounts = transactions.map(transaction => transaction.amount);
        return amounts;
    } catch (err) {
        console.error('Error retrieving most recent submission:', err);
        return null;
    }
};

app.get('/mostRecent/:wallet', async (req, res) => {
    try {
        const wallet = req.params.wallet;
        const amounts = await getSubmissionForWallet(wallet);
        if (amounts.length > 0) {
            res.json(amounts);
        } else {
            res.status(404).send('User or transactions not found');
        }
    } catch (err) {
        res.status(500).send('Error retrieving data');
    }
});

app.post('/moneyreturned', async (req, res) => {
    try {
        const { userWallet } = req.body;
        const user = await User.findOne({ userWallet });
        if (!user) {
            return res.status(404).send('User not found');
        }
         
        try {
            let result = await User.deleteOne({userWallet}) 
            if (result ===1){
                res.send('Deletion successful')
            }
            else{
                res.send('Smells like account denletion failure')
            }
        } catch(err) {
            res.status(500).send('Error in account deletion', err);
        }
    } catch (err) {
        console.error('Error processing money-back request:', err);
        res.status(500).send('Error processing request');
    }
});

app.get('/allusers', async (req, res) => {
    try {
        const users = await User.find({}, 'userWallet -_id');
        const wallets = users.map(user => user.userWallet);
        res.json(wallets);
    } catch (err) {
        console.error('Error retrieving all users:', err);
        res.status(500).send('Error retrieving users');
    }
});

app.get('/specifiedusername', async (req,res) => {
    try{
        const { userWallet } = req.query;
        const user = await User.findOne({ userWallet });
        if (!user) {
            return res.status(404).send('User not found');
        }else {
            const userName = user.userName;
            return res.send(userName);
        }
    } catch (err) {
        console.error('Error retrieving username:', err);
        return res.status(500).send('Server error');
    }
});

app.post('/userreturns', async(req,res) => {
    try {
        const { userWallet, userReturns } = req.body;
        const user = await User.findOne({ userWallet });
        if (!user) {
            return res.status(404).send('User not found');
        } else {
            user.userReturns = userReturns
            await user.save();
            res.send('User Request Submitted');
        }
    } catch (err) {
        console.error('Error processing money-back request:', err);
        res.status(500).send('Error processing request');
    }
});

app.get('/userinreqs', async(req,res) => {
try{
    const {userWallet} = req.query
    const user = await User.findOne({ userWallet });
    if (!user) {
        return res.status(404).send('User not found');
    } else {
        const userReturns = user.userReturns;
        return res.json(userReturns);
    }
} catch (err) {
    console.error('Error retrieving username:', err);
    return res.status(500).send('Server error');
    }
});

app.post('/decisioning', async(req,res) => {
    try{
        const { userWallet, decision } = req.body;
        const user = await User.findOne({ userWallet });
        if (!user) {
            return res.status(404).send('User not found');
        } else {
            user.decision = decision;
            await user.save();
            res.send('Decision Updated')
        }
        } catch (err) {
            console.error('Error processing decision:', err);
            res.status(500).send('Error processing decision');
        }
});

app.get('/decisionresult', async(req,res) => {
    try {
        const {userWallet} = req.query;
        const user = await User.findOne({userWallet})
        if (!user){
            res.send('User not found')
        } else {
            const decision = user.decision
            return res.json(decision)
        }
    } catch(err) {
        res.send('Error in finding decision: ', err)
    }
})

app.post('/destruction', async(req,res) => {
    try {
        const {userWallet} = req.body;
        const user = await User.findOne({userWallet})
        if (!user) {
            res.send('User not found')
        } else {
            user.transactions  = [];
            user.userReturns = 0;
            user.decision = 0;
            await user.save();
            res.send('Details Deleted')
        }
        } catch (err) {
            res.status(500).send('Error processing deletion');
        }
})
    


app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
})