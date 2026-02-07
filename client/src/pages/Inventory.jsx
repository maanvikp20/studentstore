const Inventory = () => {
  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products")
      if(!response.ok){
        throw new Error("failed to fetch products")
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
    }
  }
  return (
    <div className="inventory">
      <h2>Our Store</h2>
    </div>
  )
}

export default memo(Inventory);