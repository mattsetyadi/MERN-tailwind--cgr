import React, {useEffect} from 'react'
import './Home.css'
import PropTypes from 'prop-types'
import CardProduct from '../components/cards/card.component'
import img from '../assets/cover.jpg'
import {connect} from 'react-redux'
import {getProducts} from '../data/reducers/product'

const Home = ({getProducts, product}) => {
  const products = product.products
  useEffect(() => {
      getProducts()
    },[getProducts])
    
    return (
    <section className="blog text-gray-700 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
           {products.map(prod => (
             <CardProduct key={prod._id} image={img} title={prod.name} desc={prod.description} category={prod.category.name} price={prod.price} />
           ))}
        </div>
      </div>
    </section>
    )
}

Home.propTypes ={
  getProducts: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  product: state.product
})

export default connect(mapStateToProps, {getProducts})(Home)
