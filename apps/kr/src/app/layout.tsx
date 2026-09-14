import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/**
 * Pretendard is self-hosted out of /public/fonts as its *dynamic subset* build:
 * ~92 unicode-range slices, so a visitor downloads only the Hangul blocks the
 * page actually paints instead of the single 2MB variable file. next/font can
 * not host that — `localFont` rewrites one @font-face per `src` and would drop
 * the ranges — so the stylesheet is linked directly, preloaded ahead of it, and
 * /fonts/* is served immutable (public/_headers).
 */
const PRETENDARD_CSS = "/fonts/pretendard/pretendardvariable-dynamic-subset.css";

/** 600 is the section-label weight; 300/400 are the mono meta lines. */
const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["300", "400", "600"],
	display: "swap",
	variable: "--font-ibm-plex-mono",
});

/**
 * Each market is its own host, so this build's canonical URL is its own and the
 * `languages` map is how a crawler finds the other one. `x-default` points at
 * the apex, which is the only URL that decides for the reader.
 */
export const metadata: Metadata = {
	metadataBase: new URL("https://kr.ballbot.dev"),
	title: "ballbot.dev | Software Engineer",
	description: "백엔드 엔지니어 ballbot의 포트폴리오. 프로젝트, 경력, 수상 이력과 지금까지의 여정을 소개합니다.",
	alternates: {
		canonical: "/",
		languages: {
			ko: "https://kr.ballbot.dev",
			ja: "https://jp.ballbot.dev",
			"x-default": "https://ballbot.dev",
		},
	},
	openGraph: {
		title: "ballbot.dev | Software Engineer",
		description: "백엔드 엔지니어 ballbot의 포트폴리오.",
		url: "https://kr.ballbot.dev",
		locale: "ko_KR",
		type: "website",
	},
};

export const viewport: Viewport = {
	themeColor: "#ffffff",
	colorScheme: "light",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className={ibmPlexMono.variable} suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				{/* React 19 hoists this and emits its own <link rel="preload" as="style">
				    for it, so an explicit preload here would only duplicate that tag. */}
				<link rel="stylesheet" href={PRETENDARD_CSS} />
				{/*
				 * Marks the document as JS-capable before first paint — scroll-reveal
				 * styles key off `html.js`, so nothing is hidden when scripting is off.
				 * The timer is the other half of that guarantee: the first <Reveal> to
				 * mount stamps `hydrated`, so if React never boots (bundle blocked, JS
				 * error) the class is dropped and the whole page becomes visible again.
				 */}
				<script
					dangerouslySetInnerHTML={{
						__html:
							'var r=document.documentElement;r.classList.add("js");' +
							'setTimeout(function(){if(!r.classList.contains("hydrated"))r.classList.remove("js")},4000)',
					}}
				/>
			</head>
			<body className="antialiased">{children}</body>
		</html>
	);
}
