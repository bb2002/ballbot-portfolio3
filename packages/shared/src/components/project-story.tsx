import { ArrowLeft } from "lucide-react";

import type {
  ArchiveProject,
  FeaturedProject,
  GalleryLabels,
  ProjectsContent,
  ProjectStoryContent,
} from "../content-types";
import { ImagePlaceholder } from "./ui/image-placeholder";
import { page } from "./ui/layout";
import { ProjectLinks } from "./ui/project-links";
import { Reveal } from "./ui/reveal";
import { ScreenSlider } from "./ui/screen-slider";
import { SectionLabel } from "./ui/section-label";
import { Bullet, Paragraphs, PROSE, StoryBody } from "./ui/story-body";
import { ZoomImage } from "./ui/zoom-image";

type Project = FeaturedProject | ArchiveProject;

/**
 * Where a Highlights line jumps to. The two lists are the same list when there
 * is one essay per line — Highlights names the questions, Architecture answers
 * them — so the anchor is the index rather than anything the content file has
 * to carry and keep in sync.
 */
const essayId = (index: number) => `story-essay-${index}`;

/**
 * The design questions, one after another under a single head. Each opens
 * on its own title; the body is laid out by StoryBody in the order the content
 * file put it, so a diagram lands where the text turns to it.
 */
