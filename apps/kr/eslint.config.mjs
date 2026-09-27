import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		// `.wrangler/` is where `wrangler dev` bundles the Worker while it runs —
		// under `npm run preview`, and under `npm run pdf -- --local`, which prints
		// the PDF off a local preview. A run that dies without cleaning up leaves
		// the bundle behind for lint to read.
		ignores: [".next/**", ".open-next/**", ".wrangler/**", "out/**", "next-env.d.ts", "cloudflare-env.d.ts"],
	},
	...nextCoreWebVitals,
	...nextTypescript,
];

export default eslintConfig;
