import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	transpilePackages: ["three"],
	output: "export",
};

export default nextConfig;
