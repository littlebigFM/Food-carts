import React, { useState, useEffect } from "react";
import { foodsArray } from "./FoodsArray";
import style from "./foods.module.css";
import Sidebar from "./Sidebar";
import image from "../assets/logo1.png";
import { IoMdAdd } from "react-icons/io";

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
  const show = () => setDisplay(true);

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

  // = = = = = = = Adding new item section = = = = = = = =
  const [modal, setModal] = useState(false);

  const show2 = () => {
    setModal(true);
  };

  const hide2 = () => {
    setModal(false);
  };

  const [object, setObject] = useState({
    name: "",
    id: "",
    description: "",
    price: "",
    inStock: false,
    quantity: "",
  });

  const updateChange = (event) => {
    const {
      name,
      value,
      //  type, checked
    } = event.target;

    setObject((currentUpdate) => ({
      ...currentUpdate,
      [name]: name === "inStock" ? value === "true" : value,
      // [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddFood = (e) => {
    e.preventDefault();

    const newFood = {
      ...object,
      id: Date.now().toString(),
      // image: "../assets/logo1.png",
      image: image,
      price: parseFloat(object.price),
      quantity: parseInt(object.quantity),
    };

    setFoods((prevFoods) => [...prevFoods, newFood]);
    setModal(false);
    setObject({
      name: "",
      id: "",
      description: "",
      price: "",
      inStock: false,
      quantity: "",
    });
  };

  console.log(object);

  // = = = = = = = = = = = = = = = = = = = = = = = =

  // = = = = = = = = = = delete button = = = = = = = = =
  // const deleteFood = (id) => {
  //   setFoods((prevFoods) => prevFoods.filter((food) => food.id !== id));
  // };

  const deleteItem = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;

    setFoods((prevFoods) => prevFoods.filter((food) => food.id !== id));

    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <div className={style.mn}>
      <div className={style.nav}>
        <h1>
          Today's <span>Menu</span>
        </h1>
        <button id={style.addButton} onClick={show2}>
          Add new item
          {/* <IoMdAdd /> */}
        </button>
        <button id={style.navButton} onClick={show}>
          Order list
        </button>
      </div>
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
                  <button id={style.del} onClick={() => deleteItem(food.id)}>
                    Delete
                  </button>
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

      {modal && (
        <div className={style.mainModalCon} onClick={hide2}>
          <div
            className={style.modalCon}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={style.modalHeader}>
              <div>
                <div>
                  <h1 id={style.h1}>Add New Food</h1>
                </div>
                <div>
                  <p>Add a new food item to your menu</p>
                </div>
              </div>
              <div>
                <button onClick={hide2} id={style.closeBtn}>
                  X
                </button>
              </div>
            </div>

            <form action="" className={style.form}>
              <div className={style.input1}>
                <p>Food Name</p>
                <input
                  id={style.input}
                  type="text"
                  name="name"
                  value={object.name}
                  onChange={updateChange}
                />
              </div>
              <div className={style.input2}>
                <p>Food Description</p>
                <textarea
                  id={style.input}
                  name="description"
                  value={object.description}
                  onChange={updateChange}
                  // placeholder="What's this food about?"
                ></textarea>
              </div>
              <div className={style.input3}>
                <p>Price (#)</p>
                <input
                  id={style.input}
                  type="number"
                  name="price"
                  value={object.price}
                  onChange={updateChange}
                />
              </div>
              <div className={style.input4}>
                <p>Availability</p>
                <div className={style.inStock}>
                  <label id={style.label}>
                    <input
                      type="radio"
                      name="inStock"
                      value="true"
                      onChange={updateChange}
                    />
                    <p>In Stock</p>
                  </label>

                  <label id={style.label}>
                    <input
                      // id={style.radio}
                      type="radio"
                      name="inStock"
                      value="false"
                      onChange={updateChange}
                    />
                    <p> Out of Stock</p>
                  </label>
                </div>
              </div>
              <div className={style.input5}>
                <p>Quantity</p>
                <input
                  id={style.input}
                  type="number"
                  name="quantity"
                  // value={object.quantity}
                  onChange={updateChange}
                />
              </div>
              <div className={style.input6}>
                {/* <input type="image" src="" alt="" /> */}
              </div>
            </form>
            <div className={style.modalFooter}>
              <button id={style.ftbutton1} onClick={hide2}>
                Cancel
              </button>
              <button id={style.ftbutton2} onClick={handleAddFood}>
                Add Food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
