/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, {
	forwardRef,
	MutableRefObject,
	useLayoutEffect,
	useRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
	Backdrop,
	ContactShadows,
	Environment,
	Float,
	useGLTF,
} from "@react-three/drei";
import { useScroll } from "motion/react";
// One-click copy/paste from the poimandres market: https://market.pmnd.rs/model/low-poly-spaceship
const Ship = forwardRef<THREE.Group, JSX.IntrinsicElements["group"]>(
	(props, ref) => {
		const { nodes, materials }: any = useGLTF(
			"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/low-poly-spaceship/model.gltf"
		);
		useLayoutEffect(() => {
			Object.values(materials).forEach((material) => {
				(material as THREE.MeshStandardMaterial).roughness = 0;
			});
		}, []);
		const ship = useRef<THREE.Group>();
		const scroll = useScroll();
		useFrame((state) => {
			if (ship.current) {
				ship.current.rotation.y = scroll.scrollYProgress.get() * Math.PI * 2;
			}
		});
		return (
			<group ref={ship} {...props} dispose={null}>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005.geometry}
					material={materials.Mat0}
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_1.geometry}
					material={materials.Mat1}
					material-color='black'
				/>
				<mesh
					castShadow
					receiveShadow
					geometry={nodes.Cube005_2.geometry}
					material={materials.Mat2}
					material-envMapIntensity={0.2}
					material-color='black'
				/>
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
			</group>
		);
	}
);

export default function Scene({ eventSource }) {
	return (
		<Canvas
			dpr={[1, 2]}
			performance={{ min: 0.1 }}
			shadows
			camera={{ position: [0, 1.5, 3] }}
			eventSource={eventSource.current as MutableRefObject<HTMLElement>}
		>
			<ambientLight intensity={1} />
			<directionalLight position={[-10, 0, -5]} intensity={10} color='red' />
			<directionalLight position={[-1, -2, -5]} intensity={2} color='#0c8cbf' />
			<spotLight
				position={[10, 0, 5]}
				intensity={4}
				penumbra={1}
				angle={0.35}
				castShadow
				color='#0c8cbf'
			/>

			<Float scale={0.65} position={[0, 0.65, 0]} rotation={[0, 0.6, 0]}>
				<Ship />
			</Float>
			<Backdrop
				castShadow
				receiveShadow
				floor={2}
				position={[0, -0.5, -3]}
				scale={[50, 10, 4]}
			>
				<meshStandardMaterial color='#353540' envMapIntensity={0.1} />
			</Backdrop>
			<ContactShadows position={[0, -0.485, 0]} scale={5} blur={1.5} far={1} />
			<Environment preset='city' />
		</Canvas>
	);
}
