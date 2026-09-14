import {
	Certificates,
	Experience,
	Hero,
	Journey,
	NavBar,
	Projects,
	Resume,
	ScrollCue,
	SectionPager,
} from "@ballbot/shared";

import { certificates, experience, hero, journey, nav, overview, projects, resume, scrollCue } from "@/content/portfolio";

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
 *
 * The components come from @ballbot/shared and hold no copy of their own: this
 * file is the whole of what makes the page Korean, which is what lets the
 * Japanese build compose the same pieces in a different order.
 */
export default function Home() {
	return (
		<>
			<header data-section>
				<Hero content={hero} overview={overview} />
			</header>
			<NavBar content={nav} />
			<ScrollCue content={scrollCue} />
			<main>
				<Projects content={projects} />
				<Experience content={experience} />
				<Certificates content={certificates} />
				<Journey content={journey} />
				<Resume content={resume} />
			</main>
			<SectionPager />
		</>
	);
}
