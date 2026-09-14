"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

import type { AlumniProfile } from "./alumni-data";
import { getAlumniName, safeLinkedInUrl } from "./alumni-data";
import { getAlumniHeadshot } from "./alumni-headshots";
import styles from "./Alumni.module.css";
import { CURRENT_TEAM } from "./current-team";

import jocelyn from "../../assets/team/jocelyn.jpg";
import ronin from "../../assets/team/ronin.jpg";
import audrey from "../../assets/team/audrey.jpg";
import laura from "../../assets/team/laura.jpg";
import jennifer from "../../assets/team/jennifer.jpg";
import laurel from "../../assets/team/laurel.jpg";
import harvey from "../../assets/team/harvey.jpg";
import uttej from "../../assets/team/uttej.jpg";
import ashiti from "../../assets/team/ashiti.jpg";
import evan from "../../assets/team/evan.jpg";
import affan from "../../assets/team/affan.jpg";
import pranav from "../../assets/team/pranav.jpg";
import carina from "../../assets/team/carina.jpg";
import sophia from "../../assets/team/sophia.jpg";
import marianna from "../../assets/team/marianna.jpg";
import lecia from "../../assets/team/lecia.jpg";

type CohortMember = {
  name: string;
  department?: string;
  title: string;
  description?: string;
  image?: string | StaticImageData;
  linkedin?: string;
};

type CohortSection = {
  id: string;
  label: string;
  members: readonly CohortMember[];
};

const TEAM_2024_2025: readonly CohortMember[] = [
  { name: "Ray Wang", department: "Leadership", title: "President", description: "Cohere", image: "/alumni/historical/2024-2025/ray-wang.jpg", linkedin: "https://ca.linkedin.com/in/raywang-ca" },
  { name: "Vivek Jariwala", department: "Leadership", title: "President", description: "Customer Solutions Manager @ Amazon Web Services", image: "/alumni/historical/2024-2025/vivek-jariwala.jpg", linkedin: "https://ca.linkedin.com/in/vivek-jariwala" },
  { name: "Jarry Wu", department: "Design & Community", title: "Executive", description: "Consultant @ Konrad", image: "/alumni/historical/2024-2025/jarry-wu.jpg", linkedin: "https://ca.linkedin.com/in/jarry-wu" },
  { name: "Bonnie Qiu", department: "Design & Community", title: "Executive", description: "Data & Operations @ Super.com", image: "/alumni/historical/2024-2025/bonnie-qiu.jpg", linkedin: "https://ca.linkedin.com/in/bonnie-qiu" },
  { name: "Charlotte Lemon", department: "Design & Community", title: "Executive", description: "Product Designer @ Stealth", image: "/alumni/historical/2024-2025/charlotte-lemon.jpg", linkedin: "https://ca.linkedin.com/in/charlotte-lemon" },
  { name: "Kyle Chen", department: "Development", title: "Executive", description: "Software Engineer @ Shopify", image: "/alumni/historical/2024-2025/kyle-chen.jpg", linkedin: "https://www.linkedin.com/in/kyleechen/" },
  { name: "Noah Xu", department: "Development", title: "Executive", description: "Summer Associate @ Boston Consulting Group (BCG)", image: "/alumni/historical/2024-2025/noah-xu.jpg", linkedin: "https://ca.linkedin.com/in/noah-z-xu" },
  { name: "Daniel Pang", department: "Events", title: "Executive", image: "/alumni/historical/2024-2025/daniel-pang.jpg", linkedin: "https://ca.linkedin.com/in/-danielpang" },
  { name: "Erin Hu", department: "Expedition", title: "Executive", description: "Consultant @ Oracle", image: "/alumni/historical/2024-2025/erin-hu.jpg", linkedin: "https://ca.linkedin.com/in/huerin" },
  { name: "Belinda Zhao", department: "Expedition", title: "Executive", description: "Research Analyst, Market Strategy & Understanding @ Ipsos", image: "/alumni/historical/2024-2025/belinda-zhao.jpg", linkedin: "https://www.linkedin.com/in/belindaaz/" },
  { name: "Mayo Olusanya", department: "Events", title: "Executive", description: "Founder @ Western Transportation Engineering Club", image: "/alumni/historical/2024-2025/mayo-olusanya.jpg", linkedin: "https://ca.linkedin.com/in/mayoolusanya" },
  { name: "Bruce Liu", department: "Events", title: "Executive", description: "Growth Product Manager Intern @ Loop Financial", image: "/alumni/historical/2024-2025/bruce-liu.jpg", linkedin: "https://ca.linkedin.com/in/bliu445" },
  { name: "Sophia Ma", department: "Events", title: "Executive", description: "Operations @ Contrario", image: "/alumni/historical/2024-2025/sophia-ma.jpg", linkedin: "https://www.linkedin.com/in/ma-sophia" },
  { name: "Izzie Pewarchuk", department: "Flagship", title: "Executive", description: "Technology Consultant Intern @ EY", image: "/alumni/historical/2024-2025/izzie-pewarchuk.jpg", linkedin: "https://www.linkedin.com/in/ipewar/" },
  { name: "Bianca Bhardwaj", department: "Flagship", title: "Executive", description: "AI / Strategy @ CIBC", image: "/alumni/historical/2024-2025/bianca-bhardwaj.jpg", linkedin: "https://ca.linkedin.com/in/biancabhardwaj" },
  { name: "Joy Zheng", department: "Mentorship", title: "Executive", description: "Software Engineering @ Patreon", image: "/alumni/historical/2024-2025/joy-zheng.jpg", linkedin: "https://ca.linkedin.com/in/joy-zheng8" },
  { name: "Grace Zhou", department: "Mentorship", title: "Executive", description: "Product Manager @ Stealth", image: "/alumni/historical/2024-2025/grace-zhou.jpg", linkedin: "https://ca.linkedin.com/in/grace-zhou-6364b717b" },
  { name: "Ana Balteanu", department: "Mentorship", title: "Executive", description: "Full Stack Developer @ RBC", image: "/alumni/historical/2024-2025/ana-balteanu.jpg", linkedin: "https://ca.linkedin.com/in/ana-balteanu" },
  { name: "Sarah Huang", department: "Social", title: "Executive", description: "Associate Product Manager Intern, Google Labs @ Google", image: "/alumni/historical/2024-2025/sarah-huang.jpg", linkedin: "https://www.linkedin.com/in/sarahpeihuang" },
  { name: "Dennis Zhang", department: "Social", title: "Executive", description: "Intern @ AMD", image: "/alumni/historical/2024-2025/dennis-zhang.jpg", linkedin: "https://ca.linkedin.com/in/dennis-zhang99" },
];

