import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { consolidateAlumni, parseAlumniCsv } from "./alumni-data";

vi.mock("next/dynamic", () => ({
  default: () =>
    function MockAlumniMap({
      clusters,
      onSelectLocation,
    }: {
      clusters: Array<{ key: string; label: string; count: number }>;
      onSelectLocation: (location: string) => void;
    }) {
      return (
        <div aria-label="Alumni locations map">
          {clusters.map((cluster) => (
            <button key={cluster.key} onClick={() => onSelectLocation(cluster.key)}>
              {cluster.label} — {cluster.count} {cluster.count === 1 ? "alum" : "alumni"}
            </button>
          ))}
        </div>
      );
    },
}));

import AlumniExplorer from "./AlumniExplorer";

const alumni = consolidateAlumni(
  parseAlumniCsv(`FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
Alice,Chen,Exec,2020-2021,Acme,Product Manager,New York,NY,2022,https://www.linkedin.com/in/alice
Jordan,Lee,Co-President,2019-2020,Northstar,Software Engineer,Toronto,ON,2021,https://www.linkedin.com/in/jordan
Dani,ONeil,Exec,2021-2022,Launchpad,Founder,San Francisco,CA,2023,https://www.linkedin.com/in/dani
Morgan,Rivera,Exec,2021-2022,Studio,Teacher,,,2023,javascript:alert(1)
`),
);

describe("AlumniExplorer", () => {
  it("renders a semantic directory without the old summary chrome", () => {
    render(<AlumniExplorer alumni={alumni} />);

    expect(screen.getByRole("table", { name: "Alumni directory" })).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.queryByText(/mapped cities/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Location details reflect/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/outside North America/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Filter by city" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Alice Chen on LinkedIn (opens in a new tab)",
      }),
    ).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/alice",
    );
    expect(screen.queryByText("Morgan Rivera")).not.toBeInTheDocument();
  });

  it("searches by company and updates both the table and map", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);

    await user.type(screen.getByRole("searchbox", { name: "Search alumni" }), "launchpad");

    expect(
      screen.getByRole("cell", {
        name: "Dani ONeil on LinkedIn (opens in a new tab)",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("cell", {
        name: "Alice Chen on LinkedIn (opens in a new tab)",
      }),
    ).not.toBeInTheDocument();
    expect(
      within(screen.getByLabelText("Alumni locations map")).getByRole("button", {
        name: "San Francisco, CA — 1 alum",
      }),
    ).toBeInTheDocument();
  });

  it("brings an unlisted-location alum back when the search targets them", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);

    await user.type(screen.getByRole("searchbox", { name: "Search alumni" }), "morgan");

    expect(screen.getByText("Morgan Rivera")).toBeInTheDocument();
    expect(screen.getByText("Location not listed")).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("Alumni locations map")).queryByRole("button"),
    ).not.toBeInTheDocument();
  });

  it("opens keyboard-friendly filters, applies them, and returns focus on Escape", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);
    const filterButton = screen.getByRole("button", { name: "Filter alumni" });

    await user.click(filterButton);

    expect(filterButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Product" })).toHaveFocus();
    expect(screen.queryByRole("checkbox", { name: "New York City" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Engineering" }));
    expect(
      screen.getByRole("cell", {
        name: "Jordan Lee on LinkedIn (opens in a new tab)",
      }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
    expect(filterButton).toHaveFocus();
    expect(filterButton).toHaveAttribute("aria-expanded", "false");
  });

  it("selects a map cluster and reveals Figma-style profile cards", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);

    await user.click(
      within(screen.getByLabelText("Alumni locations map")).getByRole("button", {
        name: "Toronto, ON — 1 alum",
      }),
    );

    const profiles = screen.getByRole("region", { name: "Profiles in Toronto, ON" });
    expect(screen.getByTestId("profile-selection-announcement")).toHaveTextContent(
      "1 alumni profile shown for Toronto, ON",
    );
    expect(within(profiles).getByRole("heading", { name: "Jordan Lee" })).toBeInTheDocument();
    expect(within(profiles).getByText("Northstar")).toBeInTheDocument();

    await user.click(
      within(profiles).getByRole("button", { name: "Close Toronto, ON profiles" }),
    );
    expect(
      screen.queryByRole("region", { name: "Profiles in Toronto, ON" }),
    ).not.toBeInTheDocument();
  });

  it("shows a useful empty state and can reset every control", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);

    await user.type(screen.getByRole("searchbox", { name: "Search alumni" }), "no match anywhere");
    expect(screen.getByText("No alumni match those filters.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset search and filters" }));
    expect(screen.getByRole("searchbox", { name: "Search alumni" })).toHaveValue("");
  });

  it("clears search, clears active filters, and closes on an outside pointer", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);
    const search = screen.getByRole("searchbox", { name: "Search alumni" });
    const filterButton = screen.getByRole("button", { name: "Filter alumni" });

    await user.type(search, "acme");
    expect(
      screen.getByRole("button", { name: "Reset search and filters" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(search).toHaveValue("");

    await user.click(filterButton);
    await user.click(screen.getByRole("checkbox", { name: "Product" }));
    expect(
      screen.getByRole("cell", {
        name: "Alice Chen on LinkedIn (opens in a new tab)",
      }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(
      screen.getByRole("cell", {
        name: "Jordan Lee on LinkedIn (opens in a new tab)",
      }),
    ).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
  });

  it("opens a profile from the directory location control", async () => {
    const user = userEvent.setup();
    render(<AlumniExplorer alumni={alumni} />);

    await user.click(
      screen.getByRole("button", {
        name: "Show Alice Chen on the map in New York City, NY",
      }),
    );
    expect(
      screen.getByRole("region", { name: "Profiles in New York City, NY" }),
    ).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox", { name: "Search alumni" }), "no match");
    expect(
      screen.queryByRole("region", { name: "Profiles in New York City, NY" }),
    ).not.toBeInTheDocument();
  });
});
