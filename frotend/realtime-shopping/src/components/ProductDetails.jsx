import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
//import ReactImageMagnify from 'react-image-magnify'; // Import magnify library
import { gsap } from 'gsap';
import GsapLoader from './GsapLoader';
const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          toast.error('Failed to fetch product details');
        }
      } catch (err) {
        toast.error('An error occurred while fetching product details');
      } finally{
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

 if(loading){
    return <GsapLoader/>
 }
  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-gray-900 text-white">
      {/* Product Title */}
      <h1 ref={titleRef} className="text-3xl font-bold mb-4">{product.name}</h1>
      
      {/* Product Image with Amazon-like Zoom */}
      <div className="mb-4 max-w-lg">
        <ReactImageMagnify
          {...{
            smallImage: {
              alt: product.name,
              isFluidWidth: true, 
              src: product.image, 
            },
            largeImage: {
              src: product.image, 
              width: 1200, 
              height: 1800, 
            },
            enlargedImageContainerDimensions: {
              width: '200%', 
              height: '200%', 
            },
            lensStyle: { backgroundColor: 'rgba(0,0,50,.6)' }, 
            isHintEnabled: true, 
            shouldUsePositiveSpaceLens: true, // The zoom lens should be in the magnified area
          }}
        />
      </div>

      {/* Product Price */}
      <p className="mt-2 text-2xl">Price : ${product.price}</p>

      {/* Product Category */}
      <div className="mt-4">
        <p className="text-xl">Category  : {product.category}</p>
      </div>

      {/* Product Description */}
      <div ref={descriptionRef} className="mt-4 ">
        <p className="text-xl">Description : {product.description || 'No description available'}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
