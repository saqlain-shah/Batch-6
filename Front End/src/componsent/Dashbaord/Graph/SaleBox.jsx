import React from "react";
import BoxSystemProps from "./Box";
import "./SaleBox.css";

const SaleBox = () => {
  const sales = [
    { id: { value: 1, name: "Room", sale: 400 } },
    { id: { value: 2, name: "Booking", sale: 5500 } },
    { id: { value: 3, name: "User", sale: 44500 } },
    { id: { value: 5, name: "available", sale: 30 } }
  ];
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 20 }}>
      {sales.map((sale) => (
        <div key={sale.id.value} style={{ marginLeft: 20 }}>
          <BoxSystemProps sale={sale.id.sale} name={sale.id.name} />
        </div>
      ))}
    </div>
  );
}

export default SaleBox;
