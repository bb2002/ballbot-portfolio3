/**
 * The 0.5px rule the design places between cards in a row — vertical while the
 * row is side-by-side, horizontal once it stacks. `stack` names the breakpoint
 * the row turns at, so the rule always flips with the layout it divides.
 */
export function Rule({ stack = "lg" }: { stack?: "sm" | "lg" | "xl" }) {
	const orientation = {
		sm: "h-[0.5px] w-full sm:h-auto sm:w-[0.5px]",
		lg: "h-[0.5px] w-full lg:h-auto lg:w-[0.5px]",
		xl: "h-[0.5px] w-full xl:h-auto xl:w-[0.5px]",
	}[stack];
	return <div aria-hidden="true" className={`bg-border shrink-0 self-stretch ${orientation}`} />;
}
