import { Hero } from "@/components/hero";
import { NavBar } from "@/components/nav-bar";
import { ScrollCue } from "@/components/scroll-cue";
import { SectionPager } from "@/components/section-pager";
import { Certificates } from "@/components/sections/certificates";
import { Experience } from "@/components/sections/experience";
import { Journey } from "@/components/sections/journey";
import { Projects } from "@/components/sections/projects";
import { Resume } from "@/components/sections/resume";

/**
 * The .pen file draws six frames. The nav bar repeats identically at the foot
 * of the hero and the head of the other five, so it is rendered once here and
 * pinned with `position: sticky` — it starts at the hero's lower edge and rides
 * to the top of the viewport as the sections scroll past.
 *
 * NavBar must stay a direct child of this flow (not nested inside the hero) or
 * its sticky containing block would end with the hero. It also stays outside
 * <main>, so the page's only navigation landmark is not buried inside it.
 *
 * `data-section` marks the six screens: the pager jumps from the first to the
 * second and animates nav links to any of them, reading the order off the DOM.
 * The hero's marker sits on <header> even though the nav and cue below it close
 * that screen — they are sticky and full-bleed, and wrapping them would end the
 * nav's sticky containing block at the hero's foot.
 */
export default function Home() {
	return (
		<>
			<header data-section>
				<Hero />
			</header>
			<NavBar />
			<ScrollCue />
			<main>
				<Projects />
				<Experience />
				<Certificates />
				<Journey />
				<Resume />
			</main>
			<SectionPager />
		</>
	);
}
