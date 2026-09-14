import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ClubSnapshot from "./ClubSnapshot";

describe("ClubSnapshot", () => {
  it("introduces ITC with the community numbers and one shared snapshot image", () => {
    const { container } = render(<ClubSnapshot />);

    expect(
      screen.getByRole("heading", {
        name: /where ivey students turn curiosity into capability/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading").querySelector("em")).not.toBeInTheDocument();
    expect(screen.getByText("Ivey students in our community")).toBeInTheDocument();
    expect(screen.getByText("dual-degree students in the club")).toBeInTheDocument();
    expect(screen.getByText("students connected through mentorship")).toBeInTheDocument();
    expect(screen.getByText("150+")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
    expect(screen.getByText("200+")).toBeInTheDocument();

    expect(container.querySelector(".club-snapshot__intro")).toBeInTheDocument();
    expect(
      container.querySelector(".club-snapshot__intro .club-snapshot__media"),
    ).toBeInTheDocument();
    expect(
      container.querySelector(".club-snapshot__intro .club-snapshot__copy"),
    ).toBeInTheDocument();
    expect(container.querySelector(".club-snapshot > .club-snapshot__stats")).toBeInTheDocument();

    expect(container.querySelector("source")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /students gathered on a rooftop in toronto/i })).toBeInTheDocument();
  });
});
