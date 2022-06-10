import { Suspense, useRef } from "react";
import "./styles.css";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useHelper } from "@react-three/drei";
import Earth from "./models/Earth";
import Halo from "./models/Halo";
import Lights from "./models/Lights";
import { Leva } from "leva";
import RenderOrder from "./Renderorder";
import { sRGBEncoding } from "three";

export default function App() {
  return (
    <main>
      <Leva collapsed />

      <Canvas
        gl={{
          antialias: true,
          outputEncoding: sRGBEncoding,
          pixelRatio: devicePixelRatio
        }}
        camera={{
          position: [0, 1, 1.5]
        }}
      >
        <Suspense fallback={null}>
          <Earth />
          <Halo color={"#0000ff"} />

          {/* <axesHelper />
          <gridHelper /> */}

          <Lights />
          <RenderOrder />
        </Suspense>
      </Canvas>
    </main>
  );
}
