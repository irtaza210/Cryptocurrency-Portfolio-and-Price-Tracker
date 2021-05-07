import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
function Dashboard({ price, data}) {
  return (
    <div>
      <h2>{`$${price}`}</h2>
        <Line data={data}/>
    </div>
  );
}
export default Dashboard;