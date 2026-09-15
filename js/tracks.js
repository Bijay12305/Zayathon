/**
 * Official Hackathon Tracks & Deep-Dive Modal Logic
 * 10 Official Themes with Interactive Filter and Modal Viewer
 */

const tracksData = [
  {
    id: 1,
    number: 'TRACK 01',
    category: 'ai-web3',
    name: 'Artificial Intelligence & Agentic Systems',
    shortDesc: 'Build autonomous agent workflows, multimodal LLMs, MedAI diagnostics, and intelligent neural systems.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 3.36 2.08 6.23 5 7.4V20a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2.6c2.92-1.17 5-4.04 5-7.4a8 8 0 0 0-8-8z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>`,
    problems: [
      'Autonomous multi-agent workflows for enterprise decision support',
      'High-accuracy medical image classification & preliminary diagnostic assist',
      'Local-first privacy-preserving edge AI on resource-constrained devices'
    ],
    techStack: ['Python', 'PyTorch / TensorFlow', 'LangChain / AutoGen', 'FastAPI', 'Hugging Face', 'Ollama / Local LLMs'],
    criteria: 'Algorithmic novelty, inference efficiency, real-world utility, safety and hallucination safeguards.'
  },
  {
    id: 2,
    number: 'TRACK 02',
    category: 'ai-web3',
    name: 'Web3, Blockchain & Decentralized Tech',
    shortDesc: 'Develop decentralized finance (DeFi), smart contract protocols, verifiable credentials, and dApps.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    problems: [
      'Zero-knowledge proof verification for anonymous identity validation',
      'Cross-chain asset bridging with automated risk mitigation',
      'Decentralized physical infrastructure networks (DePIN) for crowd-sourced data'
    ],
    techStack: ['Solidity / Rust', 'EVM / Polygon / Solana', 'Ethers.js / Viem', 'IPFS / Arweave', 'Hardhat / Foundry'],
    criteria: 'Smart contract security, gas optimization, decentralization architecture, intuitive UX.'
  },
  {
    id: 3,
    number: 'TRACK 03',
    category: 'impact-open',
    name: 'FinTech & Modern Digital Economy',
    shortDesc: 'Create next-generation payment solutions, fraud detection engines, algorithmic trading, and financial inclusion.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>`,
    problems: [
      'Real-time anomaly detection for high-throughput payment gateways',
      'Micro-lending credit scoring using alternative on-chain/off-chain data',
      'Automated personal finance companion with proactive tax & investment forecasting'
    ],
    techStack: ['Node.js / Go', 'PostgreSQL / TimescaleDB', 'Kafka / RabbitMQ', 'Stripe / UPI SDKs', 'Scikit-Learn'],
    criteria: 'Transaction throughput, compliance readiness, fraud resistance, user onboarding friction.'
  },
  {
    id: 4,
    number: 'TRACK 04',
    category: 'core-iot',
    name: 'IoT & Smart Connected Cities',
    shortDesc: 'Design connected hardware ecosystems, smart energy grids, automated utilities, and urban sensor networks.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
    problems: [
      'Intelligent adaptive street lighting and traffic mesh network',
      'Automated municipal water leakage & quality telemetry monitoring',
      'Smart building HVAC optimization using distributed ambient sensor nodes'
    ],
    techStack: ['ESP32 / Raspberry Pi', 'MQTT / WebSockets', 'InfluxDB / Grafana', 'C++ / Embedded Rust', 'Edge Impulse'],
    criteria: 'Hardware-to-cloud reliability, power efficiency, scalability, latency, telemetry visualization.'
  },
  {
    id: 5,
    number: 'TRACK 05',
    category: 'core-iot',
    name: 'Cybersecurity & Threat Intelligence',
    shortDesc: 'Engineer defensive security architectures, automated threat hunting, zero-trust systems, and cryptography.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    problems: [
      'Automated API vulnerability scanning and real-time WAF shield',
      'Zero-Trust continuous authentication using behavioral biometrics',
      'Phishing & malware triage automation using sandboxing telemetry'
    ],
    techStack: ['Python / Rust', 'Suricata / Zeek', 'Elasticsearch / OpenSearch', 'Docker / eBPF', 'Cryptography Libs'],
    criteria: 'Threat defense resilience, zero false-positive tolerance, protocol security, compliance adherence.'
  },
  {
    id: 6,
    number: 'TRACK 06',
    category: 'impact-open',
    name: 'HealthTech & Bio-Informatics',
    shortDesc: 'Pioneer digital healthcare systems, AI-driven diagnostics, patient care automation, and biomedical pipelines.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    problems: [
      'Emergency triage dispatch optimization using live vital sync',
      'Secure EHR interoperability using FHIR standards and end-to-end encryption',
      'Mental health early detection & non-invasive digital biomarker analysis'
    ],
    techStack: ['React / Flutter', 'FHIR API / HL7', 'TensorFlow.js', 'WebRTC', 'HIPAA compliant databases'],
    criteria: 'Clinical feasibility, patient data privacy, UI simplicity for doctors/patients, response time.'
  },
  {
    id: 7,
    number: 'TRACK 07',
    category: 'core-iot',
    name: 'Robotics & Autonomous Systems',
    shortDesc: 'Develop autonomous mobile robots (AMRs), computer vision guidance, swarm robotics, and automated systems.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
    problems: [
      'Warehouse pick-and-place navigation using visual SLAM and LiDAR',
      'Disaster search-and-rescue rover with obstacle traversal and live mapping',
      'Autonomous drone payload delivery with fail-safe return-to-home protocols'
    ],
    techStack: ['ROS2 / Gazebo', 'OpenCV / YOLO', 'C++ / Python', 'ArduPilot / PX4', 'Jetson Nano'],
    criteria: 'Kinematic stability, obstacle avoidance accuracy, battery economy, fail-safe mechanisms.'
  },
  {
    id: 8,
    number: 'TRACK 08',
    category: 'impact-open',
    name: 'Agritech & Rural Innovation',
    shortDesc: 'Empower farming communities with precision agriculture, crop disease detection, and direct marketplace pipelines.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9z"/><path d="M12 6v12"/><path d="M8 10l4-4 4 4"/></svg>`,
    problems: [
      'Mobile offline plant leaf disease diagnostics in vernacular languages',
      'Smart drip irrigation scheduling based on micro-climatic satellite telemetry',
      'Transparent disintermediated crop auction platform with cold-storage tracking'
    ],
    techStack: ['Flutter / React Native', 'FastAPI', 'YOLOv8', 'OpenWeather / Sentinel API', 'SQLite (Offline First)'],
    criteria: 'Low-bandwidth usability, farmer accessibility, economic viability, impact on crop yield.'
  },
  {
    id: 9,
    number: 'TRACK 09',
    category: 'impact-open',
    name: 'Transportation & Smart Logistics',
    shortDesc: 'Optimize public mobility, electric vehicle (EV) charging grids, multi-modal transit, and fleet intelligence.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    problems: [
      'Dynamic urban bus rerouting based on real-time commuter density heatmap',
      'Smart EV charging slot reservation with grid load balancing',
      'Cold-chain pharmaceutical delivery route optimizer with thermal monitoring'
    ],
    techStack: ['Mapbox / OpenStreetMap', 'Python / Go', 'PostGIS', 'WebSockets', 'OR-Tools'],
    criteria: 'Route latency reduction, energy savings, real-time sync, driver/passenger usability.'
  },
  {
    id: 10,
    number: 'TRACK 10',
    category: 'impact-open',
    name: 'Open Innovation & Moonshots',
    shortDesc: 'Have a radical idea that does not fit conventional tracks? Build any high-impact solution that changes the world.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    problems: [
      'Assistive technology for individuals with sensory or mobility impairments',
      'Decentralized citizen crisis response during climatic emergencies',
      'Educational gamification tools transforming STEM literacy in schools'
    ],
    techStack: ['Any Modern Stack (React, Flutter, Python, Rust, Go, Cloud Native)'],
    criteria: 'Boldness of vision, execution completeness, product-market fit, social impact.'
  }
];

