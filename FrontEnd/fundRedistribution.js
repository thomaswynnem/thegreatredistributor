const forwarderOrigin = 'http://localhost:5500'


const initialize = () => {

    
    
    const onBoardMetaMaskClient = async() => {
        if(!isMetaMaskInstalled()){
            console.log('MetaMask Not Installed!!!')
            metaConnect.value = "Install MetaMask"
            metaConnect.onclick = installMetaMask
        } else {
            console.log('MetaMask Installed... YEssssss')
            metaConnect.value = "Connect MetaMask"
            metaConnect.onclick = connectMetaMask
        }
    }
        

    const metaConnect = document.querySelector('.metaConnect')

    const isMetaMaskInstalled = () => {
            if (window.ethereum && window.ethereum.isMetaMask){
                return true;
            } else {
                return false;
            }
    }

    const installMetaMask = async () => {
            const onboarding = new MetaMaskOnboarding({forwarderOrigin})
            metaConnect.value = 'Installing...'
            metaConnect.disabled = true;
            onboarding.startOnboarding()
    }

    const connectMetaMask = async () => {
            metaConnect.disabled = true
            try {
                window.accounts = await ethereum.request({method: "eth_requestAccounts"});
                
                await switchToPolygonMainnet()
                
                
                metaConnect.value = "Connected";
                console.log("Accounts:", window.accounts);
                metaConnect.disabled = false;
                
                const web3 = new Web3(window.ethereum)
                window.web3 = web3
                saveWallet(window.accounts);
                secondary();
                
            }
            catch(err) {
                console.error('Error occured while connnecting MetaMask Wallet')
            }
    }



    onBoardMetaMaskClient()
    

    const secondary = () => {
        let contractABI = [];
        window.contractAddress = '0x0263c56cac0b35c713725ce40afb99f888a26104';
      
        

        async function fetchExternalFiles(contractAddress) {
            try{
                let response = await fetch('../contracts/abis/TheRedistributor.json');
                const data = await response.json();
                contractABI = await data.abi;
                console.log(contractABI)
                loadContract(contractABI, contractAddress);
            }
            catch(error) {
                console.error(error)
            }
            
          }
      
        fetchExternalFiles(window.contractAddress)

        const loadContract = async (ABI, Address) => {
            try{
                window.contract = new window.web3.eth.Contract(ABI, Address);
                console.log(window.contract) 
                window.tetherAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
                let response = await fetch('tetherABI.json');
                const tetherABI = await response.json();
                
    
            
                window.tetherContract = new window.web3.eth.Contract(tetherABI, window.tetherAddress);
                console.log(tetherContract)
                
                   
            }
            catch(err) {console.error(err)}
            }
        usingsmartcon();
        }
    }

    

const usingsmartcon = async () => {
        
        const smartregion = document.querySelector('.smartcontractbutton');
        smartregion.style.color = '#39FF14'
        const smartbutton = document.createElement('button');
        smartbutton.style.background = '#000000';
        smartbutton.style.color = '#39FF14';
        smartbutton.textContent = "Use Smart Contract"
        smartregion.append(smartbutton);
        smartbutton.addEventListener('click', openingprompts)


            
    }
    
    