function Architecture({
  content,
  title,
  labels,
}: {
  content: NonNullable<ProjectStoryContent["architecture"]>;
  title: string;
  labels?: GalleryLabels;
}) {
  return (
    <section data-section aria-labelledby="story-architecture">
      <SectionLabel id="story-architecture">{content.label}</SectionLabel>
      <div className={`${page} flex flex-col pb-6`}>
        {content.items.map((essay, index) => (
          <article
            key={essay.title}
            id={essayId(index)}
            className={`flex scroll-mt-16 flex-col gap-8 py-10 sm:gap-10 ${index > 0 ? "border-border border-t-[0.5px]" : "pt-0"}`}
          >
            <Reveal>
              <h3
                className={`text-text-strong text-heading leading-[1.25] font-bold tracking-[-0.01em] ${PROSE}`}
              >
                {essay.title}
              </h3>
            </Reveal>
            {/* One step under the essay's own <h3>, so a sub-head reads as part
                of the essay in the outline rather than as its sibling. */}
            <StoryBody body={essay.body} title={title} labels={labels} headingAs="h4" />
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * The recording, under its own head. It sits at the reading measure rather
 * than running the page the way a figure does: a diagram has detail to read
 * close, a recording is watched, and at 760px it is the size of a player
 * rather than a second hero. The frame goes to YouTube's no-cookie host and
 * is not fetched until it scrolls near, so the page costs nothing extra on
 * load for carrying one. Fullscreen is granted through `allow` alone: with
 * the legacy `allowfullscreen` beside it the browser logs that one is
 * ignored, and it is the same permission twice.
 */
function Video({
  content,
}: {
  content: NonNullable<ProjectStoryContent["video"]>;
}) {
  return (
    <section data-section aria-labelledby="story-video">
      <SectionLabel id="story-video">{content.label}</SectionLabel>
      <Reveal className={`${page} pb-14`}>
        <div
          className={`bg-surface relative aspect-video w-full overflow-hidden rounded-lg ${PROSE}`}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${content.youtubeId}`}
            title={content.title}
            loading="lazy"
            allow="fullscreen; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </Reveal>
    </section>
  );
}

/**
 * One project, on a page of its own — the long form the card's two lines stand
 * in for. It is built from the same screens as the home page: each block opens
 * on the mono head and the 2px rule every section there opens on, the prose
 * sits at a reading measure, and the media runs wider where it has to.
 *
 * The bar at the top stands in for the site nav, whose links are `#section`
 * anchors that only resolve on the home page. It goes back to the list the
 * reader came from, not to the top of the site.
 *
 * `anim-in` on the header and <Reveal> below it: the title block is what the
 * page opens on, so it takes the hero's load-time entrance; everything under
 * it arrives as it is scrolled to, like the sections on the home page.
 */
export function ProjectStory({
  content,
  project,
  story,
}: {
  content: ProjectsContent;
  project: Project;
  story: ProjectStoryContent;
}) {
  const labels = content.gallery;
  const appIcon = "appIcon" in project ? project.appIcon : undefined;
  const linked =
    story.architecture?.items.length === story.highlights?.length;

  // `id="main"` is where the layout's skip link lands; `tabIndex={-1}` is what
  // lets a <main> take that focus at all.
  return (
    <main id="main" tabIndex={-1} className="flex min-h-svh flex-col">
      <div className="border-border border-b-[0.5px]">
        <div className={`${page} py-6`}>
          <a
            href="/#projects"
            className="group text-text-secondary hover:text-text-strong inline-flex items-center gap-1.5 font-mono text-[14px] transition-colors duration-300"
          >
            <ArrowLeft
              aria-hidden="true"
              strokeWidth={1.75}
              className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-smooth)] group-hover:-translate-x-0.5"
            />
            {story.labels.back}
          </a>
        </div>
      </div>

      {/* The head is the home page's hero, turned to one project: the title
			    block on the left, the screens on the right, the facts under the title.
			    Three blocks, so a phone can read them in its own order — title, then
			    the screens, then the facts — while from `lg` the grid puts the facts
			    back under the title and hands the slider the wider column. */}
      <header
        className={`${page} flex flex-col gap-10 pt-12 pb-12 sm:pt-16 sm:pb-16 lg:grid lg:grid-cols-[400px_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-10`}
      >
        <div className="flex flex-col gap-4 sm:gap-5 lg:col-start-1 lg:row-start-1">
          <p
            className="anim-in text-text-secondary text-meta font-mono font-light"
            style={{ animationDelay: "60ms" }}
          >
            {project.period}
          </p>
          <div
            className="anim-in flex items-start gap-3"
            style={{ animationDelay: "120ms" }}
          >
            {appIcon ? (
              <ImagePlaceholder
                media={appIcon}
                sizes="48px"
                className="mt-0.5 h-10 w-10 shrink-0 rounded-lg sm:mt-1 sm:h-12 sm:w-12"
              />
            ) : null}
            {/* One line, whatever the viewport: a project's own name is the one
						    string on the page that must never break, and the column is sized
						    to carry it beside the icon at the display step. */}
            <h1 className="text-text-strong sm:text-display text-[34px] leading-[1.15] font-bold tracking-[-0.02em] whitespace-nowrap">
              {project.title}
            </h1>
          </div>
          <p
            className="anim-in text-text-secondary text-[17px] leading-[1.5] font-medium tracking-[-0.01em] sm:text-[20px]"
            style={{ animationDelay: "180ms" }}
          >
            {story.tagline}
          </p>
          <div className="anim-in" style={{ animationDelay: "240ms" }}>
            <ProjectLinks links={project.links} title={project.title} />
          </div>
        </div>

        {project.gallery?.length && labels ? (
          <div
            className="anim-in min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1"
            style={{ animationDelay: "300ms" }}
          >
            <ScreenSlider
              items={project.gallery}
              title={project.title}
              labels={labels}
            />
          </div>
        ) : null}

        {/* Every row opens on a hairline, the first included: on a phone it is
				    what parts the list from the rail above it, and under the title it
				    is the rule the hero draws under a figure. */}
        <dl
          className="anim-in flex flex-col lg:col-start-1 lg:row-start-2 lg:self-start"
          style={{ animationDelay: "360ms" }}
        >
          {story.facts.map((fact) => (
            <div
              key={fact.term}
              className="border-border flex flex-col gap-1 border-t-[0.5px] py-4"
            >
              <dt className="text-text-secondary text-meta">
                {fact.term}
              </dt>
              <dd className="text-text-strong text-[17px] leading-snug font-semibold">
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {story.highlights?.length ? (
        <section data-section aria-labelledby="story-highlights">
          <SectionLabel id="story-highlights">
            {story.labels.highlights}
          </SectionLabel>
          <Reveal className={`${page} pb-14`}>
            <ul className={`flex flex-col gap-1.5 ${PROSE}`}>
              {story.highlights.map((line, index) => {
                const row = (
                  <>
                    <Bullet />
                    <span className="text-text-strong min-w-0 text-[15px] leading-[1.5] sm:text-[17px]">
                      {line}
                    </span>
                  </>
                );
                return (
                  <li key={line}>
                    {/* A line goes to the essay that answers it, and only when
                        every line has one: half a list that responds to a press
                        reads as a list that is partly broken. The tint under
                        the pointer is the one a name in the prose carries — a
                        row this long wraps, and a sliding underline cannot
                        follow it onto the second line. */}
                    {linked ? (
                      <a
                        href={`#${essayId(index)}`}
                        className="hover:bg-surface -mx-2 flex items-start rounded-[3px] px-2 py-1 transition-colors duration-300"
                      >
                        {row}
                      </a>
                    ) : (
                      <div className="flex items-start px-2 py-1">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </section>
      ) : null}

      <section data-section aria-labelledby="story-motivation">
        <SectionLabel id="story-motivation">
          {story.labels.motivation}
        </SectionLabel>
        <Reveal className={`${page} pb-14`}>
          <Paragraphs text={story.motivation} />
        </Reveal>
      </section>

      {story.video ? <Video content={story.video} /> : null}

      {story.steps?.length ? (
        <section data-section aria-labelledby="story-process">
          <SectionLabel id="story-process">{story.labels.process}</SectionLabel>
          <div className={`${page} pb-4`}>
            {/* One row per step, split by hairlines: when and what on the left,
					    the screen it left behind and the account of it on the right.
					    Below `lg` the head stacks over the body, the period still first. */}
            <ol className="flex flex-col">
              {story.steps.map((step, index) => (
                <li
                  key={step.title}
                  className={index > 0 ? "border-border border-t-[0.5px]" : ""}
                >
                  <Reveal className="flex flex-col gap-5 py-10 lg:flex-row lg:gap-10">
                    <div className="flex flex-col gap-2 lg:w-[260px] lg:shrink-0">
                      <p className="text-text-secondary text-meta font-mono">
                        {step.period}
                      </p>
                      <h3 className="text-text-strong text-card leading-snug font-bold">
                        {step.title}
                      </h3>
                    </div>
                    <div
                      className={`flex min-w-0 flex-1 flex-col gap-6 ${PROSE}`}
                    >
                      {step.images?.length ? (
                        <div className="flex flex-col gap-3">
                          {step.images.map((media, at) => (
                            <ZoomImage
                              key={media.src ?? at}
                              media={media}
                              title={step.title}
                              labels={labels}
                            />
                          ))}
                        </div>
                      ) : null}
                      <Paragraphs text={step.paragraphs} />
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {story.architecture ? (
        <Architecture
          content={story.architecture}
          title={project.title}
          labels={labels}
        />
      ) : null}

      {/* The last word, at the reading measure: it answers none of the
          Highlights lines, so it stands outside Architecture rather than
          becoming a fourth essay the first line would anchor to. */}
      {story.retrospective ? (
        <section data-section aria-labelledby="story-retrospective">
          <SectionLabel id="story-retrospective">
            {story.retrospective.label}
          </SectionLabel>
          <Reveal className={`${page} pb-14`}>
            <Paragraphs text={story.retrospective.paragraphs} />
          </Reveal>
        </section>
      ) : null}
    </main>
  );
}
