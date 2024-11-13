import * as React from "react";
import { motion } from "framer-motion";

export interface IRevealerProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	title: string;
}

export default function Revealer({
	children,
	title,
	...props
}: IRevealerProps) {
	return (
		<section
			className='h-screen max-w-4xl flex flex-col item-center justify-center'
			{...props}
		>
			<motion.h1
				className='text-3xl md:text-8xl font-bold italic [text-shadow:_0_2px_4px_rgb(255_255_241_/_0.8)]'
				initial={{ opacity: 0, x: -100 }}
				whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
			>
				{title}
			</motion.h1>
			<motion.div
				initial={{ opacity: 0, x: -100 }}
				whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
				className='text-2xl font-bold text-gray-300'
			>
				{children}
			</motion.div>
		</section>
	);
}
