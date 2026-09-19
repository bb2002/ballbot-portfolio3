/**
 * Everything a market app composes its page from. The content schema comes
 * out of the same entry point, so an app imports the components and the shape
 * of the copy they expect in one line.
 *
 * `lib/resume-request` is deliberately not re-exported here: the route handler
 * that validates a submission is server-only, and pulling it through this
 * barrel would drag the client components into its module graph.
 */

export * from "./content-types";

export { Hero } from "./components/hero";
export { NavBar } from "./components/nav-bar";
export { ResumeForm } from "./components/resume-form";
export { ScrollCue } from "./components/scroll-cue";
export { SectionPager } from "./components/section-pager";

export { Certificates } from "./components/sections/certificates";
export { Experience } from "./components/sections/experience";
export { Journey } from "./components/sections/journey";
export { Projects } from "./components/sections/projects";
export { Resume } from "./components/sections/resume";

export { Emphasised } from "./components/ui/emphasised";
export { ImagePlaceholder, ThumbFrame } from "./components/ui/image-placeholder";
export { page } from "./components/ui/layout";
export { Reveal } from "./components/ui/reveal";
export { Rule } from "./components/ui/rule";
export { SectionLabel } from "./components/ui/section-label";
