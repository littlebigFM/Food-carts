import React, { useState, useEffect } from "react";
import { foodsArray } from "./FoodsArray";
import style from "./foods.module.css";
import Sidebar from "./Sidebar";

const FoodMenu = () => {
  const [foods, setFoods] = useState(foodsArray);
  const [display, setDisplay] = useState(false);
  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem("cartItems", JSON.stringify(cart));
    }
  }, [cart, isCartLoaded]);

  const hide = () => setDisplay(false);

  const addToCart = (food) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === food.id);

      if (existing && existing.quantity >= food.quantity) return prevCart;

      if (existing) {
        return prevCart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...food,
            quantity: 1,
            total: food.price,
          },
        ];
      }
    });

    setDisplay(true);
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) => {
      const foodInStock = foods.find((food) => food.id === id);
      return prevCart.map((item) => {
        if (item.id === id && item.quantity < foodInStock.quantity) {
          return {
            ...item,
            quantity: item.quantity + 1,
            total: (item.quantity + 1) * item.price,
          };
        }
        return item;
      });
    });
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
                total: (item.quantity - 1) * item.price,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className={style.mn}>
      <h1>Today's Menu</h1>
      <div className={style.main}>
        {foods.map((food) => {
          const inCart = cart.find((item) => item.id === food.id);
          const currentQty = inCart?.quantity || 0;
          const reachedMax = currentQty >= food.quantity;

          return (
            <div key={food.id}>
              <div className={style.foodMenu}>
                <div className={style.leftSection}>
                  <h3 className={style.text1}>{food.name}</h3>
                  <p className={style.text2}>{food.description}</p>
                  <div className={style.text3}>
                    <h1>#{food.price}</h1>
                    <p
                      id={style.t3t2}
                      style={{ color: food.inStock ? "black" : "red" }}
                    >
                      {food.inStock
                        ? `${food.quantity} items left`
                        : "Out of stock"}
                    </p>
                  </div>
                </div>
                <div className={style.RightSection}>
                  <img src={food.image} alt="" className={style.rsImg} />
                  <div className={style.button}>
                    <button
                      id={style.btn}
                      onClick={() => addToCart(food)}
                      disabled={!food.inStock || reachedMax}
                      style={{
                        backgroundColor: food.inStock ? "black" : "gray",
                        cursor:
                          food.inStock && !reachedMax
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Sidebar
        cart={cart}
        display={display}
        onHide={hide}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        foods={foods}
      />
    </div>
  );
};

export default FoodMenu;
