import { DocumentAnalysis } from '../types';

export const INITIAL_ANALYSES: Record<string, DocumentAnalysis> = {
  "Mars Rover Telemetry Spec.txt": {
    category: "Software Engineering",
    summary: "A rigorous hardware-embedded architecture specification detailing high-frequency critical telemetry interfaces and automated safe-state landing recovery procedures for Mars rovers.",
    readTime: 4,
    tags: ["EmbeddedSystems", "AerospaceTech", "VxWorksRTOS"],
    sentiment: "Highly technical, ultra-reliable & structured",
    keyThemes: [
      "Fault-tolerant real-time processor coordination using VxWorks",
      "CRC-32 error validation and sync markers for S-band packet transmission",
      "Automated safe-state descent algorithms (ORION-9 rescue loop)",
      "High-performance telemetry bus layout (MIL-STD-1553B)"
    ],
    brainstorm: [
      {
        id: "b-1",
        title: "Telemetry Streaming Emulator",
        concept: "Construct a local web-based emulation dashboard that streams binary mock packets matching the RAD750 telemetry specifications, displaying continuous CRC checks and antenna toggling logic.",
        actions: [
          {
            id: "a-1",
            action: "Write a TypeScript telemetry packet generator and parser conforming to the DEADBEEF byte alignments.",
            timeEstimate: "3 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          },
          {
            id: "a-2",
            action: "Design an interactive flight-deck cockpit UI matching retro radar visuals in code.",
            timeEstimate: "1 day",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      },
      {
        id: "b-2",
        title: "automated Orion-9 Failover Pipeline",
        concept: "Model the software failover state machine in a simulation node to test latency and trigger times of radio communication changes upon continuous telemetry gaps.",
        actions: [
          {
            id: "a-3",
            action: "Develop an automated Jest/Vitest test suite simulating intermittent connection failures to measure Orion-9 state response times.",
            timeEstimate: "2 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      },
      {
        id: "b-3",
        title: "Aerospace Communication Gateway",
        concept: "Develop a microservice adaptor that bridges historical MIL-STD-1553B telemetry streams to modern JSON formats over WebSockets for modern client consumption.",
        actions: [
          {
            id: "a-4",
            action: "Create a server-side telemetry translator script converting binary mask payloads to structured JSON metrics.",
            timeEstimate: "5 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      }
    ],
    skills: [
      {
        name: "RTOS System Design",
        category: "Technical",
        proficiencyGained: 85,
        description: "Understanding task scheduling, low-latency watchdogs, and state restoration policies in embedded microkernels."
      },
      {
        name: "Telemetry Byte Alignment",
        category: "Technical",
        proficiencyGained: 90,
        description: "Designing packet formats using magic sync markers and bitwise manipulation protocols to prevent data drift."
      },
      {
        name: "Failsafe Orchestration",
        category: "Technical",
        proficiencyGained: 78,
        description: "Enforcing cascade failure recovery protocols, supersonic parachute delays, and emergency backup transmission loops."
      }
    ],
    roadmap: [
      {
        milestone: "Stage 1",
        title: "Byte Alignment & CRC Engine",
        description: "Develop the core binary packet serializer and checksum validates to handle extreme raw inputs gracefully.",
        duration: "Weeks 1-2",
        resources: [
          "MIL-STD-1553D Standard Specifications (https://reseaulib.org)",
          "Data Integrity & CRC-32 Mechanics"
        ],
        checked: true
      },
      {
        milestone: "Stage 2",
        title: "Failover Simulation Suite",
        description: "Implement physical emulator constraints to test the 450ms telemetry window and check automatic parachute release loops.",
        duration: "Weeks 3-4",
        resources: [
          "VxWorks Programmer Guideline Notes",
          "Designing Fault-Tolerant Landing Logic"
        ],
        checked: false
      },
      {
        milestone: "Stage 3",
        title: "Hardware Integration & Benchmarking",
        description: "Test processor speeds against simulated high-radiation NAND interference rates to guarantee safe flight parameters.",
        duration: "Month 2",
        resources: [
          "Radiation Hardening Engineering (https://nasa.gov)",
          "VxWorks Scheduling Guide"
        ],
        checked: false
      }
    ]
  },

  "AeroBurger Digital Brand Rollout.md": {
    category: "Marketing & Brand Strategy",
    summary: "An imaginative physical-to-digital mobile customization paradigm introducing dynamic TikTok campaigns and creator challenges targeting Gen-Z audience cohorts.",
    readTime: 3,
    tags: ["GenZCampaign", "BrandCustomization", "InteractiveRetail"],
    sentiment: "Energetic, engaging & promotional",
    keyThemes: [
      "Physical burger order gamification utilizing 3D mobile flight-sim controllers",
      "Cryptic TikTok video loops with CGI watermark branding",
      "Holographic influencer deliveries to stimulate high-frequency social sharing",
      "AeroMiles customer tracking loops to stimulate repeat orders"
    ],
    brainstorm: [
      {
        id: "b-1",
        title: "Virtual Cockpit Customizer Demo",
        concept: "Build a responsive digital prototype of the 3D AeroBurger application containing slider configurations to 'build your space burger' (each ingredient altering cabin stats/colors).",
        actions: [
          {
            id: "a-1",
            action: "Create a Tailwind-driven CSS burger visualizer that modifies visual background glows based on lettuce or cheese ingredients.",
            timeEstimate: "4 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          },
          {
            id: "a-2",
            action: "Write a high-converting landing page draft outlining campaign metrics for segmented investors.",
            timeEstimate: "3 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      },
      {
        id: "b-2",
        title: "TikTok Creative Script Portfolio",
        concept: "Plan a collection of 5 video screen-guides detailing exact dialogue hooks, overlay texts, sound watermarks, and viral patterns for Segment Alpha.",
        actions: [
          {
            id: "a-3",
            action: "Draft a creative copywriting doc setting up timing beats for TikTok CGI animations.",
            timeEstimate: "2 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      },
      {
        id: "b-3",
        title: "AeroMiles Rewards Flow Schema",
        concept: "Draft the analytical database schema and reward verification APIs to secure free order items from abuse while tracking gamified burger customization streaks.",
        actions: [
          {
            id: "a-4",
            action: "Write a Node.js Express API blueprint modeling the customer streak system with secure coupon emission checks.",
            timeEstimate: "1 day",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      }
    ],
    skills: [
      {
        name: "Digital-Physical Alignment",
        category: "Productivity",
        proficiencyGained: 80,
        description: "Mapping physical items to digital game UI layouts to stimulate immediate, gamified retail purchases."
      },
      {
        name: "Viral Content Architecture",
        category: "Creative",
        proficiencyGained: 88,
        description: "Engineering cryptic pre-release schedules on TikTok and utilizing CGI triggers to capitalize on internet curiosity."
      },
      {
        name: "Audience Segmentation",
        category: "Creative",
        proficiencyGained: 75,
        description: "Tailoring digital platforms for low-friction Gen-Z users and influencers through gamified challenges."
      }
    ],
    roadmap: [
      {
        milestone: "Stage 1",
        title: "Branding Material & CGI Asset Tests",
        description: "Create the initial CGI burger render mockups and compose the deep sizzling atmospheric spaceship sounds.",
        duration: "Weeks 1-2",
        resources: [
          "TikTok Creator Portal Guidelines",
          "Digital Brand Strategy Handbooks"
        ],
        checked: false
      },
      {
        milestone: "Stage 2",
        title: "Influencer Launch & Customizer Beta",
        description: "Produce the physical holographic boxes and distribute custom beta credentials to selected content creators.",
        duration: "Weeks 3-4",
        resources: [
          "Influencer Relations & Outbox Templates",
          "Web-Based 3D Canvas Mechanics"
        ],
        checked: false
      },
      {
        milestone: "Stage 3",
        title: "Retail Integration & Deployment",
        description: "Enable the dynamic checkout API converting digital space burgers into actual orders inside physical commercial kitchens.",
        duration: "Month 2",
        resources: [
          "E-Commerce Payment APIs",
          "Conversion Rate Tracking Guidelines"
        ],
        checked: false
      }
    ]
  },

  "Multi-Region Postgres Resilience spec.txt": {
    category: "Business & Operations",
    summary: "A logical engineering checklist establishing low-latency disaster recovery, automated heartbeat watchdogs, and global failover policies for transaction ledgers.",
    readTime: 5,
    tags: ["SiteReliability", "DatabaseClustering", "DisasterRecovery"],
    sentiment: "Analytical, mission-critical & precise",
    keyThemes: [
      "Continuous logical replication between Cloud SQL us-east1 and us-west1",
      "Sentinel status probes mapping disk levels and select latencies under 50ms",
      "Automated standby node promotion and global DNS record alterations",
      "Client connection control metrics using PgBouncer pooling resets"
    ],
    brainstorm: [
      {
        id: "b-1",
        title: "Auto-Failover Simulation Engine",
        concept: "Code a robust virtual simulation panel mapping primary node degradation and automated DNS re-routing to test the failover under 30-second boundary conditions.",
        actions: [
          {
            id: "a-1",
            action: "Write an automated Node.js cluster simulator file with simulated heartbeats and failure events.",
            timeEstimate: "4 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          },
          {
            id: "a-2",
            action: "Write a high-performance mock connection manager script with reconnect buffers.",
            timeEstimate: "3 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      },
      {
        id: "b-2",
        title: "Site Reliability Dashboard UI",
        concept: "Construct a clean monitoring panel displaying Postgres multi-region latencies, deep connection metrics, and health scores graphically to on-call engineers.",
        actions: [
          {
            id: "a-3",
            action: "Design a responsive React status board with visual health indicators.",
            timeEstimate: "6 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      }
    ],
    skills: [
      {
        name: "Failover Architecture",
        category: "Technical",
        proficiencyGained: 92,
        description: "Automating streaming database replica promotion and DNS routing updates safely."
      },
      {
        name: "Proxy Pool Management",
        category: "Technical",
        proficiencyGained: 84,
        description: "Enforcing transaction pool discards and brief write locks using PgBouncer."
      },
      {
        name: "High-Availability Probing",
        category: "Technical",
        proficiencyGained: 80,
        description: "Writing heartbeat monitors that deep check queries while accounting for network fluctuations."
      }
    ],
    roadmap: [
      {
        milestone: "Stage 1",
        title: "Replication Pipeline Setup",
        description: "Deploy secondary Postgres replica in Oregon and secure secure SSL peer connections.",
        duration: "Weeks 1-2",
        resources: [
          "Postgres Logical Replication Guide (https://postgresql.org)",
          "Managing Multi-Region Security Policies"
        ],
        checked: false
      },
      {
        milestone: "Stage 2",
        title: "Sentinel Sentinel Daemon Build",
        description: "Write the Sentinel health checker to continuously measure primary database latency times on an active loop.",
        duration: "Weeks 3-4",
        resources: [
          "Designing Reliable Sentinel Services",
          "TCP Latency Tracking Handbooks"
        ],
        checked: false
      },
      {
        milestone: "Stage 3",
        title: "Simulated Stress Testing",
        description: "Run live drills: panic primary node under peak write loads to verify Oregon promotion speeds.",
        duration: "Month 1",
        resources: [
          "Site Reliability Action Drills (https://sre.google)",
          "Connection Pooling with PgBouncer"
        ],
        checked: false
      }
    ]
  },

  "Triton Shadows Novel Outline.md": {
    category: "Creative Writing",
    summary: "An atmospheric hard sci-fi novel layout setting up isolation, biomechanics, and corporate corporate greed on Neptune's moon Triton.",
    readTime: 3,
    tags: ["HardSciFi", "CharacterNoir", "Worldbuilding"],
    sentiment: "Mysterious, clinical & tense",
    keyThemes: [
      "Claustrophobic setting details centered on nitrogen freezing and icy mine chambers",
      "Pragmatic, coffee-hooked protagonist Silas Vance contrasting theoretical Dr. Kira Voss",
      "A mysterious frozen lifeform interfering with dome critical heaters",
      "Chapter breakdowns raising systemic panic of absolute isolation"
    ],
    brainstorm: [
      {
        id: "b-1",
        title: "Sci-Fi Worldbuilding Lore Wiki",
        concept: "Compile a detailed technical handbook detailing Triton colony logistics (mining methods, cybernetic insects, life support mechanics, and planetary history).",
        actions: [
          {
            id: "a-1",
            action: "Draft a comprehensive lore guide outlining thermal mechanics inside Triton's domes.",
            timeEstimate: "3 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          },
          {
            id: "a-2",
            action: "Compose detailed technical blueprints of Silas's cuff robotic companion cockroach.",
            timeEstimate: "2 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      },
      {
        id: "b-2",
        title: "Full Chapter 1 Prose Draft",
        concept: "Write a high-tension, descriptive 1,500-word launch scene capturing Silas Vance fixing freezing pressure pipes in section C.",
        actions: [
          {
            id: "a-3",
            action: "Draft a chilling, atmospheric novel chapter focused on Vance's Discovery of the frozen pulse.",
            timeEstimate: "5 hours",
            offloadable: true,
            offloadStatus: "idle",
            offloadLog: []
          }
        ]
      }
    ],
    skills: [
      {
        name: "Worldbuilding Mechanics",
        category: "Creative",
        proficiencyGained: 90,
        description: "Integrating technical, physical, and atmospheric rules to construct believable sci-fi settings."
      },
      {
        name: "Noir Character Development",
        category: "Creative",
        proficiencyGained: 82,
        description: "Drafting cynical, realistic dialogue and styling character dependencies on microtechnologies."
      },
      {
        name: "High-Tension Narrative Pacing",
        category: "Creative",
        proficiencyGained: 85,
        description: "Designing chapter layouts that naturally build isolation dread and technical hazards."
      }
    ],
    roadmap: [
      {
        milestone: "Stage 1",
        title: "Glossary & Lore Stabilization",
        description: "Nail down the atmospheric constraints, nitrogen freezing indices, and private corporate military branches.",
        duration: "Quick sprint",
        resources: [
          "Astronomical Data of Moon Triton (https://nasa.gov)",
          "Writing Hard Sci-Fi Masterclass Outline"
        ],
        checked: false
      },
      {
        milestone: "Stage 2",
        title: "Dread Chapter Outlining",
        description: "Flesh out dialogue hooks and draft technical interactions between Dr. Kira Voss and protagonist Vance.",
        duration: "Weeks 1-2",
        resources: [
          "Noir Detective Archetype Study Sheets",
          "Pacing Thrillers through Chapter Timelines"
        ],
        checked: false
      },
      {
        milestone: "Stage 3",
        title: "Chapter 1-3 Prose Drafting",
        description: "Draft complete high-fidelity paragraphs setting up Silas Vance in the thermal jackets.",
        duration: "Month 1",
        resources: [
          "Prose Polishing Standards (https://sfwa.org)",
          "Atmospheric Novel Design Books"
        ],
        checked: false
      }
    ]
  }
};