const openingprompts = async () => {
        const potvalarea = document.querySelector('#value')
        let potval = await window.contract.methods.findTeth(window.contractAddress).call()
        potvalarea.style.color = "#39FF14"
        potvalarea.textContent = `Value of Tether in Pot: $${potval/10**6}`
        const thisrefresh = document.createElement('button')
        thisrefresh.textContent = 'Refresh Total Pot Size'
        thisrefresh.style.color = '#39FF14'
        thisrefresh.style.background ='#000000'
        thisrefresh.addEventListener('click', async() => {
            let potval = await window.contract.methods.findTeth(window.contractAddress).call()
            potvalarea.textContent = `Value of Tether in Pot: $${potval/10**6}`
            potvalarea.append(thisrefresh)
        })
        potvalarea.append(thisrefresh)


        
        document.querySelector('.smartcontractbutton').textContent = "Smart Contract Operational"
        

        const usernamearea = document.querySelector('.namer');

        const usernameQ = document.createElement('form');

        const nameInput = document.createElement("input");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("name", "username");
        nameInput.style.background='#000000'
        nameInput.style.color = '#39FF14'
        nameInput.style.height = '30px'
        nameInput.style.width='200px'
        nameInput.style.margin='10px'
        nameInput.value = 'Add/Adjust Username'
        usernameQ.append(nameInput);

        
        const usernamesubmit = document.createElement("button");
        usernamesubmit.textContent = "Submit";
        usernamesubmit.setAttribute("type", "submit");
        usernamesubmit.style.background ='#000000'
        usernamesubmit.style.color='#39FF14'
        usernamesubmit.style.height = '30px'
        usernamesubmit.style.width='75px'
        usernamesubmit.style.margin='10px'
        usernameQ.append(usernamesubmit);
        

        usernamearea.append(usernameQ)

        usernameQ.addEventListener("submit", (event) => addUsername(event, window.accounts[0], nameInput.value))
        
        const tetherpromptarea = document.querySelector('.smartcontracttetherprompt')
        
        const tetherquestion = document.createElement('button');
        tetherquestion.style.background='#000000';
        
        tetherquestion.textContent = "Tether Tracker";
        tetherquestion.style.color = '#39FF14';
        tetherquestion.style.width = '75px';
        tetherquestion.style.height ='75px';
        tetherquestion.style.padding = '20px'
        tetherquestion.style.margin = '10px'
        
        tetherpromptarea.append(tetherquestion);
        tetherquestion.addEventListener('click', findTether)

        //How much Tether will I add?
        const potter = document.querySelector('.potter')
        const potterquestion = document.createElement('form');

        const moneyInput = document.createElement("input");
        moneyInput.setAttribute("type", "text");
        moneyInput.setAttribute("name", "moneyAmount");
        moneyInput.style.background='#000000'
        moneyInput.style.color = '#39FF14'
        moneyInput.style.height = '30px'
        moneyInput.style.width='200px'
        moneyInput.style.margin='10px'
        moneyInput.value = 'Submit Tether to the Pot'
        potterquestion.append(moneyInput);

        
        const moneysubmit = document.createElement("button");
        moneysubmit.textContent = "Submit";
        moneysubmit.setAttribute("type", "submit");
        moneysubmit.style.background ='#000000'
        moneysubmit.style.color='#39FF14'
        moneysubmit.style.height = '30px'
        moneysubmit.style.width='75px'
        moneysubmit.style.margin='10px'
        potterquestion.append(moneysubmit);
        

        potter.append(potterquestion)

        potterquestion.addEventListener("submit", submitTether)

        //Give me back my Tether

        const returnOfTheTether = document.querySelector('.returnOfTheTether')
        const returnForm = document.createElement("form")

        const returninput = document.createElement('input');
        returninput.setAttribute("type", "text");
        returninput.setAttribute("name", "returnAmount");
        returninput.style.background='#000000'
        returninput.style.color = '#39FF14'
        returninput.style.height = '30px'
        returninput.style.width='200px'
        returninput.style.margin='10px'
        returninput.value = 'Request Winnings'
        returnForm.append(returninput)

        const returnsubmit = document.createElement("button");
        returnsubmit.textContent = "Submit";
        returnsubmit.setAttribute("type", "submit");
        returnsubmit.style.background ='#000000'
        returnsubmit.style.color='#39FF14'
        returnsubmit.style.height = '30px'
        returnsubmit.style.width='75px'
        returnsubmit.style.margin='10px'
        returnForm.append(returnsubmit);
        
        returnOfTheTether.append(returnForm);

        returnOfTheTether.addEventListener('submit', retrieveTether)

        const greaterpastArea = document.querySelector('.buttonforpast')
        const refresh = document.createElement("button");
        refresh.textContent = "refresh inputs";
        refresh.style.background ='#000000'
        refresh.style.color='#39FF14'
        refresh.style.height = '30px'
        refresh.style.width='75px'
        refresh.style.margin='10px'
        greaterpastArea.append(refresh);
        

        refresh.addEventListener('click', refreshInputs)


        const greaterfutureArea = document.querySelector('.buttonforfuture')
        const refresh2 = document.createElement("button");
        refresh2.textContent = "refresh requested outputs";
        refresh2.style.background ='#000000'
        refresh2.style.color='#39FF14'
        refresh2.style.height = '30px'
        refresh2.style.width='75px'
        refresh2.style.margin='10px'
        greaterfutureArea.append(refresh2);
        

        refresh2.addEventListener('click', creatingLedger)


    }

    
