import React, { useState } from 'react'
import { SigongGrid } from "./components/SigongGrid";
import { HooksApiExample1 } from "./HooksApi/HooksApiExample1";
import { HooksApiExample2 } from "./HooksApi/HooksApiExample2";
import { ClassApiExample1 } from './ClassApi/ClassApiExample1';
import { ClassApiExample2 } from './ClassApi/ClassApiExample2';

function App() {

  return (
    <div>
      <SigongGrid
        TopLeft={HooksApiExample1}
        TopRight={HooksApiExample2}
        BottomLeft={ClassApiExample1}
        BottomRight={ClassApiExample2}
      />
    </div>
  )
}

export default App

