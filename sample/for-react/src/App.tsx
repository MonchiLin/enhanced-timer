import React, { useState } from 'react'
import { HooksApi } from "./HooksApi/HooksApi";

function App() {
  const [componentStyle, updateComponentStyle] = useState<"Hooks" | "Class">("Hooks")

  return (
    <div>
      <HooksApi/>
    </div>
  )
}

export default App

