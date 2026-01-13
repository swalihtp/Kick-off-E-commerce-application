import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.wishlist);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <h2 className="mb-8 text-center text-2xl font-bold text-[#420300]">
          My Wishlist
        </h2>

        {status === "loading" && (
          <p className="text-center text-gray-600">Loading wishlist...</p>
        )}

        {status === "failed" && (
          <p className="text-center text-red-500">
            Failed to load wishlist
          </p>
        )}

        {items.length === 0 ? (
          <p className="text-center text-gray-600">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="h-56 bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.product_name}
                  </h3>
                  <p className="mt-1 font-bold text-[#1E1E1E]">
                    ₹{item.product_price}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() =>dispatch(addToCart(item.product))}
                      className="flex-1 rounded-md bg-[#420300] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#5a0500]"
                    >
                      Add to Cart
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center  transition hover:scale-105" onClick={()=>dispatch(removeFromWishlist(item.product))}>
                      <img src="icons/icons8-heart-50 (9).png" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;
