import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import "./appstyle.css";
import { Line } from "react-chartjs-2";
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
// we learned how to do most of the stuff for charts from this video https://www.youtube.com/watch?v=5alEc5KuyKg&t=3s
function Chart() {
  const [currencies, setcurrencies] = useState([]);
  const [usdconv, setusdconv] = useState("");
  const [currentprice, setcurrentprice] = useState("");
  const [previousprice, setpreviousprice] = useState({});
  var [display, setdisplay] = useState([]);
  const websocket = useRef(null);
  let check = useRef(true);
  let temp=[];
  //getting the data from the api
  useEffect(() => {
    websocket.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
    var crypto = [];
    async function getData() {
      await axios.get("https://api.pro.coinbase.com/products").then((res) => {
            crypto = res.data;
    });
      await axios.get("https://api.pro.coinbase.com/currencies")
        .then((res) => res.data)
        .then((data) => {
          temp=data;
        });
        //adding names of currencies that will be displayed in dropdown
      setcurrencies(crypto.filter((usdconv) => {
        if (usdconv.quote_currency === "USD") {
          for(let i=0;i<temp.length;i++){
            if(usdconv.base_currency===temp[i].id){
              usdconv.display_name=temp[i].name;
            }
          }
          return usdconv;
        }
      }));
      check.current = false;
    };
    getData();
  }, []);

  function setdata(data) {
      //function used to format the data recieved from api
      console.log(data);
      let displaydata = {datasets: [{data: []}]};
      displaydata.datasets[0].data = data.map((dataarray) => {
        return dataarray[4];
      });
      displaydata.labels = data.map((dataarray) => {
        return `${new Date(dataarray[0] * 1000).getMonth() + 1}/${new Date(dataarray[0] * 1000).getDate()}/${new Date(dataarray[0] * 1000).getFullYear()}`;
      });
      console.log(displaydata);
      return displaydata;
  }
  useEffect(() => {
      //getting cryptocurrencies prices from previous time
    if (check.current==false) {
        websocket.current.send(JSON.stringify({type: "subscribe", product_ids: [usdconv], channels: ["ticker"]}));
        axios.get(`https://api.pro.coinbase.com/products/${usdconv}/candles?granularity=86400`)
            .then((res) => setpreviousprice(setdata(res.data)));
        websocket.current.onmessage = (e) => {
          if (JSON.parse(e.data).product_id === usdconv) {
            display=[];
            display.push({
              key: JSON.parse(e.data).product_id,
              value: 0
            });
            setcurrentprice(JSON.parse(e.data).price);
            setdisplay(JSON.parse(e.data).product_id);
          }
        };
    }
    else {
        return;
    }
  }, [usdconv], [display]);
  const [open, setOpen] = React.useState(false);
  return (
      <>
      {/* html of cryptocurrency charts */}
      <InputLabel id="cryptodropdown">Currency</InputLabel>
        <Select labelId="cryptodropdown"
          id="cryptonames"
          open={open}
          onClose={()=>setOpen(false)}
          onOpen={()=>setOpen(true)}
        onChange={(e) => setusdconv(e.target.value)}>
          {currencies.map((cryptocurrency) => {
            return (
              <MenuItem value={cryptocurrency.id}>
                {cryptocurrency.display_name}
              </MenuItem>
            );
          })}
        </Select>
      <p>{`Real Time Price: $${currentprice}`}</p>
        <Line data={previousprice}/>
    </>
  );
}
export default Chart;




















































// import React, { useState, useEffect, useRef } from "react";
// import Dashboard from "./Dashboard";
// import { formatData } from "./utils";
// import "./styles.css";
// import Item from "react";

// function Chart() {
//   const [currencies, setcurrencies] = useState([]);
//   const [pair, setpair] = useState("");
//   const [price, setprice] = useState("0.00");
//   const [pastData, setpastData] = useState({});
//   var [display, setdisplay] = useState([]);
//   const ws = useRef(null);

//   let first = useRef(false);
//   const url = "https://api.pro.coinbase.com";
//   let temp=[];
  

//   useEffect(() => {
//     ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

//     let pairs = [];

//     const apiCall = async () => {
//       await fetch(url + "/products")
//         .then((res) => res.json())
//         .then((data) => {
//           pairs = data;
//         });

//       await fetch("https://api.pro.coinbase.com/currencies")
//         .then((res) => res.json())
//         .then((data) => {
//           temp=data;
//         });

//       let filtered = pairs.filter((pair) => {
//         if (pair.quote_currency === "USD") {
//           for(let i=0;i<temp.length;i++){
//             if(pair.base_currency===temp[i].id){
//               pair.display_name=temp[i].name;
//             }
//           }
//           // display.push({
//           //   key: pair.display_name,
//           //   value: price
//           // });
//           //console.log(display);
//           return pair;
//         }
//       });

//     //   filtered = filtered.sort((a, b) => {
//     //     if (a.base_currency < b.base_currency) {
//     //       return -1;
//     //     }
//     //     if (a.base_currency > b.base_currency) {
//     //       return 1;
//     //     }
//     //     return 0;
//     //   });
      
      
//       setcurrencies(filtered);

      

//       first.current = true;
//     };

//     apiCall();
//   }, []);

//   useEffect(() => {
//     if (!first.current) {
      
//       return;
//     }

    
//     let msg = {
//       type: "subscribe",
//       product_ids: [pair],
//       channels: ["ticker"]
//     };
//     let jsonMsg = JSON.stringify(msg);
//     ws.current.send(jsonMsg);

//     let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
//     const fetchHistoricalData = async () => {
//       let dataArr = [];
//       await fetch(historicalDataURL)
//         .then((res) => res.json())
//         .then((data) => (dataArr = data));
      
//       let formattedData = formatData(dataArr);
//       setpastData(formattedData);
//     };

//     fetchHistoricalData();

//     ws.current.onmessage = (e) => {
//       //let data = JSON.parse(e.data);
//     //   if (data.type !== "ticker") {
//     //     return;
//     //   }

//       if (JSON.parse(e.data).product_id === pair) {
//         setprice(JSON.parse(e.data).price);
//         display=[];
//         display.push({
//           key: JSON.parse(e.data).product_id,
//           value: 0
//         });
//         setdisplay(JSON.parse(e.data).product_id);
//         //console.log(display);
//         //console.log("name");
//         //console.log(display);
//         //console.log(display[pair.display_name])
//         //display[pair.display_name] = price;
//         //console.log(display);
//       }
//     };
//   }, [pair], [display]);

// //   const handleSelect = (e) => {
// //     // let unsubMsg = {
// //     //   type: "unsubscribe",
// //     //   product_ids: [pair],
// //     //   channels: ["ticker"]
// //     // };
// //     // let unsub = JSON.stringify(unsubMsg);

// //     // ws.current.send(unsub);

// //     setpair(e.target.value);
// //   };

//   function handleSelect(e) {
//     setpair(e.target.value);
//   }

  

//   return (
//     <div className="container">
//       {
//         <select name="currency" value={pair} onChange={handleSelect}>
//           {currencies.map((cur, idx) => {
//             return (
//               <option key={idx} value={cur.id}>
//                 {cur.display_name}
//               </option>
//             );
//           })}
//         </select>
//       }
//       <Dashboard price={price} data={pastData} currencies={console.log(display)}>{}</Dashboard>
//     </div>
//   );
// }
// export default Chart;