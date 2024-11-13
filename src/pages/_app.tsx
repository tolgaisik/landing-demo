import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

function NavItem({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<li className={"text-2xl p-2 bg-black hover:bg-gray-800 list-none"}>
			<Link href={href}>{children}</Link>
		</li>
	);
}

const links = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
	{ href: "/blog", label: "Blog" },
	{ href: "/projects", label: "Projects" },
];

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<header className='flex flex-row w-screen justify-between bg-black font-bold uppercase px-4 md:px-20'>
				<NavItem href='/'>My Site Name</NavItem>
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
			<main className='p-4 md:p-20 relative bg-gradient-to-r from-black via-black to-black/5 '>
				<Component {...pageProps} />
				<div className='fixed top-0 left-0  w-screen h-screen -z-10 bg-[url(https://pbs.twimg.com/media/GbocRZrXQAAOFQi?format=jpg&name=large)] contain-size'></div>
			</main>
			<footer className='text-xl px-4 md:px-20'>
				<p>&copy; {new Date().getFullYear()} My Site</p>
			</footer>
		</>
	);
}
