import * as React from "react";
import { motion } from "framer-motion";

export interface IRevealerProps {
	children: React.ReactNode;
	title: string;
}

export default function Revealer(props: IRevealerProps) {
	return (
		<section className='h-screen max-w-4xl flex flex-col item-center justify-center'>
			<motion.h1
				className='text-8xl font-bold italic'
				initial={{ opacity: 0, x: -100 }}
				whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
			>
				{props.title}
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, x: -100 }}
				whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
				className='text-2xl font-bold text-gray-300'
			>
				{props.children}
			</motion.p>
		</section>
	);
}