const findTether = async () => {
    try{
        let tetherFunds = await window.contract.methods.findTeth(window.accounts[0]).call();
        let tetherultra = await window.contract.methods.findTeth(window.contractAddress).call();
        document.querySelector('.answer').textContent = `Current Value of Tether in Wallet = ${tetherFunds/1000000}`;
        tetherultra = tetherultra/10**6
        console.log('Tether total in wallet: ', tetherultra)
    } catch (err) {
        console.log('Error with tether find: ', err)
    }
    }

    const submitTether = async (event) => {
        event.preventDefault();
        try {
            let money = parseFloat(event.target.moneyAmount.value);
            if (isNaN(money)) {
                throw new Error("Invalid input");
            }
            money = money * (10 ** 6)
            console.log("Logging money amount:", money);
            await window.tetherContract.methods.approve(window.contract.options.address, money).send({ from: window.accounts[0] })
            console.log("Approving tether transfer...");
            console.log("Secured!")
            console.log("Calling potUSDT...");
            const gasEstimate = await window.contract.methods.potUSDT(window.accounts[0], money).estimateGas({ from: window.accounts[0] })
            console.log("The gas for submission:", gasEstimate);
            
            await window.contract.methods.potUSDT(window.accounts[0],money).send({ from: window.accounts[0], gas: gasEstimate });
            await saveInput(window.accounts, money);

        
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    }



    const switchToPolygonMainnet = async () => {
        const polygonMainnet = {
            chainId: '0x89', // 137 in decimal
            chainName: 'Polygon Mainnet',
            rpcUrls: ['https://polygon-rpc.com/'], // Standard Polygon Mainnet RPC URL
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            blockExplorerUrls: ['https://polygonscan.com'],
        };
        try {
            // Check if MetaMask is installed
            if (window.ethereum) {
                // Get the current network chain ID
                const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
                // If the user is not on the Polygon Mainnet, switch them
                if (currentChainId !== polygonMainnet.chainId) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: polygonMainnet.chainId }],
                        });
                        console.log("Successfully switched to the Polygon Mainnet");
                    } catch (error) {
                        // If the Polygon Mainnet is not added, add it
                        if (error.code === 4902) { // 4902 means the chain has not been added to MetaMask
                            try {
                                await window.ethereum.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [polygonMainnet],
                                });
                                console.log("Polygon Mainnet added and switched successfully");
                            } catch (addError) {
                                console.error("Failed to add the Polygon Mainnet:", addError);
                            }
                        } else {
                            console.error("Failed to switch to the Polygon Mainnet:", error);
                        }
                    }
                } else {
                    console.log("Already on the Polygon Mainnet");
                }
            } else {
                console.error("MetaMask is not installed");
            }
        } catch (error) {
            console.error("Failed to detect or switch network:", error);
        }
    };


const retrieveTether = async(event) => {
    event.preventDefault()
    try {
        let returnmoney = parseFloat(event.target.returnAmount.value); 
        if (isNaN(returnmoney)) {
            throw new Error("Invalid input");
        }
        console.log(returnmoney)
        returnmoney = returnmoney * (10 ** 6)
        //to save in smart contract
       
        await window.contract.methods.requestedReturns(window.accounts[0], returnmoney).send({ from: window.accounts[0] })
        
        
        //to save in backend
        await addingRequesttoBackend(window.accounts[0], returnmoney);
    }
    catch (error) {
        console.error("Error during transaction:", error);
    }
}

const saveWallet = async (wallet) => {
    try {
        const response = await fetch('http://localhost:3001/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                userWallet: `${wallet}`, 
            }),
        });
        const result = await response.text();
        console.log("Backend response:", result);
    } catch (error) {
        console.error('Error in backend', error);
    }
}

const saveInput = async (wallet, money) => {
    try {
        const response = await fetch('http://localhost:3001/submission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userWallet: `${wallet}`, 
                amount: money, 
            }),
        });
        const result = await response.text();
        console.log("Backend response:", result);
    } catch (error) {
        console.error('Error in backend', error);
    }
}

const obtainInputs = async (wallet) => {
    try {
        const response = await fetch(`http://localhost:3001/mostRecent/${wallet}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            const transactions = await response.json();
            console.log(`Tether Submission by ${wallet} is:`, transactions);
            
            return transactions;
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const refreshInputs = async() => {
    try{
        let walletArray = await totalWallets();
        console.log('wallet array', walletArray)
        const ledger = document.querySelector('.ledger');
        ledger.textContent = '';
        for (let v=0; v<walletArray.length; v++){
            let inputVals = await obtainInputs(walletArray[v])
            let username = await findUserName(walletArray[v])
            console.log('username in loop', username)

            if (inputVals.length > 0) {
                for(let i=0; i<inputVals.length; i++){

                

                let content = document.createTextNode(`${username} submitted: $${inputVals[i] / 1000000}\n`);
                ledger.appendChild(content);
        }}
        console.log('Refresh Functional')}
    } catch(error){
        console.log(error)
    }
}

const addUsername = async(event, wallet, userName) => {
    event.preventDefault()
    try {
        const response = await fetch(`http://localhost:3001/username`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userWallet: `${wallet}`, 
                userName: userName, 
            }),
        });
        const result = await response.text();
        console.log("Backend response:", result);
        console.log(`Great Username: ${userName}`)
    } catch (error) {
        console.error('Error in backend', error);
    }
}

