/**
 * The components live here, and until this file existed none of them were ever
 * linted: `eslint` runs from an app directory and a flat config only reaches
 * files under its own root, so `npm run lint` checked two layouts, two pages
 * and two content files while every component in the monorepo went unread.
 *
 * Same two configs the apps use, so a rule that fails in an app fails here.
 */
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
	{
		ignores: ["public/**"],
	},
	...nextCoreWebVitals,
	...nextTypescript,
	{
		rules: {
			/*
			 * This package holds no routes — it is handed to an app that does — so
			 * the rule has no pages directory to check a link against and only
			 * prints a warning that it could not find one.
			 */
			"@next/next/no-html-link-for-pages": "off",
		},
	},
];

export default eslintConfig;
