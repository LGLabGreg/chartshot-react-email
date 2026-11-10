import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";
import { Chart } from "./chart";

export interface WeeklyDigestProps {
  company: string;
  /** The week's first and last day, as shown in the header. */
  week: string;
  dashboardUrl: string;
  /** MRR in US dollars. `change` is the fraction since last week: 0.032 is +3.2%. */
  mrr: { value: number; change: number; weeks: string[]; history: number[] };
  signups: { total: number; change: number; days: string[]; perDay: number[] };
  /** Churn as a fraction: 0.018 is 1.8%. */
  churn: { rate: number; change: number; history: number[] };
  /**
   * Light or dark charts. Charts are images with their own background, so this is set when the
   * email is built, not by the reader's dark mode.
   */
  mode?: "light" | "dark";
}

const sample: WeeklyDigestProps = {
  company: "Acme",
  week: "2 to 8 November 2026",
  dashboardUrl: "https://example.com/dashboard",
  mrr: {
    value: 48250,
    change: 0.032,
    weeks: [
      "2026-08-17", "2026-08-24", "2026-08-31", "2026-09-07", "2026-09-14", "2026-09-21",
      "2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02",
    ],
    history: [38900, 39600, 40350, 41100, 41800, 42650, 43400, 44200, 45100, 45900, 46755, 48250],
  },
  signups: {
    total: 1042,
    change: 0.081,
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    perDay: [142, 168, 155, 189, 204, 96, 88],
  },
  churn: { rate: 0.018, change: -0.1, history: [0.026, 0.025, 0.024, 0.023, 0.022, 0.021, 0.02, 0.018] },
};

const locale = "en-US";

const colours = {
  light: { page: "#f4f4f5", card: "#ffffff", ink: "#18181b", muted: "#52525b", rule: "#e4e4e7" },
  dark: { page: "#09090b", card: "#18181b", ink: "#fafafa", muted: "#a1a1aa", rule: "#27272a" },
};

export default function WeeklyDigest({
  company = sample.company,
  week = sample.week,
  dashboardUrl = sample.dashboardUrl,
  mrr = sample.mrr,
  signups = sample.signups,
  churn = sample.churn,
  mode = "light",
}: Partial<WeeklyDigestProps>) {
  const c = colours[mode];
  const chart = { theme: "mono", mode, background: c.card } as const;

  return (
    <Html lang="en">
      <Head />
      <Preview>{`${company} this week: MRR ${usd(mrr.value)}, ${count(signups.total)} signups`}</Preview>
      <Body style={{ margin: 0, padding: "32px 12px", backgroundColor: c.page, fontFamily }}>
        <Container style={{ maxWidth: 600, backgroundColor: c.card, borderRadius: 12, padding: "32px 24px" }}>
          <Text style={{ margin: 0, fontSize: 13, color: c.muted }}>{company} · Weekly digest</Text>
          <Heading as="h1" style={{ margin: "4px 0 24px", fontSize: 24, lineHeight: "32px", color: c.ink }}>
            {week}
          </Heading>

          <Row>
            <Column style={{ width: "50%", paddingRight: 6 }}>
              <Chart
                width={220}
                height={110}
                maxWidth={270}
                alt={`MRR ${usd(mrr.value)}, ${pct(mrr.change)} on last week`}
                spec={{
                  type: "kpi",
                  ...chart,
                  data: { label: "MRR", value: mrr.value, delta: mrr.change, trend: mrr.history },
                  options: { locale, padding: 0, valueFormat: "currency:USD", deltaFormat: "percent" },
                }}
              />
            </Column>
            <Column style={{ width: "50%", paddingLeft: 6 }}>
              <Chart
                width={220}
                height={110}
                maxWidth={270}
                alt={`Churn ${pct(churn.rate, false)}, ${pct(churn.change)} on last week`}
                spec={{
                  type: "kpi",
                  ...chart,
                  data: { label: "Churn", value: churn.rate, delta: churn.change, trend: churn.history },
                  options: {
                    locale,
                    padding: 0,
                    valueFormat: "percent",
                    deltaFormat: "percent",
                    increaseIsGood: false,
                  },
                }}
              />
            </Column>
          </Row>

          <Section style={{ marginTop: 32 }}>
            <Chart
              width={460}
              height={230}
              maxWidth={552}
              alt={`MRR over the last ${mrr.history.length} weeks, from ${usd(mrr.history[0] ?? 0)} to ${usd(mrr.value)}`}
              spec={{
                type: "area",
                ...chart,
                data: { labels: mrr.weeks, series: [{ name: "MRR", values: mrr.history }] },
                options: {
                  locale,
                  padding: 0,
                  title: "MRR",
                  subtitle: `Last ${mrr.history.length} weeks`,
                  curve: "monotone",
                  points: false,
                  xAxis: { format: "date:d MMM" },
                  yAxis: { format: "currency:USD" },
                },
              }}
            />
          </Section>

          <Section style={{ marginTop: 32 }}>
            <Chart
              width={460}
              height={230}
              maxWidth={552}
              alt={`${count(signups.total)} signups this week, ${pct(signups.change)} on last week`}
              spec={{
                type: "bar",
                ...chart,
                data: { labels: signups.days, series: [{ name: "Signups", values: signups.perDay }] },
                options: {
                  locale,
                  padding: 0,
                  title: "Signups",
                  subtitle: `${count(signups.total)} this week, ${pct(signups.change)}`,
                  valueLabels: true,
                  grid: false,
                  yAxis: { hidden: true },
                },
              }}
            />
          </Section>

          <Hr style={{ margin: "32px 0 16px", border: "none", borderTop: `1px solid ${c.rule}` }} />
          <Text style={{ margin: 0, fontSize: 14, lineHeight: "22px", color: c.muted }}>
            <Link href={dashboardUrl} style={{ color: c.ink, textDecoration: "underline" }}>
              Open the dashboard
            </Link>{" "}
            for the full numbers.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

WeeklyDigest.PreviewProps = sample;

const fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function usd(value: number) {
  return value.toLocaleString(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function count(value: number) {
  return value.toLocaleString(locale);
}

function pct(value: number, signed = true) {
  const text = `${(value * 100).toFixed(1)}%`;
  return signed && value > 0 ? `+${text}` : text;
}
