import React, {useState} from "react";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";

const ProductCard = ({product, addProduct}) => {
  const inStock = product.rating?.count > 0;
  const mockVariants = ["Small", "Medium", "Large"];
  const variants = product.variants?.length > 0 ? product.variants : mockVariants;

  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const handleAddToCart = () => {
    toast.success("Added to cart");
    addProduct({...product, selectedVariant});
  };

  return (
    <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <img
          className="card-img-top p-3"
          src={product.image}
          alt={product.title}
          style={{height: "250px", objectFit: "contain"}}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.title}</h5>
          <p
            className="text-muted small mb-2"
            style={{minHeight: "55px"}}
          >
            {product.description.length > 85
              ? product.description.substring(0, 85) + "..."
              : product.description}
          </p>

          <select
            className="form-select form-select-sm mb-3"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
          >
            {variants.map((variant, idx) => (
              <option key={idx} value={variant}>
                {variant}
              </option>
            ))}
          </select>

          <h6 className="fw-bold text-primary mb-3">${product.price}</h6>

          {inStock ? (
            <div className="mt-auto d-flex gap-2">
              <Link
                to={`/product/${product.id}`}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                Buy Now
              </Link>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary btn-sm flex-fill"
              >
                Add to Cart
              </button>
            </div>
          ) : (
            <button
              className="btn btn-secondary btn-sm mt-auto w-100"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
