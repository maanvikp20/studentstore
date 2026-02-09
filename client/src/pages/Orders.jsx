import React from 'react'
import { ordersAPI } from '../utils/api';

const Orders = () => {
  const [orders, setOrders] = React.useState([]);

  if(orders.length === 0){
    console.log("No orders found");
    ordersAPI.getAll().then(data => {
      setOrders(data);
    })
  }

  if(orders.length > 0){
    console.log(orders);
  }

  if (!token) {
      alert('Please login to place an order');
      navigate('/login');
      return;
  }

  return (
    <div>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
        ) :(
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <p>Order ID: {order.id}</p>
              <p>Product: {order.productName}</p>
              <p>Quantity: {order.quantity}</p>
              <p>Total Price: ${order.totalPrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Orders