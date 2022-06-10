import { useMemo } from "react";
import { BackSide, Color, IcosahedronGeometry, ShaderMaterial } from "three";

const haloShader = {
  v: `
  varying vec3 vVertexWorldPosition;
  varying vec3 vVertexNormal;
  
  void main() {
  
    vVertexNormal = normalize(normalMatrix * normal);
  
    vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  
    // set gl_Position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
    `,
  f: `
  uniform vec3 glowColor;
uniform float coeficient;
uniform float power;

varying vec3 vVertexNormal;
varying vec3 vVertexWorldPosition;

void main() {
  vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
  vec3 viewCameraToVertex = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
  viewCameraToVertex = normalize(viewCameraToVertex);
  float intensity =
      pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);

  gl_FragColor = vec4(glowColor, intensity * 0.3  );
}
    `
};

function Outer({ color, geometry }) {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: haloShader.v,
        fragmentShader: haloShader.f,
        uniforms: {
          coeficient: { value: 0.25 },
          power: { value: 5 },
          glowColor: { value: new Color(color || "#6b7fff") }
        },
        side: BackSide,
        transparent: true,
        depthWrite: false
      }),
    []
  );

  return (
    <group scale={[1.2, 1.2, 1.2]}>
      <mesh material={mat} geometry={geometry} />
    </group>
  );
}

function Inner({ color, geometry }) {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: haloShader.v,
        fragmentShader: haloShader.f,
        uniforms: {
          coeficient: { value: 1 },
          power: { value: 1.7 },
          glowColor: { value: new Color(color || "#6b7fff") }
        },
        transparent: true,
        depthWrite: true
      }),
    []
  );

  return (
    <group scale={[1.0001, 1.0001, 1.0001]}>
      <mesh material={mat} geometry={geometry} />
    </group>
  );
}

export default function Halo(props) {
  const g = useMemo(() => new IcosahedronGeometry(1, 32), []);

  return (
    <group>
      <Inner geometry={g} {...props} />
      <Outer geometry={g} {...props} />
    </group>
  );
}
