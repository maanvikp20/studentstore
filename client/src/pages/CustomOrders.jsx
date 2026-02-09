import React from 'react'

const CustomOrders = () => {
  return (
    <div className="customOrders">
        <h2>Custom Orders</h2>
        <p>Have a specific design in mind? Place a custom order with us! Fill out the form below with your design details and upload any relevant files. Our team will review your request and get back to you with a quote and estimated timeline.</p>

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