const TEAM_2025_2026: readonly CohortMember[] = [
  { name: "Jocelyn Chang", department: "Leadership", title: "Co-President", description: "Software Engineer, Cell Engineering @ Tesla", image: jocelyn, linkedin: "https://www.linkedin.com/in/jocelyn-chang-a710921b7/" },
  { name: "Ronin Williams-Young", department: "Leadership", title: "Co-President", description: "Software Engineer @ Manulife", image: ronin, linkedin: "https://www.linkedin.com/in/ronin-williams-young/" },
  { name: "Audrey Li", department: "Communications", title: "Executive", description: "Product @ Kiyoko Beauty", image: audrey, linkedin: "https://www.linkedin.com/in/audreylii/" },
  { name: "Laura Caraccio", department: "Communications", title: "Executive", description: "Impact Investing Summer Analyst @ SVX", image: laura, linkedin: "https://www.linkedin.com/in/laura-caraccio/" },
  { name: "Jennifer Cao", department: "Development", title: "Executive", description: "Engineering @ Citi", image: jennifer, linkedin: "https://www.linkedin.com/in/jenniferrcao/" },
  { name: "Laurel Dong", department: "Social", title: "Executive", description: "Summer Strategy Analyst @ Accenture", image: laurel, linkedin: "https://www.linkedin.com/in/laurel-dong/" },
  { name: "Harvey Zhu", department: "Social", title: "Executive", description: "Strategy Analyst Intern @ Capital One", image: harvey, linkedin: "https://www.linkedin.com/in/harvey-zhu/" },
  { name: "Uttej Mannava", department: "Sponsorship", title: "Executive", description: "Point72", image: uttej, linkedin: "https://www.linkedin.com/in/-um/" },
  { name: "Ashiti Patel", department: "Sponsorship", title: "Executive", description: "Data Scientist, AI2 Marketing @ TD", image: ashiti, linkedin: "https://www.linkedin.com/in/ashiti-patel/" },
  { name: "Evan Woo", department: "Expedition", title: "Executive", description: "Consulting Intern @ Oliver Wyman", image: evan, linkedin: "https://www.linkedin.com/in/evan-woo/" },
  { name: "Affan Bhimani", department: "Expedition", title: "Executive", description: "Analyst @ PJT Partners", image: affan, linkedin: "https://www.linkedin.com/in/affan-bhimani-9297361bb/" },
  { name: "Pranav Arora", department: "Flagship", title: "Executive", description: "IT Risk Advisory Intern @ KPMG Canada", image: pranav, linkedin: "https://www.linkedin.com/in/pranav-arora-ca/" },
  { name: "Carina Luo", department: "Flagship", title: "Executive", description: "Industrial Placement Analyst @ Morgan Stanley", image: carina, linkedin: "https://www.linkedin.com/in/carina-luo/" },
  { name: "Sophia Yuan", department: "Careers", title: "Executive", description: "Digital Marketing LDP Intern @ Burger King", image: sophia, linkedin: "https://www.linkedin.com/in/sophiay888/" },
  { name: "Marianna Speranza", department: "Careers", title: "Executive", description: "AI & Data Intern @ IBM", image: marianna, linkedin: "https://www.linkedin.com/in/mariannasperanza/" },
  { name: "Lecia Cheng", department: "Careers", title: "Executive", description: "Technical Program Management @ Crusoe", image: lecia, linkedin: "https://www.linkedin.com/in/lecia-cheng/" },
]; 

