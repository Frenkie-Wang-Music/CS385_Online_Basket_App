import React, { useState } from "react";

// for simplicity we use a static array for our shop inventory
// The data for your inventory could be replaced by an API.
import { inventory } from "./inventory";

import basketPicture from "./images/basket.png";
import logoBanner from "./images/banner.png";

function App() {
  // productChoice is a state variable - initially null
  const [productChoice, setProductChoice] = useState(null);
  // This is our shopping basket array - initially an empty array.
  const [basket, setBasket] = useState([]);

  // Allow for switching between different product categories
  function changeProductCategory(pc) {
    setProductChoice(pc);
  }

  // add an item (object) to the shopping basket array
  function addItemToBasket(item) {
    // we use the Javascript SPREAD operator
    setBasket([...basket, item]);
  }

  // remove all items from the current basket
  // This just requires resetting the basket to
  // an empty basket
  function emptyBasket() {
    setBasket([]);
  }

  // This is used by findIndex - it simply checks if the
  // current object in the array (haystack) has the same pid as the
  // object passed (needle)
  function findObjectIndex(needle) {
    return function (haystack) {
      return haystack.pid === needle.pid;
    };
  }
  // This is used by the filter approach to object removal
  // This tries to find objects in the array (haystack)
  // that DO NOT have the same pid as the object being searched (needle)
  function findObjectFilterRemove(needle) {
    return function (haystack) {
      return haystack.pid !== needle.pid;
    };
  }

  // This removes an item (object) from the basket in state
  // we take great care not to mutate state.
  function removeItemFromBasket(item) {
    let n = basket.findIndex(findObjectIndex(item));
    setBasket([...basket.slice(0, n), ...basket.slice(n + 1, basket.length)]);
    //setBasket(basket.filter(findObjectFilterRemove(item)));
  }

  return (
    <>
      <img src={logoBanner} alt="CS385 branding" />
      <h2>We have {inventory.length} items for sale, right now!</h2>
      <p>The product you are chosing is <b>{productChoice}</b> </p>
      <button onClick={() => changeProductCategory("Vegetables")}>
        Vegetables
      </button>
      &nbsp;
      <button onClick={() => changeProductCategory("Flowers")}>Flowers</button>
      &nbsp;
      <button onClick={() => changeProductCategory("Fruits")}>Fruits</button>
      &nbsp;
      <button onClick={() => changeProductCategory(null)}>Reset Choice</button>
      &nbsp;
      {basket.length > 0 && (
        <>
          <button onClick={emptyBasket}>Empty Basket</button>
        </>
      )}
      {productChoice && (
        <ShowProductsComponent
          inventory={inventory}
          choice={productChoice}
          addItemToBasket={addItemToBasket}
        />
      )}
      {basket.length > 0 && (
        <>
          <Basket basket={basket} removeItemFromBasket={removeItemFromBasket} />
        </>
      )}
      <br /> <br />
      <img src={logoBanner} alt="CS385 branding" />
    </>
  );
}

/* This is the ShowProductsComponent 
It is primarily used to allow us to display products
and encapsulate this code away from the parent App component */
function ShowProductsComponent(props) {
  // a filter function for productCategory
  function productFilter(prod) {
    return function (productsObject) {
      return productsObject.type === prod;
    };
  }
  // use filter to find the number of items for this product
  let n = props.inventory.filter(productFilter(props.choice));

  return (
    <>
      <hr />
      <h3>
        Our {props.choice} products ({n.length} items)
      </h3>

      {props.inventory.filter(productFilter(props.choice)).map((p, index) => (
        <p key={index}>
          {p.plant.name},€{p.plant.price.toFixed(2)}{" "}
          <button onClick={() => props.addItemToBasket(p)}>
            Add to basket
          </button>
        </p>
      ))}
    </>
  );
} // end of ShowProductsComponent

// This is the Basket component.
// This component deals with the display of the current
// shopping basket.

function Basket(props) {
  // create a call back for the reduce function
  // note how we access the price of each object.
  function getBasketTotal(acc, obj) {
    return acc + obj.plant.price;
  }

  return (
    <>
      <hr />
      <h3>Your shopping basket</h3>
      <img alt="shopping basket" src={basketPicture} />
      <p>
        Your basket has <b>{props.basket.length}</b> items
      </p>
      <p>
        <b>Total cost: €{props.basket.reduce(getBasketTotal, 0)}</b>
      </p>
      {props.basket.map((p, index) => (
        <p key={index}>
          {p.plant.name},€{p.plant.price.toFixed(2)}{" "}
          <button onClick={() => props.removeItemFromBasket(p)}>Remove</button>
        </p>
      ))}
    </>
  );
}
export default App;

