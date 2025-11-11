import React, { useState, useEffect } from "react";

// for simplicity we use a static array for our shop inventory
// The data for your inventory could be replaced by an API.
// import { inventory } from "./inventory";
import basketPicture from "./images/basket.png";
import logoBanner from "./images/banner.png";

function App() {
  // productChoice is a state variable - initially null
  const [productChoice, setProductChoice] = useState(null);
  // This is our shopping basket array - initially an empty array.
  const [basket, setBasket] = useState([]);

  // the data response from the API – initially empty array
  const [inventory, setInventory] = useState([]);
  // a flag to indicate the data is loading – initially false
  const [loading, setLoading] = useState(false);
  // a flag to indicate an error, if any – initially null
  const [error, setError] = useState(null);

  // Here is useEffect for our Organic Shop Inventory
  useEffect(() => {
    const URL =
      "https://raw.githubusercontent.com/Frenkie-Wang-Music/CS385DataSet/refs/heads/main/BasketData/inventory.json";

    async function fetchInventoryData() {
      try {
        const response = await fetch(URL);
        const inventoryDataJson = await response.json(); // wait for the JSON response
        setLoading(true);

        // IMPORTANT – look at the JSON response – look at the structure
        // This is where many errors occur!
        // Check out the JSON in raw format – the array is called 'inventory'
        setInventory(inventoryDataJson);
      } catch (e) {
        setError(e); // take the error message from the system
        setLoading(false);
      } // end try-catch block
    } // end of fetchInventoryData

    fetchInventoryData(); // invoke fetchInventoryData in useEffect
  }, []); // end of useEffect


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
  // current object in the array (arrayObject) has the same pid as the
  // object passed (input)
  function findObjectIndex(input) {
    return function (arrayObject) {
      return arrayObject.pid === input.pid;
    };
  }
  
  // This is used by the filter approach to object removal
  // This tries to find objects in the array (arrayObject)
  // that DO NOT have the same pid as the object being searched (input)
  function findObjectFilterRemove(input) {
    return function (arrayObject) {
      return arrayObject.pid !== input.pid;
    };
  }

  // This removes an item (object) from the basket in state
  // we take great care not to mutate state.
  function removeItemFromBasket(item) {
    let n = basket.findIndex(findObjectIndex(item));
    setBasket([...basket.slice(0, n), ...basket.slice(n + 1, basket.length)]);
    //setBasket(basket.filter(findObjectFilterRemove(item)));
  }

  // compare product items based on their price.
  // we want ASCENDING ORDER
  function comparePriceAsc(objA, objB) {
    let comparison = 0;

    if (objA.plant.price > objB.plant.price) comparison = 1;
    else if (objA.plant.price < objB.plant.price) comparison = -1;
    else comparison = 0;

    return comparison;
  }

  // compare function for the NAMES of plants
  // ascending - alphabetical order.
  // Javascript will figure out the alphabetical ordering in the event
  // of a tie or equal letters.
  function compareName(objA, objB) {
    let comparison = 0;
    let objAStr = objA.plant.name.toLowerCase();
    let objBStr = objB.plant.name.toLowerCase();

    if (objAStr > objBStr) comparison = 1;
    else if (objAStr < objBStr) comparison = -1;
    else comparison = 0;

    return comparison;
  }

  if (error) {
    return <h1>Opps! An error has occurred: {error.toString()}</h1>;
  } else if (loading === false) {
    return <h1>Waiting for the organic shop inventory data ...... waiting...</h1>;
  } else {
    return (
      <>
        <div className = "container-fluid">
          <img src={logoBanner} className = "img-fluid" alt="CS385 branding" />
          <h1>CS385 Online Basket App</h1>
          <h2>We have {inventory.length} items for sale, right now!</h2>
          <p className = "lead">
            Welcome to our own online shop at CS385. You can browse our products
            with buttons below. Happy Shopping! {" "}
          </p>
          <p>The product you are chosing is <b>{productChoice}</b> </p>
          <button 
            className = "btn btn-primary"
            onClick={() => changeProductCategory("Vegetables")}
          >
            Vegetables
          </button>
          &nbsp;
          <button 
            className = "btn btn-primary"
            onClick={() => changeProductCategory("Flowers")}
          >
            Flowers
          </button>
          &nbsp;
          <button 
            className = "btn btn-primary"
            onClick={() => changeProductCategory("Fruits")}
          >
            Fruits
          </button>
          &nbsp;
          <button 
            className = "btn btn-primary"
            onClick={() => changeProductCategory(null)}
          >
            Reset Choice
          </button>
          &nbsp;
          {basket.length > 0 && (
            <>
              <button
                className = "btn btn-danger"
                onClick={emptyBasket}
              >
                Empty Basket
              </button>
            </>
          )}

          <hr />
          {productChoice && (
            <ShowProductsComponent
              inventory={inventory}
              choice={productChoice}
              addItemToBasket={addItemToBasket}
              sorting = {compareName}
            />
          )}

          {basket.length > 0 && (
            <>
              <Basket 
                basket={basket} 
                removeItemFromBasket={removeItemFromBasket}
                sorting = {comparePriceAsc}
              />
            </>
          )}
          <br /> <br />
          <img src={logoBanner} alt="CS385 branding" />
        </div>
      </>
    );
  }
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
      <div className = "alert alert-info" role = "alert">
        <h3>
          Our {props.choice} products ({n.length} items)
        </h3>
        <div class = "table-responsive">
          <table class = "table table-hover table-bordered border-primary table-sm">
            <tbody>
              {props.inventory
                .filter(productFilter(props.choice))
                .sort(props.sorting)
                .map((p, index) => (
                  <tr key={index}>
                    <td>{p.plant.name}</td>
                    <td>{p.plant.price.toFixed(2)}</td>
                    <td>
                      <button 
                        className = "btn btn-warning"
                        onClick={() => props.addItemToBasket(p)}
                      >
                        Add to basket
                      </button>
                    </td>   
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
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
      <div className = "alert alert-secondary" role = "alert">
        <h3>Your shopping basket</h3>
        <img alt="shopping basket" src={basketPicture} />
        <p>
          Your basket has <b>{props.basket.length}</b> items
        </p>
        <p>
          <b>Total cost: €{props.basket.reduce(getBasketTotal, 0)}</b>
        </p>
        {props.basket.sort(props.sorting).map((p, index) => (
          <p key={index}>
            {p.plant.name},€{p.plant.price.toFixed(2)}{" "}
            <button 
              className = "btn btn-info"
              onClick={() => props.removeItemFromBasket(p)}
            >
              Remove
            </button>
          </p>
        ))}
      </div>
    </>
  );
}

export default App;