const TEAM_2023_2024: readonly CohortMember[] = [
  { name: "Carrie Lu", department: "Leadership", title: "Co-President", description: "Software Engineer @ Microsoft", image: "/alumni/historical/2023-2024/carrie-lu.jpg", linkedin: "https://www.linkedin.com/in/carrielu02/" },
  { name: "Mohamed Mohamed", department: "Leadership", title: "Co-President", description: "Consultant @ Isaac Operations", image: "/alumni/historical/2023-2024/mohamed-mohamed.png", linkedin: "https://www.linkedin.com/in/mohamed-mohamed7/" },
  { name: "Sharon Peng", title: "Executive", description: "Software Engineer @ Microsoft", image: "/alumni/historical/2023-2024/sharon-peng.jpg", linkedin: "https://www.linkedin.com/in/pengsharon/" },
  { name: "Ansel Zeng", title: "Executive", description: "Operations Engineer @ USC Information Sciences Institute", image: "/alumni/historical/2023-2024/ansel-zeng.jpg", linkedin: "https://www.linkedin.com/in/anselzeng/" },
  { name: "Molly Chen", title: "Executive", description: "Consultant @ Monitor Deloitte", image: "/alumni/historical/2023-2024/molly-chen.jpg", linkedin: "https://www.linkedin.com/in/mollychen2/" },
  { name: "Karen Truong", title: "Executive", description: "Consultant @ EY", image: "/alumni/historical/2023-2024/karen-truong.jpg", linkedin: "https://www.linkedin.com/in/karentruong17/" },
  { name: "Justin Yan", title: "Executive", description: "Product / Technology @ Microsoft", image: "/alumni/historical/2023-2024/justin-yan.JPG", linkedin: "https://www.linkedin.com/in/justinyan13/" },
  { name: "Laura Zhao", title: "Executive", description: "Product Designer @ RightOn Education", image: "/alumni/historical/2023-2024/laura-zhao.jpg", linkedin: "https://www.linkedin.com/in/lauraazhao/" },
  { name: "Emily Lao", title: "Executive", description: "RBC Capital Markets", image: "/alumni/historical/2023-2024/emily-lao.jpg", linkedin: "https://www.linkedin.com/in/elao/" },
  { name: "Mylan Nguyen", title: "Executive", description: "Technology / Business Transformation Consulting @ PwC Canada", image: "/alumni/historical/2023-2024/mylan-nguyen.jpg", linkedin: "https://www.linkedin.com/in/mylan-nguyen/" },
  { name: "Amr Mohamed", title: "Executive", description: "Healthcare Quality / Innovation @ London Health Sciences Centre", image: "/alumni/historical/2023-2024/amr-mohamed.png", linkedin: "https://www.linkedin.com/in/amr-mohamed1/" },
];

