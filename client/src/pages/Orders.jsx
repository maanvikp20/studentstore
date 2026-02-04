import React from 'react'

const Orders = () => {
  orders.forEach(order => {
    <div className="order-item" key={order.id}>
      <p>Order #{order.id}</p>
      <p>Customer Name: {order.customerName}</p>
    </div>
  })

  return (
    <section className="orders">
        <h2>Current orders in place</h2>

        <div className="order-list">
          <p>No current orders.</p>

          <div id="order-list">
            {orders.length > 0 ? (
              orders.map(order => (
                <div className="order-item" key={order.id}>
                  <p>Order #{order.id}</p>
                  <p>Customer Name: {order.customerName}</p>
                </div>
              ))
            ) : (
              <p>No current orders.</p>
            )}
          </div>

          <button type="button">Refresh</button>
        </div>

    </section>
  )
}

export default Orders