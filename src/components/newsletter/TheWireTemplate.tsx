import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TheWireTemplateProps {
  subject: string;
  preview: string;
  date: string;
  type: 'daily' | 'weekend';
  sections: Array<{
    key: string;
    title: string;
    content: string;
    display_order: number;
  }>;
}

export const TheWireTemplate = ({
  subject,
  preview,
  date,
  type,
  sections,
}: TheWireTemplateProps) => {
  const sortedSections = [...sections].sort((a, b) => a.display_order - b.display_order);

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>DRAWDOWN.</Text>
            <Text style={editionLabel}>
              THE WIRE • {type.toUpperCase()}
            </Text>
            <Text style={dateLabel}>{date}</Text>
          </Section>

          {/* Hero */}
          <Section style={hero}>
            <Text style={overline}>// MARKET INTELLIGENCE</Text>
            <Text style={h1}>{subject}</Text>
            <Text style={subheading}>{preview}</Text>
            <Hr style={heroDivider} />
          </Section>

          {/* Sections */}
          {sortedSections.map((section, i) => {
            if (section.key === 'petes_take') {
               return (
                <Section key={section.key} style={petesTakeWrapper}>
                  <Text style={pillLabel}>PETE'S TAKE</Text>
                  <Text style={petesContent}>{section.content}</Text>
                  <Text style={byline}>— Pete Currey, Founder // Drawdown</Text>
                </Section>
               );
            }

            return (
              <Section key={section.key} style={i % 2 === 0 ? sectionEven : sectionOdd}>
                <Text style={pillLabel}>{section.title.toUpperCase()}</Text>
                <Text style={sectionTitle}>{section.title}</Text>
                <Hr style={divider} />
                <Text style={content}>{section.content}</Text>
              </Section>
            );
          })}

          {/* CTA */}
          <Section style={ctaSection}>
            <Text style={overline}>// ACCESS THE FULL PLATFORM</Text>
            <Text style={ctaHeadline}>Your edge doesn't end here.</Text>
            <Text style={ctaBody}>
              Everything in The Wire connects back to the tools and curriculum inside Drawdown. Phase 1 is free.
            </Text>
            <Section style={buttonWrapper}>
               <a href="https://drawdown.trading/signup?source=wire_email" style={button}>
                 EXPLORE DRAWDOWN →
               </a>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 Drawdown. Established in Chesterfield, UK.
            </Text>
            <Text style={footerText}>
              Drawdown is a trading education platform. Not financial advice.
            </Text>
            <Text style={footerText}>
              <a href="{{unsubscribeUrl}}" style={footerLink}>Unsubscribe</a> • 
              <a href="#" style={footerLink}>Manage preferences</a> • 
              <a href="#" style={footerLink}>View in browser</a>
            </Text>
            <Text style={footerText}>A Signature Build by Avorria</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "600px",
};

const header = {
  padding: "20px 24px",
  borderBottom: "1px solid #222222",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 4px",
  fontFamily: "Georgia, serif",
};

const editionLabel = {
  color: "#f59e0b",
  fontSize: "10px",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "0 0 4px",
};

const dateLabel = {
  color: "#888888",
  fontSize: "11px",
  margin: "0",
};

const hero = {
  backgroundColor: "#111111",
  padding: "32px 24px 24px",
};

const overline = {
  color: "#f59e0b",
  fontSize: "10px",
  fontFamily: "monospace",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const h1 = {
  color: "#f5f5f5",
  fontSize: "28px",
  fontFamily: "Georgia, serif",
  lineHeight: "1.3",
  margin: "0 0 12px",
};

const subheading = {
  color: "#888888",
  fontSize: "15px",
  margin: "0 0 24px",
};

const heroDivider = {
  borderColor: "#f59e0b",
  opacity: 0.4,
};

const sectionEven = {
  backgroundColor: "#0a0a0a",
  padding: "24px",
  borderBottom: "1px solid #222222",
};

const sectionOdd = {
  backgroundColor: "#111111",
  padding: "24px",
  borderBottom: "1px solid #222222",
};

const pillLabel = {
  display: "inline-block",
  color: "#f59e0b",
  border: "1px solid #f59e0b",
  padding: "4px 8px",
  fontSize: "9px",
  fontFamily: "monospace",
  textTransform: "uppercase" as const,
  margin: "0 0 12px",
};

const sectionTitle = {
  color: "#f5f5f5",
  fontSize: "16px",
  fontWeight: "bold",
  fontFamily: "Georgia, serif",
  margin: "0 0 12px",
};

const divider = {
  borderColor: "#222222",
  margin: "12px 0",
};

const content = {
  color: "#cccccc",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0",
};

const petesTakeWrapper = {
  backgroundColor: "#1a1a1a",
  borderLeft: "3px solid #f59e0b",
  padding: "24px 24px 24px 28px",
  borderBottom: "1px solid #222222",
};

const petesContent = {
  color: "#e5e5e5",
  fontSize: "15px",
  fontStyle: "italic",
  fontFamily: "Georgia, serif",
  lineHeight: "1.8",
  margin: "0",
};

const byline = {
  color: "#888888",
  fontSize: "12px",
  marginTop: "16px",
};

const ctaSection = {
  backgroundColor: "#111111",
  padding: "24px",
  border: "1px solid #222222",
  textAlign: "center" as const,
};

const ctaHeadline = {
  color: "#f5f5f5",
  fontSize: "18px",
  fontFamily: "Georgia, serif",
  margin: "0 0 8px",
};

const ctaBody = {
  color: "#888888",
  fontSize: "13px",
  margin: "0 0 24px",
};

const buttonWrapper = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "transparent",
  border: "1px solid #f59e0b",
  borderRadius: "0",
  color: "#f59e0b",
  fontSize: "13px",
  fontFamily: "monospace",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  backgroundColor: "#0a0a0a",
  padding: "24px",
  borderTop: "1px solid #1a1a1a",
  textAlign: "center" as const,
};

const footerText = {
  color: "#555555",
  fontSize: "11px",
  margin: "0 0 8px",
};

const footerLink = {
  color: "#555555",
  textDecoration: "none",
};