// Initialize Tracks Grid & Filter Logic
document.addEventListener('DOMContentLoaded', () => {
  const tracksGrid = document.getElementById('tracks-grid');
  const filterBtns = document.querySelectorAll('.track-filter-btn');

  if (!tracksGrid) return;

  function renderTracks(filter = 'all') {
    tracksGrid.innerHTML = '';
    const filtered = filter === 'all' 
      ? tracksData 
      : tracksData.filter(t => t.category === filter);

    filtered.forEach((track, index) => {
      const card = document.createElement('div');
      card.className = `glass-card track-card reveal reveal-delay-${(index % 4) + 1}`;
      card.setAttribute('data-track-id', track.id);

      card.innerHTML = `
        <div>
          <div class="track-card-top">
            <span class="track-number">${track.number}</span>
            <div class="track-icon">${track.icon}</div>
          </div>
          <h3 class="track-name">${track.name}</h3>
          <p class="track-desc">${track.shortDesc}</p>
        </div>
        <div class="track-explore-btn">
          <span>Explore Guidelines</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      `;

      card.addEventListener('click', () => openTrackModal(track));
      tracksGrid.appendChild(card);
    });

    // Re-trigger scroll reveal for newly added cards
    if (window.checkScrollReveals) {
      window.checkScrollReveals();
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTracks(btn.getAttribute('data-filter'));
    });
  });

  renderTracks('all');
});

// Track Detail Modal Handler
function openTrackModal(track) {
  const modal = document.getElementById('track-modal');
  if (!modal) return;

  document.getElementById('modal-track-num').textContent = track.number;
  document.getElementById('modal-track-title').textContent = track.name;
  document.getElementById('modal-track-desc').textContent = track.shortDesc;

  // Render Problems
  const problemList = document.getElementById('modal-track-problems');
  problemList.innerHTML = track.problems.map(p => `
    <li style="display:flex; align-items:flex-start; gap:0.6rem; margin-bottom:0.65rem; color:#cbd5e1; font-size:0.95rem;">
      <span style="color:var(--primary); font-weight:bold;">▸</span>
      <span>${p}</span>
    </li>
  `).join('');

  // Render Tech Stack Pills
  const techList = document.getElementById('modal-track-tech');
  techList.innerHTML = track.techStack.map(t => `
    <span style="display:inline-block; padding:0.35rem 0.85rem; border-radius:999px; background:rgba(255,255,255,0.06); border:1px solid var(--border-subtle); font-family:var(--font-mono); font-size:0.8rem; color:#e2e8f0; margin-right:0.4rem; margin-bottom:0.4rem;">${t}</span>
  `).join('');

  // Render Criteria
  document.getElementById('modal-track-criteria').textContent = track.criteria;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTrackModal() {
  const modal = document.getElementById('track-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
