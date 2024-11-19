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
	Hud,
	OrbitControls,
	PerspectiveCamera,
	ScreenSpace,
	useGLTF,
} from "@react-three/drei";
import { useScroll } from "motion/react";
import { useControls, useCreateStore } from "leva";

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
		const gl = useThree((state) => state.gl);

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
				const mouseX = state.pointer.x;
				const mouseY = state.pointer.y;

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
				/>
				{/* You can optionally define a custom meshLineMaterial to use. */}
				{/* <meshLineMaterial color={"red"} /> */}

				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_3.geometry}
					material={materials.Window_Frame}
				/>
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
				/>
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
          precision mediump float;
          uniform vec2 u_resolution;
          uniform float u_time;
uniform vec2 u_mouse;
out vec3 distance;
          float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
          float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
          varying vec2 vUv;
          void main() {
            vec3 p =  position*2.;
            float x = position.x + noise(vec2(normalize(p).x));
            float y = position.y +noise(vec2(normalize(p).y));
            float z =  position.z+normalize(p).z;
            distance = vec3(x,y,z);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0) ;
          }
        `,
					fragmentShader: `#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
in vec3 distance;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 10
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .8;
    float frequency = 0.8;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 5.;
        amplitude *= .1;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    vec3 color = vec3(10) * cos(gl_FragCoord.y * gl_FragCoord.x*.0001 + u_time * 2.) * noise(st);

    gl_FragColor = vec4(1., color.y, color.z, 1.);
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
	const [texture] = useState(() => {
		if (typeof window === "undefined") return;
		return new THREE.TextureLoader().load(
			"/pexels.jpg",
			console.log,
			console.error
		);
	});

	return (
		<Canvas dpr={[1, 2]} performance={{ min: 0.1 }} shadows>
			<PerspectiveCamera makeDefault position={[0, 1.5, 3]}></PerspectiveCamera>
			<mesh scale={200} receiveShadow castShadow>
				<boxGeometry />
				<CircleShaderMaterial></CircleShaderMaterial>
			</mesh>
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

			<ContactShadows position={[0, -0.485, 0]} scale={5} far={1} />
		</Canvas>
	);
}

extend({ planeGeometry: THREE.PlaneGeometry });
