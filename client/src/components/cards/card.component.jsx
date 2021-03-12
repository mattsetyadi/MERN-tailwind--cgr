import React from 'react'


const CardProduct = ({ image, category, title, desc, price }) => {
    return (
        <div className="p-4 md:w-1/3 md:mb-0 mb-6 flex flex-col justify-center items-center max-w-sm mx-auto">
            <div className="bg-gray-300 h-56 w-full rounded-lg shadow-md bg-cover bg-center" >
                <img className='cover__img' src={image} alt=''/>
            </div>

            <div className=" w-70 bg-white -mt-10 shadow-lg rounded-lg overflow-hidden p-5">
              
              <div className="header-content inline-flex ">
                <div className="category-badge flex-1  h-4 w-4 m rounded-full m-1 bg-purple-100">
                  <div className="h-2 w-2 rounded-full m-1 bg-purple-500 " ></div>
                </div>
                <div className="category-title flex-1 text-sm">{category}</div>
              </div>
              <div className="title-post font-medium">{title}</div>

              <div className="summary-post text-base text-justify">{desc}
                <div className="flex-crow content-between">  
                <button className="bg-blue-100 text-blue-500 mt-4 block rounded p-2 text-sm "><span className="">Checkout</span></button>
                <p>$ {price}</p>
                </div>
              </div>            
            </div>
          </div>
    )
}

export default CardProduct
