import React from 'react'
import { HooksApiExample1 } from "./HooksApiExample1";
import { SigongGrid } from "../components/SigongGrid";
import { HooksApiExample2 } from './HooksApiExample2';

export function HooksApi() {

  return <SigongGrid
    TopLeft={HooksApiExample1}
    TopRight={HooksApiExample2}
  />
}
