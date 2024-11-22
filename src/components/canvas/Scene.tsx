/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, {
	forwardRef,
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	Canvas,
	extend,
	ShaderMaterialProps,
	useFrame,
	useThree,
} from "@react-three/fiber";
import * as THREE from "three";
import {
	ContactShadows,
	Environment,
	Float,
	Html,
	PerspectiveCamera,
	useGLTF,
} from "@react-three/drei";
import { useScroll } from "motion/react";

// One-click copy/paste from the poimandres market: https://market.pmnd.rs/model/low-poly-spaceship
const Ship = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(
	(props, ref) => {
		console.log(ref);
		const [positions] = useState(() => {
			return [
				[2, 3.700000000000001, 5],
				[-2.5, 0.3999999999999999, 2.700000000000002],
				[0.19999999999999765, 0.3999999999999999, 2.700000000000002],
				[-0.5000000000000052, 4.700000000000001, 0.5000000000000029],
			];
		});
		const { nodes, materials }: any = useGLTF(
			"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf"
		);

		useLayoutEffect(() => {
			const colors = [new THREE.Color(0x000000)];
			Object.values(materials).forEach((material, index) => {
				(material as THREE.MeshStandardMaterial).metalness = 10;
				(material as THREE.MeshStandardMaterial).roughness = 10;
				(material as THREE.MeshStandardMaterial).color =
					colors[index % colors.length];
			});
		}, []);
		const ship = useRef<THREE.Group>(null);
		const scroll = useScroll();

		useFrame((state, delta) => {
			if (ship.current) {
				const camera = state.camera;

				const progress = scroll.scrollYProgress.get();
				const currentTargetPosition = new THREE.Vector3();
				if (progress === 1) {
					return;
				} else if (progress < 0.25) {
					currentTargetPosition.fromArray(positions.at(0) as number[]);
				} else if (progress < 0.5) {
					currentTargetPosition.fromArray(positions.at(1) as number[]);
				} else if (progress < 0.75) {
					currentTargetPosition.fromArray(positions.at(2) as number[]);
				} else {
					currentTargetPosition.fromArray(positions.at(3) as number[]);
				}

				const toWorldPosition = ship.current.localToWorld(
					currentTargetPosition
				);

				camera.position.lerp(toWorldPosition, delta);

				camera.lookAt(ship.current.position);
			}
		});

		return (
			<group
				ref={ship}
				{...props}
				dispose={null}
				castShadow
				receiveShadow
				onPointerOver={() => {
					console.log("hovered");
				}}
			>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005.geometry}
					material={materials.Mat0}
				/>

				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_2.geometry}
					material={materials.Mat2}
				/>

				{/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_1.geometry}
					material={materials.Mat1}
				>
					<CircleShaderMaterial attach='material' />
				</mesh>
				{/* You can optionally define a custom meshLineMaterial to use. */}
				{/* <meshLineMaterial color={"red"} /> */}

				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_3.geometry}
				></mesh>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_4.geometry}
					material={materials.Mat4}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_6.geometry}
					material={materials.Window}
				></mesh>
				<Html>
					<div className='absolute top-0 left-0 p-4 border text-white bg-black bg-opacity-50'>
						<h1 className='text-2xl'>Low Poly Spaceship</h1>
						<p className='text-sm'>by heroesofnft</p>
					</div>
				</Html>
			</group>
		);
	}
);

function CircleShaderMaterial(shaderMaterialProps: ShaderMaterialProps) {
	const [canvasResolution] = useState(() => {
		const canvasElement = document.getElementById("sceneParent");
		const innerWidth = canvasElement?.clientWidth || window.innerWidth;
		const innerHeight = canvasElement?.clientHeight || window.innerHeight;
		return new THREE.Vector2(innerWidth * 1, innerHeight);
	});

	const gl = useThree((state) => state.gl);
	const prevTime = useRef(0);
	const material = useRef<THREE.ShaderMaterial>(null);

	useEffect(() => {
		// Update mouse position
		if (gl.domElement) {
			gl.domElement.addEventListener("pointermove", (event) => {
				if (material.current) {
					console.log(event.clientX, event.clientY);
					material.current.uniforms.u_mouse.value = new THREE.Vector2(
						event.clientX,
						event.clientY
					);
				}
			});
		}
	}, [gl.domElement]);

	useFrame((state, delta) => {
		if (material.current) {
			material.current.uniforms.u_time.value = prevTime.current;
			prevTime.current += delta;
		}
	});

	return (
		<shaderMaterial
			attach='material'
			{...shaderMaterialProps}
			side={THREE.DoubleSide}
			ref={material}
			args={[
				{
					vertexShader: `
          uniform vec2 u_resolution;
          uniform float u_time;
          uniform vec2 u_mouse;
          out vec3 distance;
          varying vec2 vUv;
          void main() {
            float d =  position.x + sin(position.y + u_time) * 0.1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(d, position.yz, 1.0) ;
          }
        `,
					fragmentShader: `uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.965, 2.265, 0.837);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv =(gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;
    vec2 uv0 = uv;

    vec3 finalColor = vec3(0.0);

    for(float i =.0; i < 3.; i++) {
      uv = fract(uv * 2.) - .5;

      float d = length(uv) * exp(-length(uv));

      vec3 color = palette(length(uv0) + u_time / 2.);

      d = sin(d * 8. + u_time) / 8.;
      d = abs(d);

      d = 0.02 / d;

      finalColor += color * d;
    }



    gl_FragColor = vec4(finalColor,1.0);
}`,
					uniforms: {
						u_resolution: {
							value: new THREE.Vector2(canvasResolution.x, canvasResolution.y),
						},
						u_mouse: { value: new THREE.Vector2(0, 0) },
						u_time: { value: 0.0 },
					},
				},
			]}
		/>
	);
}

export default function Scene({
	eventSource,
}: {
	eventSource: MutableRefObject<HTMLElement>;
}) {
	console.log(eventSource);

	return (
		<Canvas dpr={[1, 2]} performance={{ min: 0.1 }} shadows>
			<PerspectiveCamera makeDefault position={[0, 1.5, 3]}></PerspectiveCamera>

			<ambientLight intensity={250} />
			<pointLight position={[0, 0, 0]} intensity={0.5} />
			<spotLight
				color='white'
				angle={0.2}
				intensity={400}
				castShadow
				position={[5, 10, 5]}
			/>
			<spotLight
				angle={0.2}
				color='blue'
				intensity={400}
				castShadow
				position={[5, 10, 5]}
			/>

			<Float scale={0.65} position={[0, 0.65, 0]} rotation={[0, 0.6, 0]}>
				<Ship />
			</Float>

			<Environment preset='warehouse' background />

			<ContactShadows position={[0, -0.485, 0]} scale={5} far={1} />
		</Canvas>
	);
}

extend({ planeGeometry: THREE.PlaneGeometry });
extend({ CircleShaderMaterial });
