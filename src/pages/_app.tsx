import Scene from "@/components/canvas/Scene";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { MutableRefObject, useRef } from "react";

function NavItem({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<li
			className={
				"text-base md:text-2xl p-2  text-[#ffd52b] hover:bg-gray-800 list-none"
			}
		>
			<Link href={href}>{children}</Link>
		</li>
	);
}

const links = [
	{ href: "#", label: "Home" },
	{ href: "#about", label: "About" },
	{ href: "#contact", label: "Contact" },
	{ href: "#blog", label: "Blog" },
	{ href: "#projects", label: "Projects" },
];

export default function App({ Component, pageProps }: AppProps) {
	const ref = useRef<HTMLDivElement>(null);
	return (
		<>
			<header className='flex flex-row w-screen bg-black/60  fixed top-0 z-10 justify-between backdrop-blur-md font-bold uppercase px-4 md:px-10'>
				<nav>
					<ul className='flex flex-row'>
						{links.map(({ href, label }, index) => (
							<NavItem key={index} href={href}>
								{label}
							</NavItem>
						))}
					</ul>
				</nav>
			</header>
			<main className='p-4 lg:p-10 before:pointer-events-none before:-z-10 before:bg-16 before:w-full before:lg:w-1/2 before:h-full before:left-0 before:top-0 before:fixed before:bg-repeat  before:bg-deco relative grid lg:grid-cols-2 grid-cols-1  bg-[#652ec6]/0'>
				<Component {...pageProps} />
				<div
					id='sceneParent'
					ref={ref}
					className='fixed w-screen top-0 lg:w-1/2 -z-10 lg:z-0 right-0 h-screen md:h-screen   contain-size'
				>
					<Scene eventSource={ref as MutableRefObject<HTMLElement>} />
				</div>
			</main>
			<footer className='text-xl px-4 md:p-10'>
				<p>&copy; {new Date().getFullYear()} My Site</p>
			</footer>
		</>
	);
}
