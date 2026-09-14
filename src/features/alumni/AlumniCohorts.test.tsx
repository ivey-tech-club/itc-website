import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import AlumniCohorts from "./AlumniCohorts";
import { consolidateAlumni, parseAlumniCsv } from "./alumni-data";

const historicalAlumni = consolidateAlumni(
  parseAlumniCsv(`FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
Alice,Chen,Exec,2020-2021,Acme,Product Manager,New York,NY,2022,https://www.linkedin.com/in/alice
Jordan,Lee,Co-President,2019-2020,Northstar,Software Engineer,Toronto,ON,2021,https://www.linkedin.com/in/jordan
`),
);

describe("AlumniCohorts", () => {
  it("renders the 2026-2027 presidents before the position rows", () => {
    render(<AlumniCohorts />);

    expect(
      screen.getByRole("heading", { name: "2026-2027 executive team" }),
    ).toBeInTheDocument();
    expect(screen.getByText("2026-2027")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Portrait network" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Departments" })).not.toBeInTheDocument();

    for (const heading of [
      "Presidents",
      "Expedition",
      "Flagship",
      "Careers",
      "Communications",
      "Development",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }

    expect(screen.getByText("Allison Ye")).toBeInTheDocument();
    expect(screen.getByText("Stephanie Li")).toBeInTheDocument();
    expect(screen.getByText("Strategy Analyst @ Capital One")).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Presidents" })).getByText("SWE @ RBC Amplify"),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Presidents" })).getAllByText("Co-President"),
    ).toHaveLength(2);

    const allLinks = screen.getAllByRole("link", { name: /on LinkedIn/ });
    expect(allLinks).toHaveLength(10);
    expect(allLinks[0]).toHaveAttribute("href", "https://ca.linkedin.com/in/-allison-ye");
    expect(allLinks[1]).toHaveAttribute("href", "https://ca.linkedin.com/in/stephanieli802");
    const expeditionRow = screen.getByRole("list", { name: "Expedition" });
    expect(within(expeditionRow).getByText("Natalie Wang")).toBeInTheDocument();
    expect(within(expeditionRow).getByText("Gloria Qi")).toBeInTheDocument();
    expect(screen.getAllByText("Expedition").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Flagship").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Careers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Communications").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Development").length).toBeGreaterThan(0);
    expect(screen.queryByText("LEADERSHIP")).not.toBeInTheDocument();
    expect(screen.queryByText("DEPARTMENT")).not.toBeInTheDocument();
  });

  it("switches between known-position and unknown-position cohorts", async () => {
    const user = userEvent.setup();
    render(<AlumniCohorts alumni={historicalAlumni} />);

    await user.click(screen.getByRole("button", { name: "2025-2026" }));
    expect(screen.getByRole("heading", { name: "2025-2026 alumni" })).toBeInTheDocument();
    for (const heading of [
      "Presidents",
      "Communications",
      "Development",
      "Social",
      "Sponsorship",
      "Expedition",
      "Flagship",
      "Careers",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Jocelyn Chang on LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/jocelyn-chang-a710921b7/",
    );
    expect(
      within(screen.getByRole("list", { name: "Presidents" })).getByText(
        "Software Engineer, Cell Engineering @ Tesla",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Summer Strategy Analyst @ Accenture")).toBeInTheDocument();
    expect(screen.getByText("Data Scientist, AI2 Marketing @ TD")).toBeInTheDocument();
    expect(screen.getByText("Technical Program Management @ Crusoe")).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Presidents" })).getAllByText("Co-President"),
    ).toHaveLength(2);
    expect(screen.queryByText("Allison Ye")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2024-2025" }));
    expect(screen.getByRole("heading", { name: "2024-2025 alumni" })).toBeInTheDocument();
    expect(screen.getByText("Ray Wang")).toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Presidents" })).getAllByText("President"),
    ).toHaveLength(2);
    for (const heading of [
      "Presidents",
      "Design & Community",
      "Development",
      "Events",
      "Expedition",
      "Flagship",
      "Mentorship",
      "Social",
    ]) {
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    }
    expect(screen.queryByText("Jocelyn Chang")).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Design & Community" })).getByText("Jarry Wu"),
    ).toBeInTheDocument();
    expect(screen.getByText("Customer Solutions Manager @ Amazon Web Services")).toBeInTheDocument();
    expect(screen.getByText("Data & Operations @ Super.com")).toBeInTheDocument();
    expect(screen.getByText("Consultant @ Oracle")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer @ Shopify")).toBeInTheDocument();
    expect(screen.getByText("Research Analyst, Market Strategy & Understanding @ Ipsos")).toBeInTheDocument();
    expect(screen.getByText("Technology Consultant Intern @ EY")).toBeInTheDocument();
    expect(screen.getByText("Associate Product Manager Intern, Google Labs @ Google")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2023-2024" }));
    expect(screen.getByRole("heading", { name: "2023-2024 alumni" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Presidents" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Executives" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Carrie Lu on LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/carrielu02/",
    );
    expect(screen.getByText("Sharon Peng")).toBeInTheDocument();
    expect(screen.getAllByText("Software Engineer @ Microsoft")).toHaveLength(2);
    expect(screen.getByText("Operations Engineer @ USC Information Sciences Institute")).toBeInTheDocument();
    expect(screen.getByText("Product Designer @ RightOn Education")).toBeInTheDocument();
    expect(screen.queryByText("Exec")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "2020-2021" }));
    expect(screen.getByRole("heading", { name: "2020-2021 alumni" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Presidents" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Executives" })).toBeInTheDocument();
    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText("Product Manager @ Acme")).toBeInTheDocument();
    expect(screen.queryByText("Ray Wang")).not.toBeInTheDocument();
  });
});
