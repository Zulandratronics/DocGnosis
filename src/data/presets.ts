export interface PresetDocument {
  name: string;
  size: string;
  category: string;
  content: string;
}

export const PRESET_DOCUMENTS: PresetDocument[] = [
  {
    name: "Mars Rover Telemetry Spec.txt",
    size: "4.2 KB",
    category: "Software Engineering",
    content: `SPECIFICATION: NEXUS-VI PROPELLANT & RADAR TELEMETRY NODE
Document ID: SPEC-2026-X99
Status: DRAFT / INTERNAL REVIEWS ONLY
Author: Lead Systems Architect, Mars Ingress Mission

1. OVERVIEW
This document outlines the software configuration for the autonomous Nexus-VI Mars Landing Rover, specifying telemetry packet formats, sensor calibrations, and automated escape routines during high-g descent.

2. SYSTEM ARCHITECTURE
The telemetry node operates coordinates over a dedicated MIL-STD-1553B multiplex databus.
- Sampling Rate: 100Hz for high-g gyro sensors, 10Hz for ambient atmospheric pressure sensors.
- Primary Controller: Fault-Tolerant RAD750 Processor running VxWorks RTOS.
- Local Storage: 512GB radiation-hardened NAND flash storage.

3. PACKET STRUCTURE
Each packet consists of a 16-byte header, followed by a variable-width payload, and terminates with a 4-byte CRC-32 checksum.
Byte 0-3: Sync marker (0xDEADBEEF)
Byte 4-7: Unix Timestamp seconds (UTC)
Byte 8-9: Sensor Source Identifier (0x01: Gyro, 0x02: Altimeter, 0x03: Thermo, 0x04: Solar-Inflow)
Byte 10-15: Internal Status Registers (Binary mask for power rail states)

4. FAULT ACCELERATION & CRITICAL PROCEDURES
If continuous telemetry loss exceeds 450ms during active retro-thruster descent:
- Trigger escape loop "ORION-9"
- Automatically deploy backup supersonic drag parachute.
- Switch radio array from high-gain parabolic antenna to omnidirectional helical beacon.
- Transmit raw beacon distress ping on 420.5 MHz with calculated GPS coordinates from inertial guidance.

5. GLOSSARY & NOTES
RTOS: Real-time Operating System.
S-Band: Microwave band of electromagnetic spectrum between 2 to 4 GHz. Used for deep-space tracking and telemetry link.`
  },
  {
    name: "AeroBurger Digital Brand Rollout.md",
    size: "3.1 KB",
    category: "Marketing & Brand Strategy",
    content: `# MARKETING BRIEF: "AERO-BURGER" COMPANION APP LAUNCH
**Campaign Objective:** Orchestrate physical-to-digital burger customization experience for Gen-Z.
**Core Hook:** "Build your stack, fly your craft, unlock real bites."

## 1. THE PRODUCT COCKPIT
AERO-BURGER is introducing a mobile application where users customize their physical burgers in an immersive 3D flight-simulator interface. Adding bacon adds extra boosters, swapping cheddar to Swiss changes the cockpit color palette, and high-frequency order streaks earn "AeroMiles" redeemable as free physical drinks and sides.

## 2. AUDIENCE MATURATION & SEGMENTS
- **Segment Alpha (The Gamers):** High-frequency mobile gamers, ages 14-22. Motivated by achievements, badges, and fast gratification.
- **Segment Beta (The Social Foodies):** Creators, ages 18-26. Focused on visual sharing, crazy sauce combinations, and TikTok content loops.

## 3. MULTI-CHANNEL LAUNCH TIMELINE
### المرحلة الأولى: Silent Hype (Weeks 1-2)
- Deploy 10 cryptic TikTok videos featuring a CGI burger container landing on actual city streets (e.g., Shibuya, Times Square).
- No brand name, only an audio watermark of a burger sizzling with retro spaceship sounds.

### المرحلة الثانية: Influencer Co-Captains (Weeks 3-4)
- Partner with 15 premium content creators. Deliver customized flight briefs and glowing holographic burger boxes directly to their doors.
- Challenge them to design their own "Signature Spaceship Burger" and publish their scorecodes to fans.

### المرحلة الثالثة: Global Departure (Month 2)
- Dynamic digital banners across streaming websites.
- In-store QR codes mapped to "Instant Flight Clearances" granting free delivery on the first launch week order.

## 4. METRICS FOR SUCCESS
- App Downloads: 150,000 within 30 days.
- Custom Burger Submissions: 50,000 shared burger screenshots on Instagram/TikTok.
- Conversion to Order: 12% in-app customization to checkout conversion rate.`
  },
  {
    name: "Multi-Region Postgres Resilience spec.txt",
    size: "5.8 KB",
    category: "Business & Operations",
    content: `DISASTER RECOVERY ARCHITECTURE: CONTINUOUS REPLICATION & RESILIENCE
Target System: Postgres Cluster (GCP Cloud SQL + Aurora Multi-Region)
Target RTO: < 30 seconds
Target RPO: < 5 seconds
Author: Principal Site Reliability Engineer
Classification: Restricted / SRE Team Only

1. PREAMBLE & OBJECTIVES
Our critical transaction ledger database must be bulletproof. In the event of a total cloud region outage, we must handle seamless failover without transaction loss or manual operator intervention.

2. LOGICAL REPLICATION TOPOLOGY
- Primary Node: Google Cloud SQL Postgres v15 in us-east1 (South Carolina)
- Standby Node (Read-Replica): Google Cloud SQL Postgres v15 in us-west1 (Oregon)
- Failover Broker: Custom PgBouncer proxy layer fronted by Cloud DNS with routing policies.
- Replication Protocol: Streaming replication with synchronous commits on critical tables (credits, invoices, transfers) and asynchronous transport for transient tables (user_sessions, analytics_logs).

3. HEALTH-CHECKING & PROBE FREQUENCY
The SRE health monitoring daemon ("Sentinel") pings the primary node every 1000ms.
- Success Condition: HTTP 200 on deep check endpoint, SELECT 1 query response under 50ms.
- Soft Failure Warning: Query latency > 250ms or packet loss > 5% for 3 cycles.
- Hard Failover Criteria: Sentinel receives 3 consecutive failed checks (e.g. Connection Refused, Disk Full panic, or region timeout).

4. AUTOMATED FAILOVER RUNBOOK
Upon satisfying Hard Failover Criteria:
Step A: Issue API call to Oregon standby node to promote it to PRIMARY mode ("SELECT pg_promote();").
Step B: Update Global DNS routing policy to shift trans_db.company.com CNAME pointing from us-east1 replica endpoints to us-west1.
Step C: Instruct PgBouncer instances to discard active transaction pools, force client reconnects, and block incoming write commands for exactly 1500ms to allow replica buffer catch-up.
Step D: Fire emergency PagerDuty alert to the On-Call rotation: SRE-RED: "Region Failover initiated. Postgres promoted Oregon node."`
  },
  {
    name: "Triton Shadows Novel Outline.md",
    size: "2.5 KB",
    category: "Creative Writing",
    content: `# STORY MATRIX: THE SHADOWS OF TRITON
**Genre:** Hard Science Fiction / Noir Thriller
**Setting:** Triton (Neptune's largest moon), Year 2188
**Protagonist:** Silas Vance, a cynical hydroponic safety inspector running from his past.

## THE ATMOSPHERE
Triton is a freezing hell of nitrogen geysers, dark ice tunnels, and claustrophobic dome settlements funded by private mining cartels. Sub-zero temperatures outside mean that any thermal failure inside is a slow, freezing death sentence.

## CORE PLOT INCIDENT
While inspecting a decaying water-ice reclamation pipe on the outskirts of "Oasis-3", Silas discovers an undocumented biological organism frozen deep in the ancient subsurface ice. It is consuming methane exhaust, expanding rapidly, and sending out low-frequency acoustic vibrations that interfere with the dome's heating grid.

## CHARACTER PORTRAITS
- **Silas Vance:** Forties. Ex-planetary military engineer. Speaks in short sentences. Addicted to low-grade synthetic caffeine. Keeps a pet robotic cockroach that lives in his sleeve.
- **Dr. Kira Voss:** A brilliant, hyper-focused marine microbiologist sent by the corporate office. She believes the frozen organism is not native to Triton, but is an ancient biological terraforming seed planted by a voyager craft that passed empty systems eras before human history.

## CHAPTER PLANS
### Chapter 1: The Cold Pipe
Silas is sent to fix a pressure valve. He is freezing, tired, and uncovers a blue-glowing bio-pulse within the thermal jacket.

### Chapter 2: Voss's Arrival
Kira Voss arrives by shuttle with high-security clearance. She takes over Silas's workspace. Tension arises between Silas's hands-on pragmatism and Voss's scientific purity.

### Chapter 3: Grid Panic
The temperature in sector-C drops to 4 degrees. The geysers start erupting with abnormal frequencies. The communications dishes fail entirely, isolating the colony.`
  }
];
