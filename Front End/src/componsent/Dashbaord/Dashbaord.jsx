// import PieChart from './PieChart'
import SimpleBarChart from "./Graph/BarChart ";
import BasicPie from "./Graph/PieChart";
import SaleBox from "./Graph/SaleBox";
const Dashboard = () => {
  return (
    <>
      {/* <PieChart/> */}
      <SaleBox/>
        <hr />
      <dev style={{
        display: "flex",
        justifyContent: "space-between",
        marginLeft: 20,
        width:1000
      }}>

        
        <SimpleBarChart />
        <BasicPie />
      </dev>
    </>
  );
};

export default Dashboard;