const deleteSubmissions = async(wallet) => {
    try{
    const response = await fetch('http://localhost:3001/moneyreturned', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            userWallet: `${wallet}`,
        }),
        })
        const result = await response.text();
        console.log("Backend response:", result);
        
    } catch (error) {
        console.error('Error in backend', error);
    }
}

const totalWallets = async() => {
    try{
        const response = await fetch('http://localhost:3001/allusers', {
            method:'GET',
            headers:{
                'Content-Type':'application-json',
            },
        })
        if (response.ok) {
            const wallets = await response.json();
            console.log("Total Users:", wallets);
            return wallets;
        }
        else {
            console.log('Response was not okay')
        }
    } catch (error) {
        console.error('Error in backend', error);
    }}

const findUserName = async(wallet) => {
    try {
        const response = await fetch(`http://localhost:3001/specifiedusername?userWallet=${encodeURIComponent(wallet)}`, {
            method:'GET',
            headers:{
                'Content-Type':'application-json',
            },
            })
            const username = await response.text();
            console.log('username:', username)
            return username
            
        } catch (error) {
            console.error('Error in backend', error);
        }
    }


const addingRequesttoBackend = async (wallet, amount) => {
    try{
        const response = await fetch('http://localhost:3001/userreturns', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                userWallet: `${wallet}`,
                userReturns: amount,
        })
        })
        const result = await response.text();
        console.log("Backend response:", result);
    } catch (error) {
        console.error('Error in backend', error);
    }}

const creatingLedger = async () => {
    try {
        const ledgerout = document.querySelector('.ledgerout')
        ledgerout.textContent = ''
        const wallets = await totalWallets()
        for (let i=0;i<wallets.length;i++) {
            let wallet = wallets[i];
            console.log('oye wallet',wallet)
            let returnvalue = await obtainRequests(wallet);
            console.log('return value', returnvalue)
            let username = await findUserName(wallet)
            if (!username) {
                username = window.accounts[0]
            }
            console.log(`${username} requests: $${returnvalue}`)
            let content = document.createTextNode(`${username} requests: $${returnvalue/10**6}`);
            ledgerout.appendChild(content);
            if (obtainRequestLoop) {
                const theButtonofAcceptance = document.querySelector('.theButtonofAcceptance');
                theButtonofAcceptance.textContent =''
               await theButtonsFoundation()
            }
            }
            } catch (error) {
                console.log('Error with ledger production: ', error)
            }

    

    }

    const obtainRequests = async (wallet) => {
        try {
            let response = await fetch(`http://localhost:3001/userinreqs?userWallet=${encodeURIComponent(wallet)}`, {
                method: 'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
            if (response.ok) {
                const returnValue = await response.json()
                const username = await findUserName(wallet);
                console.log(`${username} requests $${returnValue} from pot`)
                
                return returnValue
            } else {
                console.error('Error fetching data:', response.statusText);
                
            }
        } catch (error) {
            console.error('Error fetching data:', error);
           
        }
    };


    // for whenever the red acceptance button appears
    const acceptLedger = async (wallet, decision) => {
        try{
            let response = await fetch('http://localhost:3001/decisioning', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    userWallet: `${wallet}`,
                    decision: decision,
                }),
            })
            if (response.ok){
                const reply = await response.text();
                console.log('Backend Response: ', reply)
            }}
        catch(err) {
            console.log('Error in backend: ', err)
        }
    }

