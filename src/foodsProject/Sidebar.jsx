import React from "react";
import style from "./foods.module.css";

const Sidebar = ({
  cart,
  display,
  onHide,
  increaseQuantity,
  decreaseQuantity,
  foods,
}) => {
  const total = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div
      className={`${style.absoluteSection} ${
        display ? style.show : style.hide
      }`}
    >
      <div className={style.header}>
        <div className={style.header1}>
          <p id={style.p1}>Food cart</p>
          <div>
            <p id={style.p2}>Special Offers Meal Deal 1</p>
            <p id={style.p3}>Please select your items</p>
          </div>
        </div>

        <div className={style.button2}>
          <button id={style.btn2} onClick={onHide}>
            X
          </button>
        </div>
      </div>

      <div className={style.mFooter}>
        <div className={style.cartItems}>
          {cart.map((item) => {
            const foodData = foods.find((food) => food.id === item.id);
            const reachedMax = item.quantity >= foodData.quantity;

            return (
              <div key={item.id} className={style.cartItem}>
                <p>{item.name}</p>
                <p>#{item.total}</p>
                <div className={style.increaseAndDecrease}>
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    id={style.incDec}
                  >
                    -
                  </button>
                  <p>{item.quantity}</p>
                  <button
                    onClick={() => {
                      if (!reachedMax) increaseQuantity(item.id);
                    }}
                    id={style.incDec}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={style.totalPrice}>
          <h4 id={style.h4Text}>Total to Pay #{total}</h4>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
