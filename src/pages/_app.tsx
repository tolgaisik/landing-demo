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
				"text-base md:text-2xl p-2 bg-black hover:bg-gray-800 list-none"
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
			<header className='flex flex-row w-screen  fixed top-0 z-10 justify-between bg-black font-bold uppercase px-4 md:px-10'>
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
			<main
				ref={ref}
				className='p-4 lg:p-10 relative bg-gradient-to-r grid grid-cols-3'
			>
				<Component {...pageProps} />
				<div className='fixed top-0 w-1/2 right-0 h-[inherit] md:h-screen -z-10 bg-[url(https://pbs.twimg.com/media/GbocRZrXQAAOFQi?format=jpg&name=large)] contain-size'>
					<Scene eventSource={ref as MutableRefObject<HTMLElement>} />
				</div>
			</main>
			<footer className='text-xl px-4 md:p-10'>
				<p>&copy; {new Date().getFullYear()} My Site</p>
			</footer>
		</>
	);
}
