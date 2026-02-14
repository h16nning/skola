import { AppBreadcrumbs } from "@/components/AppBreadcrumbs";
import { AppHeaderContent } from "../shell/Header/Header";

function StatsView() {
  return (
    <>
      <AppHeaderContent>
        <AppBreadcrumbs segments={[{ label: "Statistics" }]} />
      </AppHeaderContent>
      <article
        style={{
          width: "100%",
          maxWidth: "var(--max-content-width)",
          color: "var(--theme-neutral-700)",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontFamily: "var(--font-serif)" }}>
          An update on Statistics
        </h1>
        <p>
          As part of our current redesigning efforts the statistics view has
          been temporarily removed. The <code>@mantine/charts</code> package was
          integral to its function which is no longer part of Skola. We are
          currently exploring more lightweight alternatives.
        </p>
        <p>
          The statistics view will be back, more inspired and useful than ever,
          but it will take some time to get there. For now, we focus on making
          the core experience of Skola the best it can be.
        </p>
      </article>
    </>
  );
}

export default StatsView;
