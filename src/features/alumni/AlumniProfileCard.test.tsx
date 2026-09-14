import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AlumniProfileCard from "./AlumniProfileCard";
import type { AlumniProfile } from "./alumni-data";

const baseProfile: AlumniProfile = {
  id: "alex-kim",
  firstName: "Alex",
  lastName: "Kim",
  role: "Exec",
  yearOnITC: "2020-2021",
  cohorts: ["2020-2021"],
  company: "Acme Labs",
  jobPosition: "Product Manager",
  city: "New York",
  state: "NY",
  gradYear: "2022",
  linkedin: "https://www.linkedin.com/in/alex",
};

describe("AlumniProfileCard", () => {
  it("renders full public profile details and a safe LinkedIn action", () => {
    render(<AlumniProfileCard alumni={baseProfile} />);

    expect(screen.getByRole("heading", { name: "Alex Kim" })).toBeInTheDocument();
    expect(screen.getByText("New York City, NY")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Alex Kim on LinkedIn/ })).toHaveAttribute(
      "href",
      baseProfile.linkedin,
    );
  });

  it("uses honest fallbacks and omits an unsafe external action", () => {
    render(
      <AlumniProfileCard
        alumni={{
          ...baseProfile,
          firstName: "",
          lastName: "",
          company: "",
          jobPosition: "",
          role: "",
          city: "",
          state: "",
          linkedin: "https://example.com/not-linkedin",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "ITC alum" })).toBeInTheDocument();
    expect(screen.getByText("Company not listed")).toBeInTheDocument();
    expect(screen.getByText("Role not listed")).toBeInTheDocument();
    expect(screen.getByText("Location not listed")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
