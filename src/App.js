

import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import firebase from "./fire";
import {db, auth} from './fire';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import "./appstyle.css";
function App() {
  const [coins, setCoins] = useState([]);
  const [portfolio, setPortfolio] = useState(0);
  const [currencyname, setCurrencyName] = useState('');
  const [display2, setNumber] = useState([]);
  const [loggedinuser, setLoggedInUser] = useState([]);
  const [userdata, setUserData] = useState([]);
  const[show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  let display = [];
  userdata[0] = {}
  //display data of user if they are logged in and remember how much currency they previously owned
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        setPortfolio(doc.data().total);
        total = doc.data().total;
        })
      })
    }
    else {
      setPortfolio(0);
    }
  });
  var total = 0;
  //getting cryptocurrency data from the api
  useEffect(()=> {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false')
    .then(res => {
      setCoins(res.data);
    }).catch(error=>console.log(error))
  }, []);
  // used to manage login, register, and logout
  function Authentication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    function register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          setEmail("");
          setPassword("");
          setLoggedInUser(email);
          db.collection('users').add({
            email: email,
            total: 0,
            binancecoinamount: 0,
            binancecoinowned: false,
            bitcoinamount: 0,
            bitcoincashamount: 0,
            bitcoincashowned: false,
            bitcoinowned: false,
            cardanoamount: 0,
            cardanoowned: false,
            chainlinkamount: 0,
            chainlinkowned: false,
            dogecoinamount: 0,
            dogecoinowned: false,
            ethereumamount: 0,
            ethereumowned: false,
            litecoinamount: 0,
            litecoinowned: false,
            polkadotamount: 0,
            polkadotowned: false,
            stellaramount: 0,
            stellarowned: false,
            tetheramount: 0,
            tetherowned: false,
            uniswapamount: 0,
            uniswapowned: false,
            usdcoinamount: 0,
            usdcoinowned: false,
            vechainamount: 0,
            vechainowned: false,
            xrpamount: 0,
            xrpowned: false
        })
          setShow(true);
          login();
  
        })
        .catch((err) => {
          console.error(err);
          console.log(err);
          alert(err);
        });
    };
  
    function login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setLoggedInUser(email);
          setShow(true);
          console.log("hello");
          setEmail("");
          setPassword("");
          console.log(loggedinuser);
          db.collection('users').where('email', '==', email).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                  console.log(doc.data());
                  setUserData(doc.data());
              })
            })
          })
          .catch((err) => {
            console.error(err);
            console.log(err);
            alert(err);
          });
    };
  
    
  
    function logOut() {
      firebase.auth().signOut().then(()=>{
        console.log(currencyname);
        setShow(false);
      });
    };
    // if authentication succeeded, we display what currencies the user owns
    if (show == true) {
      let text2 = '';
      //if they own e.g. bitcoin, then the amount of bitcoin they own is displayed and similar stuff is done for other currencies
      if(userdata.bitcoinowned) {
        text2+='Bitcoin '+userdata.bitcoinamount+' ';
      }
      if(userdata.ethereumowned) {
        text2+='Ethereum '+userdata.ethereumamount+' ';
      }
      if(userdata.binancecoinowned) {
        text2+='Binance Coin '+userdata.binancecoinamount+' ';
      }
      if(userdata.xrpowned) {
        text2+='XRP '+userdata.xrpamount+' ';
      }
      if(userdata.tetherowned) {
        text2+='Tether '+userdata.tetheramount+' ';
      }
      if(userdata.dogecoinowned) {
        text2+='Dogecoin '+userdata.dogecoinamount+' ';
      }
      if(userdata.cardanoowned) {
        text2+='Cardano '+userdata.cardanoamount+' ';
      }
      if(userdata.polkadotowned) {
        text2+='Polkadot '+userdata.polkadotamount+' ';
      }
      if(userdata.uniswapowned) {
        text2+='Uniswap '+userdata.uniswapamount+' ';
      }
      if(userdata.litecoinowned) {
        text2+='Litecoin '+userdata.litecoinamount+' ';
      }
      if(userdata.bitcoincashowned) {
        text2+='Bitcoin Cash '+userdata.bitcoincashamount+' ';
      }
      if(userdata.chainlinkowned) {
        text2+='Chainlink '+userdata.chainlinkamount+' ';
      }
      if(userdata.vechainowned) {
        text2+='VeChain '+userdata.vechainamount+' ';
      }
      if(userdata.usdcoinowned) {
        text2+='USD Coin '+userdata.usdcoinamount+' ';
      }
      if(userdata.stellarowned) {
        text2+='Stellar '+userdata.stellaramount+' ';
      }
      setCurrencyName(text2);
    }
    else {
      setCurrencyName("");
      logOut();
    }
    return (
      //html for authentication part
        <div>
          <h3>Login/Register</h3>
          <TextField id = "emailform" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"/>
          <br></br>
          <TextField id = "passwordform" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password"/> 
          <br></br>
          <Button id = "registerbutton" onClick={register}>Register</Button>
          <Button id = "loginbutton" onClick={login}>Login</Button>
          <Button id = "logoutbutton" onClick={logOut}>Log Out</Button>
        </div>
     
    );
  };
  //in order to remember the current user we needed to use authcontext, we learnt the technique from this video https://www.youtube.com/watch?v=Cz_mkL12-ng
  const AuthContext = React.createContext();
  const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      firebase.auth().onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoading(true);
      });
    }, []);
    if (loading==false) {
      return null;
    }
    return (
      <AuthContext.Provider value={{ currentUser, }}>{children}</AuthContext.Provider>
    );
  };
  //citation end
  function Settinguser() {
    const { currentUser } = useContext(AuthContext);
    //this remembers who the current user is and constantly rerenders new data from database as soon as any database related change is made
    if (currentUser != null) {
      if (currentUser.email != "") {
        db.collection('users').where('email', '==', currentUser.email).get().then((snapshot)=>{
          snapshot.docs.forEach(doc=>{
          console.log(doc.data());
          setPortfolio(doc.data().total);
          console.log(portfolio);
          })
        })
      }
      return <h2>{`${currentUser.email}`}</h2>;
    }
    else {
      return null;
    }
  };

  // used to add currencies to portfolio
  function adder(element, name, third) {
    let multiplier = document.getElementById(third).value;
    if (parseInt(multiplier) < 0) {
      alert("Error");
      return;
    }
    if (multiplier.trim().length === 0) {
      console.log("breaking");
      return;
    }
    //new amount of ethereum added to database
    if (name == 'Ethereum') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().ethereumamount)));
        db.collection('users').doc(doc.id).update({
          ethereumowned: true,
          ethereumamount: parseInt(parseInt(multiplier)+parseInt(doc.data().ethereumamount))
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    // new amount of bitcoin added to database, and similar stuff is done for other currencies
    if (name == 'Bitcoin') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().bitcoinamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().bitcoinamount));
        db.collection('users').doc(doc.id).update({
          bitcoinowned: true,
          bitcoinamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Binance Coin') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().binancecoinamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().binancecoinamount));
        db.collection('users').doc(doc.id).update({
          binancecoinowned: true,
          binancecoinamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'XRP') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().xrpamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().xrpamount));
        db.collection('users').doc(doc.id).update({
          xrpowned: true,
          xrpamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Tether') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().tetheramount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().tetheramount));
        db.collection('users').doc(doc.id).update({
          tetherowned: true,
          tetheramount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Dogecoin') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().dogecoinamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().dogecoinamount));
        db.collection('users').doc(doc.id).update({
          dogecoinowned: true,
          dogecoinamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Cardano') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().cardanoamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().cardanoamount));
        db.collection('users').doc(doc.id).update({
          cardanoowned: true,
          cardanoamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Polkadot') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().polkadotamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().polkadotamount));
        db.collection('users').doc(doc.id).update({
          polkadotowned: true,
          polkadotamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Uniswap') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().uniswapamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().uniswapamount));
        db.collection('users').doc(doc.id).update({
          uniswapowned: true,
          uniswapamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Litecoin') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().litecoinamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().litecoinamount));
        db.collection('users').doc(doc.id).update({
          litecoinowned: true,
          litecoinamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Bitcoin Cash') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().bitcoincashamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().bitcoincashamount));
        db.collection('users').doc(doc.id).update({
          bitcoincashowned: true,
          bitcoincashamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Chainlink') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().chainlinkamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().chainlinkamount));
        db.collection('users').doc(doc.id).update({
          chainlinkowned: true,
          chainlinkamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'VeChain') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().vechainamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().vechainamount));
        db.collection('users').doc(doc.id).update({
          vechainowned: true,
          vechainamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'USD Coin') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().usdcoinamount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().usdcoinamount));
        db.collection('users').doc(doc.id).update({
          usdcoinowned: true,
          usdcoinamount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
    if (name == 'Stellar') {
      db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
        snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        console.log(doc.data().email);
        console.log(doc.id);
        console.log(parseInt(parseInt(multiplier)+parseInt(doc.data().stellaramount)));
        const value = parseInt(parseInt(multiplier)+parseInt(doc.data().stellaramount));
        db.collection('users').doc(doc.id).update({
          stellarowned: true,
          stellaramount: value
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    })
        })
        })
    }
  //the total amount a user owns is updated
  total += multiplier*element;
  setPortfolio(total);
  db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
    db.collection('users').doc(doc.id).update({
      total: total
    })
    })
  })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
}


function deleter(element, name, third) {
  // function used to remove currencies from portfolio
  let multiplier = document.getElementById(third).value;
  if (parseInt(multiplier) < 0) {
    alert("Error");
    return;
  }
  if (multiplier.trim().length === 0) {
    console.log("breaking");
    return;
  }
  //the selected amount of ethereum removed from database
  if (name == 'Ethereum') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      console.log(doc.data());
      console.log(doc.data().email);
      console.log(doc.id);
      //check made to see if user even owns ethereum and if the amount they want to remove is less than or equal to what they own 
      if (doc.data().ethereumowned == true && doc.data().ethereumamount >= multiplier) {
        console.log(parseInt(doc.data().ethereumamount)-parseInt(parseInt(multiplier)));
        db.collection('users').doc(doc.id).update({
          ethereumowned: true,
          ethereumamount: parseInt(doc.data().ethereumamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().ethereumamount<=0){
                db.collection('users').doc(doc.id).update({
                  ethereumamount:0,
                  ethereumowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            console.log(doc.data());
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    //total amount owned is updated both on frontend and on the backend
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  // similar stuff done for other currencies
  if (name == 'Bitcoin') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().bitcoinowned == true && doc.data().bitcoinamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          bitcoinowned: true,
          bitcoinamount: parseInt(doc.data().bitcoinamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().bitcoinamount<=0){
                db.collection('users').doc(doc.id).update({
                  bitcoinamount:0,
                  bitcoinowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Binance Coin') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().binancecoinowned == true && doc.data().binancecoinamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          binancecoinowned: true,
          binancecoinamount: parseInt(doc.data().binancecoinamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().binancecoinamount<=0){
                db.collection('users').doc(doc.id).update({
                  binancecoinamount:0,
                  binancecoinowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'XRP') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().xrpowned == true && doc.data().xrpamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          xrpowned: true,
          xrpamount: parseInt(doc.data().xrpamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().xrpamount<=0){
                db.collection('users').doc(doc.id).update({
                  xrpamount:0,
                  xrpowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Tether') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().tetherowned == true && doc.data().tetheramount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          tetherowned: true,
          tetheramount: parseInt(doc.data().tetheramount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().tetheramount<=0){
                db.collection('users').doc(doc.id).update({
                  tetheramount:0,
                  tetherowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Dogecoin') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().dogecoinowned == true && doc.data().dogecoinamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          dogecoinowned: true,
          dogecoinamount: parseInt(doc.data().dogecoinamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().dogecoinamount<=0){
                db.collection('users').doc(doc.id).update({
                  dogecoinamount:0,
                  dogecoinowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Cardano') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().cardanoowned == true && doc.data().cardanoamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          cardanoowned: true,
          cardanoamount: parseInt(doc.data().cardanoamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().cardanoamount<=0){
                db.collection('users').doc(doc.id).update({
                  cardanoamount:0,
                  cardanoowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Polkadot') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().polkadotowned == true && doc.data().polkadotamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          polkadotowned: true,
          polkadotamount: parseInt(doc.data().polkadotamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().polkadotamount<=0){
                db.collection('users').doc(doc.id).update({
                  polkadotamount:0,
                  polkadotowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Uniswap') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().uniswapowned == true && doc.data().uniswapamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          uniswapowned: true,
          uniswapamount: parseInt(doc.data().uniswapamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().uniswapamount<=0){
                db.collection('users').doc(doc.id).update({
                  uniswapamount:0,
                  uniswapowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Litecoin') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().litecoinowned == true && doc.data().litecoinamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          litecoinowned: true,
          litecoinamount: parseInt(doc.data().litecoinamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().litecoinamount<=0){
                db.collection('users').doc(doc.id).update({
                  litecoinamount:0,
                  litecoinowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Bitcoin Cash') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().bitcoincashowned == true && doc.data().bitcoincashamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          bitcoincashowned: true,
          bitcoincashamount: parseInt(doc.data().bitcoincashamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().bitcoincashamount<=0){
                db.collection('users').doc(doc.id).update({
                  bitcoincashamount:0,
                  bitcoincashowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Chainlink') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().chainlinkowned == true && doc.data().chainlinkamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          chainlinkowned: true,
          chainlinkamount: parseInt(doc.data().chainlinkamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().chainlinkamount<=0){
                db.collection('users').doc(doc.id).update({
                  chainlinkamount:0,
                  chainlinkowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'VeChain') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().vechainowned == true && doc.data().vechainamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          vechainowned: true,
          vechainamount: parseInt(doc.data().vechainamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().vechainamount<=0){
                db.collection('users').doc(doc.id).update({
                  vechainamount:0,
                  vechainowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'USD Coin') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().usdcoinowned == true && doc.data().usdcoinamount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          usdcoinowned: true,
          usdcoinamount: parseInt(doc.data().usdcoinamount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().usdcoinamount<=0){
                db.collection('users').doc(doc.id).update({
                  usdcoinamount:0,
                  usdcoinowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
  if (name == 'Stellar') {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      if (doc.data().stellarowned == true && doc.data().stellaramount >= multiplier) {
        db.collection('users').doc(doc.id).update({
          stellarowned: true,
          stellaramount: parseInt(doc.data().stellaramount)-parseInt(parseInt(multiplier))
        }).then(()=>{
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              if(doc.data().stellaramount<=0){
                db.collection('users').doc(doc.id).update({
                  stellaramount:0,
                  stellarowned: false
                })
              }
            })
          })
        }).then(()=> {
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            setUserData(doc.data());
        })
      })
    }).then(()=> {
    total -= multiplier*element;
    setPortfolio(total);
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
          total: total
        })
     })
    })
  if (display2[name] != undefined) {
    display2[name]+=parseInt(multiplier);
  }
  else{
    display2[name]=parseInt(multiplier);
  }
  setNumber(display2);
    })
      }
      else {
        alert("error");
        
      }
      })
      })
  }
}

function displayer(id, id2) {
if (loggedinuser.length == 0) {
  alert("Please log in first");
  return;
}
document.getElementById(id).style="margin-left: auto; margin-right: auto; display: block;";
document.getElementById(id2).style="margin-left: auto; margin-right: auto; display: block;";
}
function sharer() {
  //creative feature: users can send cryptocurrencies to other users
  if (loggedinuser.length == 0) {
    alert("Please log in first");
    return;
  }
  var currency = prompt("Which currency do you want to send?");
  var amount = parseInt(prompt("How much of the currency do you want to send"));
  if (amount < 0) {
    alert("Error");
    return;
  }
  var user = prompt("Enter email of user you want to send currency to");
  console.log(user);
  db.collection('users').where('email', '==', user).get().then((ref)=>{
    let results = ref.docs.map(doc=>doc.data());
    if (results.length == 0) {
      alert("User does not exist in database");
      return;
    }
  })
  if (currency == null || amount == null || user == null) {
    alert("Error");
    return;
  }
  //sending bitcoin to entered user
  if (currency.toLocaleLowerCase()=="bitcoin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        //check made to see if logged in user even owns bitcoin and if they own enough to send 
        if(doc.data().bitcoinowned==true && doc.data().bitcoinamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              //bitcoin added to entered users database
              bitcoinowned: true,
              bitcoinamount: parseInt(parseInt(doc.data().bitcoinamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Bitcoin'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              //bitcoin amount subtracted from logged in users database
              bitcoinowned: true,
              bitcoinamount: parseInt(parseInt(doc.data().bitcoinamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Bitcoin'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  //similar stuff done for other currencies
  else if (currency.toLocaleLowerCase()=="ethereum") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().ethereumowned==true && doc.data().ethereumamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              ethereumowned: true,
              ethereumamount: parseInt(parseInt(doc.data().ethereumamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Ethereum'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              ethereumowned: true,
              ethereumamount: parseInt(parseInt(doc.data().ethereumamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Ethereum'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="binance coin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().binancecoinowned==true && doc.data().binancecoinamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              binancecoinowned: true,
              binancecoinamount: parseInt(parseInt(doc.data().binancecoinamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Binance Coin'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              binancecoinowned: true,
              binancecoinamount: parseInt(parseInt(doc.data().binancecoinamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Binance Coin'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="tether") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().tetherowned==true && doc.data().tetheramount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              tetherowned: true,
              tetheramount: parseInt(parseInt(doc.data().tetheramount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Tether'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              tetherowned: true,
              tetheramount: parseInt(parseInt(doc.data().tetheramount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Tether'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="xrp") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().xrpowned==true && doc.data().xrpamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              xrpowned: true,
              xrpamount: parseInt(parseInt(doc.data().xrpamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['XRP'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              xrpowned: true,
              xrpamount: parseInt(parseInt(doc.data().xrpamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['XRP'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="cardano") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().cardanoowned==true && doc.data().cardanoamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              cardanoowned: true,
              cardanoamount: parseInt(parseInt(doc.data().cardanoamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Cardano'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              cardanoowned: true,
              cardanoamount: parseInt(parseInt(doc.data().cardanoamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Cardano'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="dogecoin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().dogecoinowned==true && doc.data().dogecoinamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              dogecoinowned: true,
              dogecoinamount: parseInt(parseInt(doc.data().dogecoinamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Dogecoin'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              dogecoinowned: true,
              dogecoinamount: parseInt(parseInt(doc.data().dogecoinamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Dogecoin'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="polkadot") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().polkadotowned==true && doc.data().polkadotamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              polkadotowned: true,
              polkadotamount: parseInt(parseInt(doc.data().polkadotamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Polkadot'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              polkadotowned: true,
              polkadotamount: parseInt(parseInt(doc.data().polkadotamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Polkadot'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="uniswap") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().uniswapowned==true && doc.data().uniswapamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              uniswapowned: true,
              uniswapamount: parseInt(parseInt(doc.data().uniswapamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Uniswap'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              uniswapowned: true,
              uniswapamount: parseInt(parseInt(doc.data().uniswapamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Uniswap'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="litecoin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().litecoinowned==true && doc.data().litecoinamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              litecoinowned: true,
              litecoinamount: parseInt(parseInt(doc.data().litecoinamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Litecoin'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              litecoinowned: true,
              litecoinamount: parseInt(parseInt(doc.data().litecoinamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Litecoin'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="bitcoin cash") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().bitcoincashowned==true && doc.data().bitcoincashamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              bitcoincashowned: true,
              bitcoincashamount: parseInt(parseInt(doc.data().bitcoincashamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Bitcoin Cash'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              bitcoincashowned: true,
              bitcoincashamount: parseInt(parseInt(doc.data().bitcoincashamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Bitcoin Cash'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="usd coin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().usdcoinowned==true && doc.data().usdcoinamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              usdcoinowned: true,
              usdcoinamount: parseInt(parseInt(doc.data().usdcoinamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['USD Coin'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              usdcoinowned: true,
              usdcoinamount: parseInt(parseInt(doc.data().usdcoinamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['USD Coin'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="chainlink") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().chainlinkowned==true && doc.data().chainlinkamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              chainlinkowned: true,
              chainlinkamount: parseInt(parseInt(doc.data().chainlinkamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Chainlink'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              chainlinkowned: true,
              chainlinkamount: parseInt(parseInt(doc.data().chainlinkamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Chainlink'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="vechain") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().vechainowned==true && doc.data().vechainamount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              vechainowned: true,
              vechainamount: parseInt(parseInt(doc.data().vechainamount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['VeChain'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              vechainowned: true,
              vechainamount: parseInt(parseInt(doc.data().vechainamount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['VeChain'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="stellar") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        if(doc.data().stellarowned==true && doc.data().stellaramount >= amount){
          db.collection('users').where('email', '==', user).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              stellarowned: true,
              stellaramount: parseInt(parseInt(doc.data().stellaramount) + parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) + parseInt((amount*display['Stellar'])))
            })
            })
          })
          db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
            db.collection('users').doc(doc.id).update({
              stellarowned: true,
              stellaramount: parseInt(parseInt(doc.data().stellaramount) - parseInt(amount)),
              total: parseInt(parseInt(doc.data().total) - parseInt((amount*display['Stellar'])))
              }).then(()=>{
                db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
                  snapshot.docs.forEach(doc=>{
                    setUserData(doc.data());
                  })
                })
              })
            })
          })
        }
        else {
          alert("error");
        }
      })
    })
  }
  else {
    alert("Error");
    return;
  }
  
  
}

function remover() {
  //function used to remove cryptocurrencies from portfolio
  if (loggedinuser.length == 0) {
    alert("Please log in first");
    return;
  }
  var currency = prompt("Which currency do you want to remove?");
  if (currency == null) {
    alert("error");
    return;
  }
  //user no longer owns bitcoin and so bitcoin amount that is owned is set to 0. all bitcoin currency previously owned is subtracted from 
  // total portfolio value
  else if (currency.toLocaleLowerCase()=="bitcoin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().bitcoinamount*parseInt(display['Bitcoin']))));
      if (parseInt(parseInt(doc.data().total) - parseInt((doc.data().bitcoinamount*parseInt(display['Bitcoin'])))) < 0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        bitcoinowned: false,
        bitcoinamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  //similar stuff done for other currencies
  else if (currency.toLocaleLowerCase()=="ethereum") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().ethereumamount*parseInt(display['Ethereum']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        ethereumowned: false,
        ethereumamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="binance coin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().binancecoinamount*parseInt(display['Binance Coin']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        binancecoinowned: false,
        binancecoinamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="xrp") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().xrpamount*parseInt(display['XRP']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        xrpowned: false,
        xrpamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="tether") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().tetheramount*parseInt(display['Tether']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        tetherowned: false,
        tetheramount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="cardano") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().cardanoamount*parseInt(display['Cardano']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        cardanoowned: false,
        cardanoamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="dogecoin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().dogecoinamount*parseInt(display['Dogecoin']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        dogecoinowned: false,
        dogecoinamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="polkadot") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().polkadotamount*parseInt(display['Polkadot']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        polkadotowned: false,
        polkadotamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="uniswap") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().uniswapamount*parseInt(display['Uniswap']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        uniswapowned: false,
        uniswapamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="litecoin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().litecoinamount*parseInt(display['Litecoin']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        litecoinowned: false,
        litecoinamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="bitcoin cash") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().bitcoincashamount*parseInt(display['Bitcoin Cash']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        bitcoincashowned: false,
        bitcoincashamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="chainlink") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().chainlinkamount*parseInt(display['Chainlink']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        chainlinkowned: false,
        chainlinkamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="vechain") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().vechainamount*parseInt(display['VeChain']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        vechainowned: false,
        vechainamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="usd coin") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var newtotal = 0;
      newtotal = parseInt(parseInt(doc.data().total) - parseInt((doc.data().usdcoinamount*parseInt(display['USD Coin']))));
      if (newtotal<0) {
        newtotal = 0;
      }
      db.collection('users').doc(doc.id).update({
        usdcoinowned: false,
        usdcoinamount: 0,
        total: newtotal
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else if (currency.toLocaleLowerCase()=="stellar") {
    db.collection('users').where('email', '==', loggedinuser).get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
      db.collection('users').doc(doc.id).update({
        stellarowned: false,
        stellaramount: 0,
        total: parseInt(parseInt(doc.data().total) - parseInt((doc.data().stellaramount*parseInt(display['Stellar']))))
        }).then(()=>{
          db.collection('users').where('email','==',loggedinuser).get().then((snapshot)=>{
            snapshot.docs.forEach(doc=>{
              setUserData(doc.data());
            })
          })
        })
      })
    })
  }
  else {
    alert("Invalid Input");
  }

}
//creative feature: users can switch between dark mode and light mode
function darkmode() {
  if (document.getElementById("dark").checked) {
    document.getElementById("dark").checked = false;
    document.body.style = 'background-color: #1a1a2e; color: white;';

  }
  if (document.getElementById("light").checked) {
    document.body.style = 'background-color: white; color: black;';
    document.getElementById("light").checked = false;
  }
}
return (
  // html of the cryptocurrency app
  <Router>
    <Route path="/" exact>
  <div>
    <AuthProvider>
      <Authentication/>
    <div>
      <br></br>
    <form>
    <input id="dark" type="radio" name="dark" value="dark" onChange = {darkmode}/> Dark Mode
    <input id = "light" type="radio" name="light" value="light" onChange = {darkmode}/> Light Mode
    </form>
    <Settinguser/>
    </div>
    <div>
      <form>
        <TextField label="Enter Currency" variant="outlined" id = "search" type="text" className = "coin-input"></TextField>
        {/* creative feature: users can search for displayed cryptocurrencies */}
        <Button id = "searchbutton" type = "submit" variant = "contained" color="primary"onClick={() => setSearch(document.getElementById("search").value)}>Search</Button>
      </form>
      <h2>Portfolio Value: ${portfolio}</h2>
      <h3 id = "header">Owned Currencies: {currencyname} </h3>
      <Button style={{margin: "10px"}} variant = "contained" id = "sharebutton" color="primary" onClick={()=> sharer()}>Share Currency</Button>
      <Button style={{margin: "10px"}} variant = "contained" id = "removebutton" color="primary" onClick={()=> remover()}>Remove Currency</Button>
    </div>
    {/* data recieved from api is put in a dictionary and we are now mapping through it to display each cryptocurrency and relevant buttons */}
      {coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())).map(coin=>{
        display.push(coin.name);
        display[coin.name] = [];
        display[coin.name] = coin.current_price;
        return (
                  <div>
                      <h3>{coin.name}</h3>
                      <p className = "coin-price">Current Price: ${coin.current_price}</p>
                      <Button style={{margin: "10px", background: "#00CC00"}} variant = "contained" color="primary" id={coin.name} onClick={()=> displayer(coin.current_price, coin.current_price+5)}>Buy</Button>
                      <Button style={{margin: "10px", background: "#f64747"}} variant = "contained" color="primary" id={coin.name} onClick={()=> displayer(coin.symbol, coin.current_price+6)}>Sell</Button>
                      <form id = {coin.current_price} style={{display: "none"}}>
                        <TextField style={{background: "white"}} label="Amount" id = {coin.current_price+1} type="number"/>How much you want to buy
                      </form>
                      <Button className="add" style={{margin: "10px", display: "none"}} variant = "contained" color="primary" id = {coin.current_price+5} onClick={()=> adder(display[coin.name], coin.name, coin.current_price+1)}>Add</Button>
                      <form id = {coin.symbol} style={{display: "none"}}>
                        <TextField style={{background: "white"}} label="Amount" id = {coin.current_price+2}type="number"/>How much do you want to sell
                      </form>
                      <div id = {coin.key}>
                      <Button style={{margin: "10px", display: "none"}} variant = "contained" color="primary" id = {coin.current_price+6} onClick={()=> deleter(display[coin.name], coin.name, coin.current_price+2)}>Delete</Button>
                      </div>
                      <form id = {coin.current_price+4} style={{display: "none"}}>
                        <TextField style={{background: "white"}} label="Amount" id = {coin.current_price+3} type="number"/>How much do you want to share
                      </form>
                  </div>
        )
        
      })}
    </AuthProvider>
    </div>
  </Route>
  </Router>

);
}

export default App;




