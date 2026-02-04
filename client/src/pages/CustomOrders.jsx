import React from 'react'

const CustomOrders = () => {
  return (
    <div className="customOrders">
        <h2>Custom Orders</h2>

        <section className="custom-order-form">
            <p>Add your custom order details here</p>
            <input type="text" placeholder='Add order details here'/>

            <p>Add your custom file here</p>
            <input type="file"/>

            <button type="submit">
                Submit Custom Order
            </button>
        </section>

    </div>
  )
}

export default CustomOrders