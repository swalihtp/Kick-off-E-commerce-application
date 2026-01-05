import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchCart, addToCart } from "../redux/cartSlice";
import {
  fetchWishlist,
  toggleWishlistLocal,
  updateWishlistOnServer,
} from "../redux/wishlistSlice";
import Navbar from "../components/Navbar";
import FootballJerseyBanner from "../Banners/FootballJerseyBanner";
import { useNavigate } from "react-router-dom";

function Football() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const footballProducts = items.filter(
    (item) => item.category?.toLowerCase() === "cricket"
  );

  const isInCart = (id) =>
    cartItems.some((item) => item.productId === id);

  const isInWishlist = (id) =>
    wishlistItems.some((item) => item.id === id);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-8 py-12">
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          {footballProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/productDetails/${item.id}`)}
              className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-[14px] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Image */}
              <div className="flex h-65 items-center justify-center bg-gray-200 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain transition-transform duration-400 group-hover:scale-110"
                />
              </div>

              {/* Details */}
              <div className="p-4 text-center">
                <p className="mb-1 text-[1.1rem] font-semibold text-gray-900">
                  {item.name}
                </p>
                <p className="font-bold text-[#1E1E1E]">₹{item.price}</p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 px-4 pb-4 pt-3">
                {isInCart(item.id) ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/cart");
                    }}
                    className="
                      flex-1 rounded-md
                      bg-linear-to-r from-[#420300] to-[#1E1E1E]
                      px-3 py-2 text-sm font-semibold text-white
                      transition-all duration-300
                      hover:scale-105
                      hover:from-[#5A0A05] hover:to-[#2A2A2A]"
                  >
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addToCart(item));
                    }}
                    className="
                    flex-1 rounded-md
                    bg-linear-to-r from-[#1E1E1E] to-[#420300]
                    px-3 py-2 text-sm font-semibold text-white
                    transition-all duration-300
                    hover:scale-105
                    hover:from-[#2A2A2A] hover:to-[#5A0A05]"
                  >
                    Add to Cart
                  </button>
                )}

                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    const updatedWishlist = isInWishlist(item.id)
                      ? wishlistItems.filter(w => w.id !== item.id)
                      : [...wishlistItems, item];

                    dispatch(toggleWishlistLocal(item));
                    dispatch(updateWishlistOnServer(updatedWishlist));
                  }}
                  className="bg-transparent border-none cursor-pointer transition-transform duration-300"
                >
                  <img
                    src={
                      isInWishlist(item.id)
                        ? "/icons/icons8-heart-50 (9).png"
                        : "/icons/icons8-heart-50 (8).png"
                    }
                    alt="wishlist-icon"
                    className={`h-7 w-7 transition-transform duration-300 ${isInWishlist(item.id) ? "scale-125" : ""
                      }`}
                  />
                </button>


              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Football;
