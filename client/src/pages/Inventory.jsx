const Inventory = () => {
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products")
      
    } catch (error) {
      
    }
  }
  return (
    <div className="inventory">
      <h2>Our Store</h2>
    </div>
  )
}

export default memo(Inventory);