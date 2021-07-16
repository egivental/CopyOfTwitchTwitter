A short guide on how to use the store in this folder:

## Imports
```
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
```

## Local State in a Component
```
const [incrementAmount, setIncrementAmount] = useState("2");

```

where `incrementAmount` is the getter and `setIncrementAmount()` is the setter. Use `useState("2")` makes the default value of `incrementAmount` to be `2`.

## Create a Store State
`counterState.js`
```
import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based on those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

```

## Import the Counter State
```
import counterState from "./counterState";
```

## Read Store State in a Component
```
const count = useSelector((state) => state.counter.value);
```

## Perform Actions on a Store State in a Component
```
const dispatch = useDispatch();
```
and
```
onClick={() => dispatch(counterState.actions.increment())}
```