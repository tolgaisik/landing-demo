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
	OrbitControls,
	PerspectiveCamera,
	shaderMaterial,
	useGLTF,
} from "@react-three/drei";
import { useScroll } from "motion/react";
import { useControls } from "leva";

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

		const [texture] = useState(() =>
			typeof document !== "undefined"
				? new THREE.TextureLoader().load("/deco.png", (texture) => {
						texture.wrapS = THREE.RepeatWrapping;
						texture.wrapT = THREE.RepeatWrapping;
				  })
				: null
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
					material={
						new THREE.MeshToonMaterial({
							color: new THREE.Color("red"),
							side: THREE.DoubleSide,
							shadowSide: THREE.DoubleSide,
						})
					}
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
	const scroll = useScroll();

	useEffect(() => {
		// Update mouse position
		if (gl.domElement) {
			gl.domElement.addEventListener("pointermove", (event) => {
				if (material.current) {
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
			material.current.uniforms.u_scroll.value = scroll.scrollYProgress.get();
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
uniform float u_seed;
uniform float u_scroll;
out vec3 distance;
varying vec2 vUv;

// Function to generate random noise
float random(vec2 st) {
    return fract(sin(dot(st.xy + u_seed, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Function to generate smooth noise
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec3 p = position;
    float scroll = min(u_scroll, 0.99);
    float x = sin(position.x * scroll) + cos(position.x * scroll);
    float y = cos(position.y * scroll) + sin(position.y * scroll);
    float z = sin(position.z * scroll) + cos(position.z * scroll);
    vec3 transformed = vec3(x, y, z) - vec3(.01);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}`,
					fragmentShader: `
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;
          void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    float d = length(st - 0.5) * exp(u_scroll) * sin(2.*u_time);
    d = smoothstep(0.25, 0.2495, d);
    d = 1.0 - d * 0.5;
    gl_FragColor = vec4(d, st.xy, 1.0);
}`,
					uniforms: {
						u_resolution: {
							value: new THREE.Vector2(canvasResolution.x, canvasResolution.y),
						},
						u_mouse: { value: new THREE.Vector2(0, 0) },
						u_time: { value: 0.0 },
						u_scroll: { value: 0.0 },
						u_seed: { value: Math.random() * 100.0 }, // Add seed uniform
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

	const { color, intensity } = useControls({ color: [0, 0, 0], intensity: 1 });

	return (
		<Canvas dpr={[1, 2]} performance={{ min: 0.1 }} shadows>
			<PerspectiveCamera makeDefault position={[0, 1.5, 3]}></PerspectiveCamera>

			<ambientLight intensity={intensity} />
			<directionalLight
				intensity={intensity}
				color={color}
				position={[0, 10, 0]}
			/>

			<mesh position={[0, 1, 0]} scale={20}>
				<planeGeometry args={[10, 10, 30, 30]} />
				<CircleShaderMaterial wireframe />
			</mesh>
			<OrbitControls />
			<Environment preset='city' background blur={1} ground />
			<ContactShadows position={[0, -0.485, 0]} scale={5} far={1} />
		</Canvas>
	);
}

extend({ planeGeometry: THREE.PlaneGeometry });
extend({ shaderMaterial: THREE.ShaderMaterial });
extend({ meshBasicMaterial: THREE.MeshBasicMaterial });