const theButtonsFoundation = async() => {
    const theButtonofAcceptance = document.querySelector('.theButtonofAcceptance');
    const goodbutton = document.createElement('button')
    goodbutton.textContent = 'Ledger Looks Good';
    goodbutton.style.background = 'black';
    goodbutton.style.color = 'green'
    theButtonofAcceptance.append(goodbutton);
    goodbutton.addEventListener('click', async () => {
        try {
            await acceptLedger(window.accounts[0], parseFloat(1))
            console.log('Result of Ledger Acceptance is successful')
            if (totalledgerdecision()) {
                const helpout = document.querySelector('.helpout')
                helpout.textContent = "Full Acceptance"
                helpout.style.color = '#39FF14'
                const ledgerTotal = await createChart()
                console.log('the ledger: ', ledgerTotal)
                await transact(ledgerTotal)
                
            }     
        } catch(err) {
        console.log('Ledger Acceptance Failure: ', err)
    }
    })

    const badbutton = document.createElement('button')
    badbutton.textContent = 'Ledger Looks Poor'
    badbutton.style.background = 'black'
    badbutton.style.color = 'red'
    theButtonofAcceptance.append(badbutton)
    badbutton.addEventListener('click', async () => {
        try {
            await acceptLedger(window.accounts[0], parseFloat(0))
            console.log('Result of Ledger Decline is successful')
            const helpout = document.querySelector('.helpout')
            helpout.textContent = "A decline is sensed"
            helpout.style.color = '#39FF14'
        } catch(err) {
        console.log('Ledger Decline Failure: ', err)
    }
    })

}

const obtainRequestLoop = async() => {
    const wallets = await totalWallets();
    for (let i=0; i<wallets.length; i++) {
        let isthererequest =  await obtainRequests(wallets[i]);
        if (!isthererequest) {
            console.log(`${wallets[i]} hasn't made a request`)
            return false
        }
    }
    console.log('Requests made by all')
    return true
}


const totalledgerdecision = async () => {
    try {
        const wallets = await totalWallets();
        for (let i=0; i<wallets.length;i++){
            try {
                let response = await fetch(`http://localhost:3001/decisionresult?userWallet=${encodeURIComponent(wallets[i])}`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
            })
            let decision = await response.json();
            if (decision == 1) {
                console.log(`This is ${wallets[i]} decision: `, decision)   
            } else {
                console.log(`This is ${wallets[i]} decision: `, 0)
                console.log('A wallet has rejected')
                return false
            }} catch (err)  {
                console.log('Error with total decisions: ', err)
            }
    }
    console.log('A total Acceptance!')
    return true
    } catch(err) {
        console.log('Error checking decisions,', err)
}}

const ledgerDecision = async (wallet) => {
    try {
        let response = await fetch(`http://localhost:3001/decisionresult?userWallet=${encodeURIComponent(wallet)}`, {
            method:'GET',
            headers:{
                'Content-Type':'application-json',
                },
            })
            if (response.ok){
                let decision = await response.json();
                console.log(`This is ${wallet} decision: `, decision)
                if (decision == 0) {
                    console.log(`${wallet} has rejected`)
                }     
                return decision
            } else {
                console.log(`Error loading ${wallet} decision`)
            }
         } catch (err) {
            console.log('Error with GET call for decision')
         }
}

const createChart = async() =>  {
    const wallets = await totalWallets();
    let returnCharter = [];
    for (let i =0; i<wallets.length;i++) {
        let wallet = wallets[i];
        let decision = await ledgerDecision(wallet)
        let money = await obtainRequests(wallet)
        console.log('Decision:', wallet, decision, money)
        returnCharter.push({publicAddress: wallet, winnings: money, acceptance: decision})
    }
    return returnCharter
}

const transact = async(details) => {
    const sendit = document.querySelector('.sendit');
    sendit.textContent = ''
    //the button that transacts (one user pays full gas prices)
    const finality = document.createElement('button')
    finality.textContent = 'Finish the Job.';
    finality.style.background = 'black';
    finality.style.color = '#39FF14'
    finality.addEventListener('click', async () => {
        try {
            console.log('Processing finale details...')
            await window.contract.methods.TheGreatDistribution(details).send({ from: window.accounts[0] })
            await deleteDetails()
            const helpout = document.querySelector('.helpout')
            helpout.textContent = "Success. Please Refresh Page"
        } catch(err) {
            console.log('The final transaction has been delayed: ', err)
        }
    })
    sendit.append(finality)
    
}

const deleteDetails = async() => {
    const wallets = await totalWallets()
    for (let i=0; i<wallets.length;i++) {
        try {
            let response = await fetch(`http://localhost:3001/destruction`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    userWallet: `${wallets[i]}`
                })
            })
            let result = await response.json()
            console.log('The deletion process went with the result: ', result)
        } catch {
            console.log('Error with deletion: ', result)
        }
}}


document.addEventListener('DOMContentLoaded',initialize)