function displayCohort(cohort: string) {
  return cohort.replace(/(\d{4})-(\d{4})/, "$1-$2");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function memberSubtitle(member: Pick<CohortMember, "title">) {
  return member.title;
}

function employmentDescription(profile: Pick<AlumniProfile, "jobPosition" | "company">) {
  const jobPosition = profile.jobPosition.trim();
  const company = profile.company.trim();

  if (!jobPosition && !company) return undefined;
  if (!jobPosition) return `@ ${company}`;
  if (!company) return jobPosition;
  return `${jobPosition} @ ${company}`;
}

function sectionSlug(sectionId: string) {
  return sectionId.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CohortRosterCard({ member }: { member: CohortMember }) {
  const content = (
    <>
      <span className={styles.cohortRosterImage} aria-hidden="true">
        {member.image ? (
          <Image
            src={member.image}
            alt=""
            fill
            sizes="(max-width: 680px) 100px, 128px"
          />
        ) : (
          initials(member.name)
        )}
      </span>
      <span className={styles.cohortRosterCopy}>
        <strong>{member.name}</strong>
        <span>{memberSubtitle(member)}</span>
        {member.description ? (
          <span className={styles.cohortRosterDescription}>{member.description}</span>
        ) : null}
      </span>
    </>
  );

  return (
    <li>
      {member.linkedin ? (
        <a
          className={styles.cohortRosterMember}
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
        >
          {content}
        </a>
      ) : (
        <div className={styles.cohortRosterMember}>{content}</div>
      )}
    </li>
  );
}

function createKnownSections(team: readonly CohortMember[]): CohortSection[] {
  const departments = Array.from(
    new Set(
      team
        .filter(
          (member): member is CohortMember & { department: string } =>
            Boolean(member.department) && member.department !== "Leadership",
        )
        .map((member) => member.department),
    ),
  );

  return [
    {
      id: "presidents",
      label: "Presidents",
      members: team.filter((member) => member.department === "Leadership"),
    },
    ...departments.map((department) => ({
      id: department,
      label: department,
      members: team.filter((member) => member.department === department),
    })),
  ];
}

function createUnknownSections(team: readonly CohortMember[]): CohortSection[] {
  return [
    {
      id: "presidents",
      label: "Presidents",
      members: team.filter((member) => member.department === "Leadership"),
    },
    {
      id: "executives",
      label: "Executives",
      members: team.filter((member) => member.department !== "Leadership"),
    },
  ];
}

function createHistoricalSections(
  cohort: string,
  alumni: readonly AlumniProfile[],
): CohortSection[] {
  const members = alumni
    .filter((profile) => profile.cohorts.includes(cohort))
    .sort((left, right) => {
      const leftLeader = /president/i.test(left.role) ? 0 : 1;
      const rightLeader = /president/i.test(right.role) ? 0 : 1;
      return leftLeader - rightLeader || getAlumniName(left).localeCompare(getAlumniName(right));
    })
    .map((profile) => ({
      name: getAlumniName(profile),
      department: /president/i.test(profile.role) ? "Leadership" : undefined,
      title: profile.role || "Executive",
      description: employmentDescription(profile),
      image: getAlumniHeadshot(profile) ?? undefined,
      linkedin: safeLinkedInUrl(profile.linkedin) || undefined,
    }));

  return createUnknownSections(members);
}

function CohortRoster({ sections }: { sections: readonly CohortSection[] }) {
  return (
    <div className={styles.cohortRoster}>
      {sections.map((section) => {
        const headingId = `cohort-section-${sectionSlug(section.id)}`;

        return (
          <section
            className={styles.cohortRosterSection}
            key={section.id}
            aria-labelledby={headingId}
          >
            <h3 id={headingId}>{section.label}</h3>
            <ul className={styles.cohortRosterList} aria-label={section.label}>
              {section.members.map((member) => (
                <CohortRosterCard key={member.name} member={member} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export default function AlumniCohorts({ alumni = [] }: { alumni?: readonly AlumniProfile[] }) {
  const earlierCohorts = Array.from(new Set(alumni.flatMap((profile) => profile.cohorts)))
    .filter(
      (cohort) =>
        cohort !== "2025-2026" && cohort !== "2026-2027" && cohort !== "2024-2025" && cohort !== "2023-2024",
    )
    .sort((left, right) => right.localeCompare(left));
  const cohortOptions = ["2026-2027", "2025-2026", "2024-2025", "2023-2024", ...earlierCohorts];
  const [selectedCohort, setSelectedCohort] = useState("2026-2027");
  const isCurrent = selectedCohort === "2026-2027";
  const displayTitle = isCurrent
    ? "2026-2027 executive team"
    : `${displayCohort(selectedCohort)} alumni`;
  const selectedSections =
    selectedCohort === "2026-2027"
      ? createKnownSections(CURRENT_TEAM)
      : selectedCohort === "2025-2026"
        ? createKnownSections(TEAM_2025_2026)
        : selectedCohort === "2024-2025"
          ? createKnownSections(TEAM_2024_2025)
          : selectedCohort === "2023-2024"
            ? createUnknownSections(TEAM_2023_2024)
            : createHistoricalSections(selectedCohort, alumni);

  return (
    <section
      className={styles.cohortsSection}
      id="alumni-years"
      aria-labelledby="cohorts-title"
    >
      <div className={styles.cohortsHeader}>
        <div>
          <p>{isCurrent ? "Current team" : "Alumni"}</p>
          <h2 id="cohorts-title">{displayTitle}</h2>
        </div>
      </div>

      <div className={styles.cohortPicker} role="group" aria-label="Choose an ITC cohort">
        {cohortOptions.map((cohort) => (
          <button
            type="button"
            key={cohort}
            aria-pressed={selectedCohort === cohort}
            onClick={() => setSelectedCohort(cohort)}
          >
            {displayCohort(cohort)}
          </button>
        ))}
      </div>

      <div className={styles.cohortCanvas}>
        <div
          className={styles.cohortView}
          aria-label={displayTitle}
        >
          <CohortRoster sections={selectedSections} />
        </div>
      </div>
    </section>
  );
}
