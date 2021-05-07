// export const formatData = (data) => {
//     let finalData = {
//       datasets: [
//         {
//           data: []
//         }
//       ]
//     };
//     finalData.labels = data.map((val) => {
//       return `${new Date(val[0] * 1000).getMonth() + 1}-${new Date(val[0] * 1000).getDate()}-${new Date(val[0] * 1000).getFullYear()}`;
//     });
//     finalData.datasets[0].data = data.map((val) => {
//       return val[4];
//     });
//     return finalData;
//   };
  