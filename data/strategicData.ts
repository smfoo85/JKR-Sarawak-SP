import { 
  Target, 
  Users, 
  Globe, 
  BarChart3, 
  Calendar, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Shield, 
  TrendingUp, 
  MapPin, 
  Smartphone,
  ShieldCheck,
  Cpu,
  Library,
  LayoutDashboard,
  Banknote
} from 'lucide-react';
import type { 
  StrategicThrust, 
  TierMilestone, 
  KPI, 
  Initiative, 
  NavItem, 
  StrategicDirection, 
  StrategicObjective,
  SuccessStory,
  StoriesPageContent,
  EngagementChannel,
  EngagePageContent,
  WelcomePageContent
} from '../types';

export const strategicThrusts: StrategicThrust[] = [
  { id: 1, title: "Environmental Sustainability", icon: Globe, color: "bg-green-500", shortColor: 'bg-green-600', description: "To promote environmentally responsible infrastructure and building development across Sarawak by integrating green technologies, sustainable materials, and pollution control practices. This thrust ensures JKR Sarawak's projects reduce environmental impact, conserve resources, and align with Sarawak's Green Energy Agenda and Sustainable Development Goals (SDGs). It positions JKR Sarawak as a steward of eco-conscious engineering, ensuring that every project contributes to a cleaner, safer, and more sustainable environment." },
  { id: 2, title: "Risk and Resilience Management", icon: Shield, color: "bg-yellow-500", shortColor: 'bg-yellow-600', description: "To strengthen the resilience of Sarawak's infrastructure against natural disasters, climate change, and unforeseen risks through proactive risk assessment, resilient design, and monitoring systems. This thrust supports the transition from reactive maintenance to proactive preparedness, safeguarding the State's investments and ensuring that critical assets remain safe, reliable, and functional under adverse conditions." },
  { id: 3, title: "Spatial Planning and Regional Connectivity", icon: MapPin, color: "bg-orange-500", shortColor: 'bg-orange-600', description: "To enhance regional integration and equitable access across Sarawak by improving physical connectivity between rural and urban areas. Through road networks, bridges, and regional master plans, this thrust addresses geographical disparities, stimulates local economic development, and supports the realization of Sarawak's vision for balanced regional growth under PCDS 2030." },
  { id: 4, title: "Smart and Efficient Project Delivery", icon: TrendingUp, color: "bg-purple-500", shortColor: 'bg-purple-600', description: "To improve project planning, implementation, and monitoring processes through the use of technology, standardization, and process optimization. This thrust ensures that infrastructure projects are delivered faster, more efficiently, and at higher quality standards — maximizing value for money and enhancing JKR Sarawak's reputation as a high-performing public works agency." },
  { id: 5, title: "Smart and Efficient Asset Management", icon: BarChart3, color: "bg-blue-500", shortColor: 'bg-blue-600', description: "To manage the State's infrastructure and building assets through lifecycle-based, data-driven, and preventive maintenance strategies. This thrust focuses on asset longevity, operational efficiency, and sustainability by implementing IoT systems, ISO 55001 standards, and facility management frameworks that ensure public assets remain functional, safe, and cost-effective throughout their lifespan." },
  { id: 6, title: "Innovation and Technology Integration", icon: Smartphone, color: "bg-green-500", shortColor: 'bg-green-600', description: "To drive digital transformation and innovation across JKR Sarawak by adopting emerging technologies such as BIM, AI, Big Data, and IoT. This thrust accelerates the Department's modernization journey, enabling data-driven decision-making, improved productivity, and smart infrastructure solutions that align with Sarawak's digital economy aspirations." },
  { id: 7, title: "Social Responsibility and Inclusion", icon: Users, color: "bg-yellow-500", shortColor: 'bg-yellow-600', description: "To ensure that infrastructure development is inclusive, equitable, and community-centered. This thrust emphasizes stakeholder engagement, accessibility, and opportunities for local participation — ensuring that JKR Sarawak's projects not only build physical assets but also uplift communities, create jobs, and promote social well-being across all regions." },
  { id: 8, title: "Stakeholder Engagement and Public Confidence", icon: MessageSquare, color: "bg-red-500", shortColor: 'bg-red-600', description: "To build trust and strengthen relationships with stakeholders, including government agencies, contractors, and the public. Through transparent communication, media engagement, and digital platforms, this thrust ensures greater accountability and responsiveness, reinforcing JKR Sarawak's image as a people-centric and trusted public institution." },
  { id: 9, title: "Workforce Development and Competency Building", icon: BookOpen, color: "bg-purple-500", shortColor: 'bg-purple-600', description: "To cultivate a future-ready workforce equipped with technical expertise, leadership skills, and digital competencies. This thrust ensures continuous professional development, structured career progression, and knowledge sharing that empower JKR Sarawak's engineers, officers, and technical staff to deliver excellence in every aspect of public infrastructure delivery." },
  { id: 10, title: "Governance and Ethical Practices", icon: Shield, color: "bg-blue-500", shortColor: 'bg-blue-600', description: "To uphold transparency, integrity, and accountability in every level of project governance and decision-making. This thrust focuses on strengthening internal control systems, digitalizing approval processes, and promoting ethical conduct — ensuring public trust, effective resource utilization, and compliance with Sarawak Civil Service Shared Values." },
  { id: 11, title: "Financial and Resource Optimization", icon: BarChart3, color: "bg-green-500", shortColor: 'bg-green-600', description: "To enhance financial management and resource utilization through accurate cost data, result-based budgeting, and value engineering practices. This thrust ensures that every ringgit spent contributes directly to impact-driven outcomes, improving fiscal discipline and long-term financial sustainability of infrastructure projects under JKR Sarawak." },
  { id: 12, title: "Knowledge Sharing and Global Benchmarking", icon: Globe, color: "bg-amber-500", shortColor: 'bg-amber-600', description: "To position JKR Sarawak as a center of engineering excellence by learning from global best practices and sharing institutional knowledge. This thrust encourages innovation through international collaboration, research partnerships, and professional exchanges — ensuring JKR Sarawak continuously evolves, innovates, and competes at global standards." }
];

export const strategicDirection: StrategicDirection = {
  vision: "The Leading Engineering Agency in Sarawak.",
  mission: "To Deliver Quality, Efficient, Reliable and Sustainable Infrastructure and Building Projects, and Assets Through Highly Competent Workforce while Aligning to the Latest Technology and Digitalization.",
  goal: `"We Build for You" – Delivering high-impact, future-ready infrastructure that supports Sarawak’s economic, social, and environmental aspirations in alignment with PCDS 2030.`
};

export const strategicObjectives: StrategicObjective[] = [
    {
      id: 1,
      title: "Sustainable & Resilient Infrastructure",
      description: "Building for the future by prioritizing green technology, climate resilience, and strategic regional connectivity.",
      icon: ShieldCheck,
      color: "blue",
      thrusts: [1, 2, 3],
    },
    {
      id: 2,
      title: "Digital Transformation & Innovation",
      description: "Leveraging digital tools like BIM, AI, and IoT to achieve smarter project delivery and efficient asset management.",
      icon: Cpu,
      color: "purple",
      thrusts: [4, 5, 6],
    },
    {
      id: 3,
      title: "Inclusive & High-Quality Service Delivery",
      description: "Fostering a skilled workforce and building public trust through social inclusion, competency development, and transparent engagement.",
      icon: Users,
      color: "green",
      thrusts: [7, 8, 9],
    },
    {
      id: 4,
      title: "Financial Sustainability & Governance Excellence",
      description: "Upholding integrity and optimizing resources through strong governance, financial stewardship, and global benchmarking.",
      icon: Library,
      color: "red",
      thrusts: [10, 11, 12],
    },
];


export const tierMilestones: TierMilestone[] = [
  {
    tier: "Tier 1 (2025-2026): Foundation",
    milestones: [
      "Cost Data Bank operational by Q3 2026",
      "Online PTIVO/EOT Submissions live by Q4 2026",
      "Sustainable Design Specifications applied to all new buildings",
      "MyJKR App fully operational by Q2 2026",
      "Real-time monitoring devices installed on critical structures",
      "Complete remaining Pan Borneo Highway sections",
      "Develop Green Procurement Policy for construction materials",
      "Digitalize State Pre-Approved Plan (SPAP) in BIM format",
      "Develop Traffic Management Masterplan to ease traffic congestion"
    ],
    color: "bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-800 dark:text-blue-200"
  },
  {
    tier: "Tier 2 (2027-2028): Acceleration",
    milestones: [
      "Host annual Sarawak Infrastructure Innovation Summit",
      "Develop global benchmarking framework",
      "Create JKR Sarawak Knowledge Repository",
      "Participate in international infrastructure awards",
      "Complete Sarawak-Sabah Link Road Phase 1",
      "Achieve 50% IBS Scoring for projects >RM30M",
      "Implement real-time flood monitoring systems",
      "Apply ISO 55001 Standards to Asset Management",
      "Create SHO Posts in every Divisional Office"
    ],
    color: "bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200"
  },
  {
    tier: "Tier 3 (2029-2030): Excellence",
    milestones: [
      "Expand AI Analytics for Predictive Cost Modeling",
      "Achieve Road Quality Index (RQI) of 5.0 for major roads",
      "Expand accredited JKR laboratories across all divisions",
      "Retrofit 50% of existing buildings for energy efficiency",
      "Integrate Augmented Reality (AR) for design reviews",
      "Conduct five annual public satisfaction surveys",
      "Partner with universities for 50 annual internships",
      "Conduct annual ethics training for all staff"
    ],
    color: "bg-purple-100 dark:bg-purple-900/50 border-purple-500 text-purple-800 dark:text-purple-200"
  }
];

export const kpis: KPI[] = [
  { name: "I-1.10: Green Procurement Policy Development", target: "Policy Finalized", current: "Drafting Stage", targetValue: 100, currentValue: 80, plan_start: '01/01/2025', plan_end: '31/12/2026', actual_start: '15/01/2025', actual_end: '31/12/2026' },
  { name: "I-3.1: Pan Borneo Highway Completion", target: "100% Complete", current: "95% Complete", targetValue: 100, currentValue: 100, plan_start: '01/01/2025', plan_end: '31/12/2026', actual_start: '01/02/2025', actual_end: '31/12/2026' },
  { name: "Public Satisfaction Index (PSI)", target: "85%", current: "82%", targetValue: 85, currentValue: 82, actual_end: '31/12/2030', history: [{date: '2025-01-01', value: 75}, {date: '2026-04-01', value: 78}, {date: '2027-07-01', value: 81}, {date: '2028-10-01', value: 82}]},
  { name: "I-11.1: Cost Data Bank Accuracy", target: "70%", current: "65%", targetValue: 70, currentValue: 65, actual_end: '31/12/2026', history: [{date: '2025-03-01', value: 50}, {date: '2025-09-01', value: 55}, {date: '2026-03-01', value: 62}, {date: '2026-06-01', value: 65}] },
  { name: "I-2.15: Road Quality Index (RQI)", target: "5.0", current: "4.7", targetValue: 5.0, currentValue: 4.7, actual_end: '31/12/2030', history: [{date: '2025-01-01', value: 4.5}, {date: '2027-01-01', value: 4.6}, {date: '2029-01-01', value: 4.7}]},
  { name: "I-9.4: SHO Posts Creation", target: "100%", current: "40%", targetValue: 100, currentValue: 40, actual_end: '31/12/2028'},
];

const periodToDates = (period: string) => {
    const [startYear, endYear] = period.split('-');
    return {
        plan_start: `01/01/${startYear}`,
        plan_end: `31/12/${endYear}`,
    }
}

function generateProgress(plan_start_str: string, plan_end_str: string) {
    const today = new Date('2026-07-01'); // Fixed date for deterministic simulation
    const [start_day, start_month, start_year] = plan_start_str.split('/').map(Number);
    const plan_start = new Date(start_year, start_month - 1, start_day);
    const [end_day, end_month, end_year] = plan_end_str.split('/').map(Number);
    const plan_end = new Date(end_year, end_month - 1, end_day);

    if (today > plan_end) {
        // Past project
        const actual_start_date = new Date(plan_start);
        actual_start_date.setDate(actual_start_date.getDate() + Math.floor(Math.random() * 30));
        const actual_start = `${String(actual_start_date.getDate()).padStart(2, '0')}/${String(actual_start_date.getMonth() + 1).padStart(2, '0')}/${actual_start_date.getFullYear()}`;
        
        const actual_end_date = new Date(plan_end);
        actual_end_date.setDate(actual_end_date.getDate() - Math.floor(Math.random() * 30));
        const actual_end = `${String(actual_end_date.getDate()).padStart(2, '0')}/${String(actual_end_date.getMonth() + 1).padStart(2, '0')}/${actual_end_date.getFullYear()}`;

        return { progress: 100, actual_start, actual_end };
    } else if (today < plan_start) {
        // Future project
        return { progress: 0, actual_start: '', actual_end: '' };
    } else {
        // Ongoing project
        const actual_start_date = new Date(plan_start);
        actual_start_date.setDate(actual_start_date.getDate() + Math.floor(Math.random() * 30));
        const actual_start = `${String(actual_start_date.getDate()).padStart(2, '0')}/${String(actual_start_date.getMonth() + 1).padStart(2, '0')}/${actual_start_date.getFullYear()}`;
        
        const totalDuration = plan_end.getTime() - actual_start_date.getTime();
        if (totalDuration <= 0) return { progress: 5, actual_start, actual_end: '' };
        
        const elapsedDuration = today.getTime() - actual_start_date.getTime();
        
        let progress = Math.round((elapsedDuration / totalDuration) * 100);
        progress = Math.max(5, Math.min(95, progress)); // clamp progress
        progress += Math.floor(Math.random() * 10 - 5); // add some noise
        progress = Math.max(5, Math.min(95, progress));

        return { progress, actual_start, actual_end: '' };
    }
}


const rawInitiatives: Omit<Initiative, 'plan_start' | 'plan_end' | 'actual_start' | 'actual_end' | 'progress'>[] = [
  // Thrust 1
  { id: 'I-1.1', thrustId: 1, name: 'Investigate and adopt advanced construction materials for sustainability (e.g. geosynthetics, UHPC)', tier: 'Tier 2', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'Sustainable materials adopted in new designs' },
  { id: 'I-1.2', thrustId: 1, name: 'Enhance environmental management knowledge for JKR supervision teams through training and enforcement', tier: 'Tier 1', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '80% of supervision staff trained in environmental management' },
  { id: 'I-1.3', thrustId: 1, name: 'Implement comprehensive construction waste management programs to reduce waste', tier: 'Tier 2', responsibleBranch: 'Compliance Branch', expectedOutcome: 'Waste management program operational in all divisions' },
  { id: 'I-1.4', thrustId: 1, name: 'Establish pollution control measures for construction projects to mitigate environmental impact', tier: 'Tier 2', responsibleBranch: 'Quality / Environmental (Compliance) Branch', expectedOutcome: 'Pollution control measures implemented in 100% new projects' },
  { id: 'I-1.5', thrustId: 1, name: 'Train staff in sustainable construction techniques, renewable energy applications and IBS', tier: 'Tier 1', responsibleBranch: 'Training & Competency Branch', expectedOutcome: 'At least 200 staff trained in sustainable construction by 2026' },
  { id: 'I-1.6', thrustId: 1, name: 'Expand accredited JKR laboratories across Sarawak divisions', tier: 'Tier 3', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'New accredited labs in 6 divisions by 2030' },
  { id: 'I-1.7', thrustId: 1, name: 'Increase number of accredited laboratory testers to support testing demand', tier: 'Tier 2', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: '50% increase in certified testers' },
  { id: 'I-1.8', thrustId: 1, name: 'Promote more third-party accredited labs across Sarawak', tier: 'Tier 2', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'At least 10 external labs accredited' },
  { id: 'I-1.9', thrustId: 1, name: 'Integrate solar power solutions in 50% of building projects', tier: 'Tier 3', responsibleBranch: 'Electrical Branch', expectedOutcome: '50% of new buildings equipped with solar PV systems' },
  { id: 'I-1.10', thrustId: 1, name: 'Develop a green procurement policy for construction materials', tier: 'Tier 1', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Policy completed and adopted department-wide by 2026' },
  { id: 'I-1.11', thrustId: 1, name: 'Conduct annual Environmental Impact Assessments for major projects', tier: 'Tier 3', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'EIAs conducted annually for all major projects' },
  { id: 'I-1.12', thrustId: 1, name: 'Pilot carbon-neutral construction techniques in selected projects', tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'At least 2 pilot projects implementing carbon-neutral methods' },
  { id: 'I-1.13', thrustId: 1, name: 'Set up a task force for sustainable design specifications', tier: 'Tier 2', responsibleBranch: 'Building Branch', expectedOutcome: 'Task force established and guidelines developed' },
  { id: 'I-1.14', thrustId: 1, name: 'Pilot tree planting campaign for coastal areas', tier: 'Tier 1', responsibleBranch: 'Rural Development Branch', expectedOutcome: '5,000 coastal trees planted by 2026' },
  { id: 'I-1.15', thrustId: 1, name: 'Launch urban greening initiative in JKR-managed infrastructure zones', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Urban greening program implemented in 5 cities' },

  // Thrust 2
  { id: 'I-2.1', thrustId: 2, name: 'Install CCTV and smart devices for real-time tracking on bridges, buildings, and slopes', tier: 'Tier 1', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Real-time monitoring devices installed on critical structures' },
  { id: 'I-2.2', thrustId: 2, name: 'Ensure 80% of infrastructure achieves flood-resistance standards', tier: 'Tier 3', responsibleBranch: 'Road Branch', expectedOutcome: '80% compliance with flood-resilience standards' },
  { id: 'I-2.3', thrustId: 2, name: 'Review and transition from reactive to proactive asset management practices', tier: 'Tier 2', responsibleBranch: 'Road/Building Asset Branch', expectedOutcome: 'Proactive maintenance program implemented statewide' },
  { id: 'I-2.4', thrustId: 2, name: 'Enhance the quarters complaint online system for faster resolution', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Upgraded system reduces complaint resolution time by 50%' },
  { id: 'I-2.5', thrustId: 2, name: 'Expand the Building Quarters Rental Management System (BQRMS) for efficiency', tier: 'Tier 2', responsibleBranch: 'Building Branch', expectedOutcome: 'BQRMS integrated with all divisional offices' },
  { id: 'I-2.6', thrustId: 2, name: 'Develop a disaster preparedness plan for infrastructure', tier: 'Tier 2', responsibleBranch: 'Risk & Resilience Unit (PIMB)', expectedOutcome: 'Comprehensive plan adopted across all divisions' },
  { id: 'I-2.7', thrustId: 2, name: 'Retrofit 30% of bridges to improve resilience against flooding, landslides, and hazards', tier: 'Tier 3', responsibleBranch: 'Bridges & Riverine Structure Branch', expectedOutcome: '30% of bridges strengthened by 2030' },
  { id: 'I-2.8', thrustId: 2, name: 'Implement real-time flood monitoring systems', tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Flood monitoring active in 5 key flood-prone areas' },
  { id: 'I-2.9', thrustId: 2, name: 'Train staff in risk assessment and mitigation', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '200 staff certified in risk management' },
  { id: 'I-2.10', thrustId: 2, name: 'Establish a resilience task force', tier: 'Tier 1', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Task force operational by 2026' },
  { id: 'I-2.11', thrustId: 2, name: 'Conduct annual resilience audits', tier: 'Tier 3', responsibleBranch: 'Audit Branch', expectedOutcome: 'Annual resilience audit reports produced' },
  { id: 'I-2.12', thrustId: 2, name: 'Pilot climate-resilient road designs', tier: 'Tier 3', responsibleBranch: 'Road Branch', expectedOutcome: 'At least 2 climate-resilient road sections implemented' },
  { id: 'I-2.13', thrustId: 2, name: 'Integrate early warning systems for slopes', tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Early warning system operational in 3 slope-prone zones' },
  { id: 'I-2.14', thrustId: 2, name: 'Develop a post-disaster recovery framework', tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Framework endorsed by 2028' },
  { id: 'I-2.15', thrustId: 2, name: 'Achieve Road Quality Index (RQI) of 5.0 for major roads', tier: 'Tier 3', responsibleBranch: 'Road Branch', expectedOutcome: 'RQI of 5.0 achieved by 2030' },
  
  // Thrust 3
  { id: 'I-3.1', thrustId: 3, name: 'Complete the remaining Pan Borneo Highway sections by 2026', tier: 'Tier 1', responsibleBranch: 'Road Branch', expectedOutcome: '100% completion of remaining Pan Borneo sections' },
  { id: 'I-3.2', thrustId: 3, name: 'Complete the Sarawak-Sabah Link Road Phase 1 (77 km) by 2027', tier: 'Tier 2', responsibleBranch: 'Road Branch', expectedOutcome: 'SSLR Phase 1 completed by 2027' },
  { id: 'I-3.3', thrustId: 3, name: 'Complete the Sarawak-Sabah Link Road Phase 2 (335 km) by 2028', tier: 'Tier 3', responsibleBranch: 'Road Branch', expectedOutcome: 'SSLR Phase 2 fully completed' },
  { id: 'I-3.4', thrustId: 3, name: 'Complete the Coastal Road Network Connectivity projects by 2027', tier: 'Tier 2', responsibleBranch: 'Road Branch', expectedOutcome: 'Coastal Road projects 100% completed by 2027' },
  { id: 'I-3.5', thrustId: 3, name: 'Complete the Second Trunk Road (CSTR) by 2029', tier: 'Tier 3', responsibleBranch: 'Road Branch', expectedOutcome: 'CSTR fully completed and operational' },
  { id: 'I-3.6', thrustId: 3, name: 'Complete the Lebuhraya Trans Borneo (93.25 km) by 2028', tier: 'Tier 3', responsibleBranch: 'Road Branch', expectedOutcome: 'Trans Borneo section completed by 2028' },
  { id: 'I-3.7', thrustId: 3, name: 'Complete 38 bridges under Rural Bridge Replacement Programme by 2028', tier: 'Tier 2', responsibleBranch: 'Bridges & Riverine Structure Branch', expectedOutcome: 'All 38 rural bridges completed' },
  { id: 'I-3.8', thrustId: 3, name: 'Complete road connectivity to rural settlements by 2030', tier: 'Tier 3', responsibleBranch: 'Rural Development Branch', expectedOutcome: 'Full connectivity achieved for rural settlements' },
  { id: 'I-3.9', thrustId: 3, name: 'Establish connectivity hubs in rural divisions by 2029', tier: 'Tier 3', responsibleBranch: 'Rural Development Branch', expectedOutcome: 'Connectivity hubs established in all divisions' },
  { id: 'I-3.10', thrustId: 3, name: 'Integrate GIS mapping for project planning by 2028', tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'GIS integrated into planning database' },
  { id: 'I-3.11', thrustId: 3, name: 'Develop and execute the Rural Connectivity Master Plan', tier: 'Tier 3', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Master Plan endorsed and implemented' },
  { id: 'I-3.12', thrustId: 3, name: 'Upgrade the existing Digital Divisional Development Plan (DDPApp) by 2026', tier: 'Tier 1', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Enhanced DDPApp system deployed' },
  { id: 'I-3.13', thrustId: 3, name: 'Develop a Traffic Management Masterplan by 2026', tier: 'Tier 1', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Traffic Masterplan completed and approved' },
  
  // Thrust 4
  { id: 'I-4.1', thrustId: 4, name: "Upgrade the existing JKR Dashboard (Enhanced with AI) and deploy by 2025", tier: 'Tier 1', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Enhanced dashboard with AI analytics operational by 2025' },
  { id: 'I-4.2', thrustId: 4, name: "Accelerate acquisition of Site Investigation (S.I.) data under C&S Consultants' Terms for critical projects", tier: 'Tier 1', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'S.I. data completed early for all critical projects' },
  { id: 'I-4.3', thrustId: 4, name: "Conduct strategic internal and external engagements to refine project processes", tier: 'Tier 2', responsibleBranch: 'Project Implementation & Monitoring Branch (PIMB)', expectedOutcome: 'Stakeholder process improvements implemented' },
  { id: 'I-4.4', thrustId: 4, name: "Establish standardized guidelines for detailed project briefs across technical branches", tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Guidelines endorsed and adopted department-wide' },
  { id: 'I-4.5', thrustId: 4, name: "Form an Expert Value Management Team for projects above RM70 million", tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch / QS Branch', expectedOutcome: 'Value Management Team established and active' },
  { id: 'I-4.6', thrustId: 4, name: "Adopt Building Information Modelling (BIM) for projects above RM100 million", tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'BIM adoption achieved for 100% of large projects' },
  { id: 'I-4.7', thrustId: 4, name: "Implement front-end engineering and technology-driven project planning processes", tier: 'Tier 2', responsibleBranch: 'C&S / Building Branch', expectedOutcome: 'All new projects adopt front-end engineering' },
  { id: 'I-4.8', thrustId: 4, name: "Waive MTRA requirements for non-critical projects and train staff with SRB & CENTEXS", tier: 'Tier 1', responsibleBranch: 'Training & Competency Branch', expectedOutcome: 'MTRA process optimized and staff trained' },
  { id: 'I-4.9', thrustId: 4, name: "Centralize preparation and compilation of tender documents by Quantity Surveyors (QS)", tier: 'Tier 1', responsibleBranch: 'Quantity Surveying Branch', expectedOutcome: 'Centralized QS documentation system implemented' },
  { id: 'I-4.10', thrustId: 4, name: "Employ international experts on contract basis for advanced construction techniques", tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Expertise engaged for innovation and optimization' },
  { id: 'I-4.11', thrustId: 4, name: "Develop a project delay mitigation framework by 2027", tier: 'Tier 2', responsibleBranch: 'Project Implementation & Monitoring Branch (PIMB)', expectedOutcome: 'Framework applied to major projects by 2027' },
  { id: 'I-4.12', thrustId: 4, name: "Pilot AI-based project scheduling tools by 2026", tier: 'Tier 1', responsibleBranch: 'Special Project Branch', expectedOutcome: 'AI scheduling tools tested successfully' },
  { id: 'I-4.13', thrustId: 4, name: "Develop centralized consultancy services system (CP) for pre-contract processes", tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch / PIMB', expectedOutcome: 'Consultancy system operational by 2028' },
  { id: 'I-4.14', thrustId: 4, name: "Implement sustainable design specifications for building projects", tier: 'Tier 1', responsibleBranch: 'Building Branch', expectedOutcome: 'Sustainable design standards applied to all new projects' },
  { id: 'I-4.15', thrustId: 4, name: "Achieve 50% IBS scoring for projects above RM30 million by 2027", tier: 'Tier 2', responsibleBranch: 'Building Branch', expectedOutcome: 'IBS compliance improved to 50%' },
  { id: 'I-4.16', thrustId: 4, name: "Formulate and launch comprehensive building planning guidelines by 2029", tier: 'Tier 3', responsibleBranch: 'Building Branch', expectedOutcome: 'Guidelines published and applied by 2029' },
  
  // Thrust 5
  { id: 'I-5.1', thrustId: 5, name: 'Develop and deploy AI & IoT systems for real-time monitoring of infrastructure', tier: 'Tier 2', responsibleBranch: 'Special Project Branch / Road Asset', expectedOutcome: 'Real-time monitoring on key assets implemented' },
  { id: 'I-5.2', thrustId: 5, name: 'Expand Structural Health Monitoring System (SHMS) for cable-stayed bridges', tier: 'Tier 2', responsibleBranch: 'Bridges & Riverine Structure Branch', expectedOutcome: 'SHMS installed on all cable-stayed bridges' },
  { id: 'I-5.3', thrustId: 5, name: 'Develop a comprehensive slope safety management system', tier: 'Tier 2', responsibleBranch: 'Road Branch', expectedOutcome: 'Slope safety database operational' },
  { id: 'I-5.4', thrustId: 5, name: 'Endorse state-wide Building Asset Maintenance Management Guidelines', tier: 'Tier 1', responsibleBranch: 'Building Branch', expectedOutcome: 'Guidelines adopted across all divisions' },
  { id: 'I-5.5', thrustId: 5, name: 'Establish Facility Management (FM) Units at HQ and Divisions', tier: 'Tier 2', responsibleBranch: 'Road/Building Asset Branch', expectedOutcome: 'FM Units operational in all divisions' },
  { id: 'I-5.6', thrustId: 5, name: 'Implement Facility Maintenance and Maintenance Contracts (FMMC) for efficient upkeep', tier: 'Tier 2', responsibleBranch: 'Road/Building Asset Branch', expectedOutcome: 'Standardized FMMC applied to all contracts' },
  { id: 'I-5.7', thrustId: 5, name: 'Apply ISO 55001 Standards to Asset Management and Wayleave Applications', tier: 'Tier 1', responsibleBranch: 'Compliance Branch', expectedOutcome: 'ISO 55001 certified asset management system' },
  { id: 'I-5.8', thrustId: 5, name: 'Develop IoT systems specifically for road maintenance and management', tier: 'Tier 3', responsibleBranch: 'Special Project Branch / Road Branch', expectedOutcome: 'IoT integrated into road maintenance' },
  { id: 'I-5.9', thrustId: 5, name: 'Retrofit 50% of existing buildings for energy efficiency', tier: 'Tier 3', responsibleBranch: 'Building Branch / Electrical Branch', expectedOutcome: 'Energy-efficient retrofits completed' },
  { id: 'I-5.10', thrustId: 5, name: 'Implement a centralized asset inventory system by 2027', tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Centralized asset inventory live' },
  { id: 'I-5.11', thrustId: 5, name: 'Train staff in advanced asset management software', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '200 staff certified in asset management software' },

  // Thrust 6
  { id: 'I-6.1', thrustId: 6, name: 'Utilize BIM in post-contract stages (3D, 4D, 5D) for project management', tier: 'Tier 1', responsibleBranch: 'Special Project Branch', expectedOutcome: 'BIM post-contract processes implemented' },
  { id: 'I-6.2', thrustId: 6, name: 'Integrate BIM devices and software into new project contracts', tier: 'Tier 2', responsibleBranch: 'Special Project Branch', expectedOutcome: 'BIM integration in 100% new contracts' },
  { id: 'I-6.3', thrustId: 6, name: 'Establish Big Data Analytics for construction insights', tier: 'Tier 2', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Data-driven insights for decision-making' },
  { id: 'I-6.4', thrustId: 6, name: 'Digitalize State Pre-Approved Plan (SPAP) in BIM format', tier: 'Tier 2', responsibleBranch: 'Special Project Branch', expectedOutcome: 'SPAP fully digitalized by 2026' },
  { id: 'I-6.5', thrustId: 6, name: 'JKR Sarawak Research Centre as the Centre of Excellence for technology research', tier: 'Tier 3', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'Centre operational and recognized by 2030' },
  { id: 'I-6.6', thrustId: 6, name: 'Train staff in AI-driven project management tools', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '100 staff certified in AI project management' },
  { id: 'I-6.7', thrustId: 6, name: 'Pilot blockchain for contract transparency', tier: 'Tier 3', responsibleBranch: 'Special Project Branch / Integrity Branch', expectedOutcome: 'Blockchain pilot completed successfully' },
  { id: 'I-6.8', thrustId: 6, name: 'Develop a construction technology innovation hub', tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Innovation hub launched by 2028' },
  { id: 'I-6.9', thrustId: 6, name: 'Integrate augmented reality (AR) for design reviews', tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'AR applied in design review process' },
  { id: 'I-6.10', thrustId: 6, name: 'Expand AI analytics for predictive cost modeling', tier: 'Tier 3', responsibleBranch: 'Special Project Branch', expectedOutcome: 'Predictive cost modeling tool operational' },
  { id: 'I-6.11', thrustId: 6, name: 'Digitalize cost data bank to Power BI in 2026 for improved accuracy', tier: 'Tier 1', responsibleBranch: 'Corporate Planning / Special Project Branch', expectedOutcome: 'Power BI platform implemented by 2026' },
  
  // Thrust 7
  { id: 'I-7.1', thrustId: 7, name: 'Conduct awareness campaigns and roadshows on sustainable design and IBS adoption', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch / Building Branch', expectedOutcome: '5 campaigns held annually statewide' },
  { id: 'I-7.2', thrustId: 7, name: 'Engage communities through public participation events like Hari Bersama Pelanggan', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'At least one event per division yearly' },
  { id: 'I-7.3', thrustId: 7, name: 'Promote local employment opportunities within infrastructure projects', tier: 'Tier 2', responsibleBranch: 'Rural Development Branch / PIMB', expectedOutcome: '30% of local workers engaged in projects' },
  { id: 'I-7.4', thrustId: 7, name: 'Ensure 30% of project contracts awarded to local SMEs by 2028', tier: 'Tier 2', responsibleBranch: 'Quantity Surveying Branch / Finance Branch', expectedOutcome: 'SME participation target met by 2028' },
  { id: 'I-7.5', thrustId: 7, name: 'Develop accessibility standards for public buildings by 2027', tier: 'Tier 2', responsibleBranch: 'Building Branch / C&S Branch', expectedOutcome: 'Standards approved and applied by 2027' },
  { id: 'I-7.6', thrustId: 7, name: 'Develop a community feedback portal by 2027', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch / Special Project Branch', expectedOutcome: 'Portal operational by 2027' },
  { id: 'I-7.7', thrustId: 7, name: 'Establish divisional stakeholder committees by 2028', tier: 'Tier 3', responsibleBranch: 'Divisional Offices', expectedOutcome: 'Committees operational in all divisions' },

  // Thrust 8
  { id: 'I-8.1', thrustId: 8, name: 'Conduct active stakeholder engagement sessions with agencies and utilities', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch / Corporate Planning', expectedOutcome: '2 engagement sessions held yearly' },
  { id: 'I-8.2', thrustId: 8, name: 'Leverage digital platforms like MyJKR App for real-time project updates', tier: 'Tier 1', responsibleBranch: 'Special Project Branch', expectedOutcome: 'MyJKR App fully operational by 2026' },
  { id: 'I-8.3', thrustId: 8, name: 'Showcase success stories and community impact of completed projects', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: '10 project showcases per year' },
  { id: 'I-8.4', thrustId: 8, name: 'Build long-term relationships through media engagement events', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Annual Hari Bersama Media organized' },
  { id: 'I-8.5', thrustId: 8, name: 'Expedite response times to public complaints and monitor sentiment', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Response time reduced by 40%' },
  { id: 'I-8.6', thrustId: 8, name: 'Enhance reputation by highlighting innovation and progress on digital platforms', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Social media outreach increased by 50%' },
  { id: 'I-8.7', thrustId: 8, name: 'Conduct five annual public satisfaction surveys by 2030', tier: 'Tier 3', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Surveys completed with >80% satisfaction rate' },
  { id: 'I-8.8', thrustId: 8, name: 'Launch "JKR Open Site Day" for public education', tier: 'Tier 2', responsibleBranch: 'Divisional Offices', expectedOutcome: '12 open site days conducted' },
  { id: 'I-8.9', thrustId: 8, name: 'Roll out "We Build for You" digital mini-series (video stories)', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Video series published quarterly' },
  { id: 'I-8.10', thrustId: 8, name: 'Formalize "Rakan Media" partnership programme', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Partnership programme launched' },
  { id: 'I-8.11', thrustId: 8, name: 'Conduct media training sessions for JKR officers', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '100 officers trained' },

  // Thrust 9
  { id: 'I-9.1', thrustId: 9, name: 'Conduct annual BIM training for 150 basic and 50 intermediate participants', tier: 'Tier 1', responsibleBranch: 'Training & Competency Branch / Special Project Branch', expectedOutcome: '200 staff trained annually' },
  { id: 'I-9.2', thrustId: 9, name: 'Train staff in QAQC, QLASSIC, MS Project, Primavera, and safety protocols', tier: 'Tier 1', responsibleBranch: 'Training & Competency Branch / Compliance Branch', expectedOutcome: '300 staff trained yearly' },
  { id: 'I-9.3', thrustId: 9, name: 'Provide accredited CCPM Level 6 training for PIMB staff, DEs, and ADES', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '100 project managers certified' },
  { id: 'I-9.4', thrustId: 9, name: 'Create Qualified Safety and Health Officer (SHO) posts in every divisional office', tier: 'Tier 2', responsibleBranch: 'Divisional Offices / HR Branch', expectedOutcome: 'SHO post created in all divisions' },
  { id: 'I-9.5', thrustId: 9, name: 'Establish a competency-based career development framework', tier: 'Tier 2', responsibleBranch: 'Human Resource Branch / Training & Competency Branch', expectedOutcome: 'Framework completed by 2027' },
  { id: 'I-9.6', thrustId: 9, name: 'Identify high-potential employees for targeted leadership development', tier: 'Tier 2', responsibleBranch: 'Human Resource Branch', expectedOutcome: 'Leadership pool established' },
  { id: 'I-9.7', thrustId: 9, name: 'Implement job shadowing and mentor-mentee programs', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: 'Mentorship program active across HQ and divisions' },
  { id: 'I-9.8', thrustId: 9, name: 'Conduct rightsizing activities to restructure and optimize organizational structure', tier: 'Tier 2', responsibleBranch: 'Corporate Planning / HR Branch', expectedOutcome: 'Rightsizing exercise completed' },
  { id: 'I-9.9', thrustId: 9, name: 'Create new posts for appointment and promotion to support growth', tier: 'Tier 2', responsibleBranch: 'Human Resource Branch', expectedOutcome: 'New posts approved and filled' },
  { id: 'I-9.10', thrustId: 9, name: 'Launch a Young Engineers Program for 100 graduates by 2028', tier: 'Tier 3', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '100 young engineers enrolled' },
  { id: 'I-9.11', thrustId: 9, name: 'Develop a Digital Skills Certification Program by 2027', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch / Special Project Branch', expectedOutcome: 'Digital certification introduced' },
  { id: 'I-9.12', thrustId: 9, name: 'Partner with universities for 50 annual internships by 2030', tier: 'Tier 3', responsibleBranch: 'Training & Competency Branch / HR Branch', expectedOutcome: '50 interns onboarded annually' },
  { id: 'I-9.13', thrustId: 9, name: 'Train 50 staff in drone operations for construction oversight', tier: 'Tier 3', responsibleBranch: 'Special Project Branch / Training Branch', expectedOutcome: '50 drone-certified staff by 2029' },

  // Thrust 10
  { id: 'I-10.1', thrustId: 10, name: 'Enable online submission systems for PTIVO and EOT approvals', tier: 'Tier 1', responsibleBranch: 'Special Project Branch / PIMB', expectedOutcome: 'Full online submission system operational' },
  { id: 'I-10.2', thrustId: 10, name: 'Ensure completion of Project Execution Plans (PEPs) before commencement', tier: 'Tier 1', responsibleBranch: 'PIMB / Corporate Planning Branch', expectedOutcome: '100% of projects with PEPs' },
  { id: 'I-10.3', thrustId: 10, name: 'Propose payment of consultant supervision fees under SO', tier: 'Tier 2', responsibleBranch: 'Finance Branch / QS Branch', expectedOutcome: 'Standardized consultant payment policy' },
  { id: 'I-10.4', thrustId: 10, name: 'Mandate employment of Site Agents/Project Managers by licensees with EPF/SOCSO', tier: 'Tier 2', responsibleBranch: 'PIMB / HR Branch', expectedOutcome: 'All contractors comply with HR proof' },
  { id: 'I-10.5', thrustId: 10, name: 'Achieve full compliance with QAQC and QLASSIC quality control systems', tier: 'Tier 3', responsibleBranch: 'Compliance Branch', expectedOutcome: '100% QAQC adoption' },
  { id: 'I-10.6', thrustId: 10, name: 'Conduct periodic financial and operational governance audits', tier: 'Tier 2', responsibleBranch: 'Audit Branch', expectedOutcome: 'Audit findings reported annually' },
  { id: 'I-10.7', thrustId: 10, name: 'Establish clear linkages between funding and PCDS 2030 objectives', tier: 'Tier 2', responsibleBranch: 'Corporate Planning / Finance Branch', expectedOutcome: 'Funding-PCDS alignment documented' },
  { id: 'I-10.8', thrustId: 10, name: 'Create a database for consultants and contractors across Sarawak', tier: 'Tier 1', responsibleBranch: 'Corporate Planning Branch / PIMB', expectedOutcome: 'Database launched' },
  { id: 'I-10.9', thrustId: 10, name: 'Implement a whistleblower policy for ethical reporting', tier: 'Tier 1', responsibleBranch: 'Integrity Branch', expectedOutcome: 'Policy active with reporting mechanism' },
  { id: 'I-10.10', thrustId: 10, name: 'Conduct annual ethics training for all staff', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch / Integrity Branch', expectedOutcome: '100% staff trained yearly' },
  { id: 'I-10.11', thrustId: 10, name: 'Develop a public accountability dashboard by 2027', tier: 'Tier 2', responsibleBranch: 'Corporate Planning Branch / Special Project Branch', expectedOutcome: 'Dashboard online by 2027' },

  // Thrust 11
  { id: 'I-11.1', thrustId: 11, name: 'Develop a comprehensive cost data bank supporting 70% estimation accuracy', tier: 'Tier 1', responsibleBranch: 'Corporate Planning / QS Branch', expectedOutcome: 'Cost Data Bank operational' },
  { id: 'I-11.2', thrustId: 11, name: 'Digitalize cost data bank using N3C methodology on cloud', tier: 'Tier 2', responsibleBranch: 'Special Project Branch / QS Branch', expectedOutcome: 'N3C platform deployed' },
  { id: 'I-11.3', thrustId: 11, name: 'Implement Result-Based Budgeting (RBB) across all divisions', tier: 'Tier 2', responsibleBranch: 'Finance Branch / Corporate Planning', expectedOutcome: 'RBB fully implemented' },
  { id: 'I-11.4', thrustId: 11, name: 'Establish a state fleet hub with tracking software', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: 'Fleet tracking hub established' },
  { id: 'I-11.5', thrustId: 11, name: 'Enhance vehicle operational efficiency using GPS and fuel measures', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: '15% fuel savings achieved' },
  { id: 'I-11.6', thrustId: 11, name: 'Develop cash flow forecasts through stakeholder engagement', tier: 'Tier 2', responsibleBranch: 'Finance Branch', expectedOutcome: 'Forecasting model used for all divisions' },
  { id: 'I-11.7', thrustId: 11, name: 'Phase out construction machinery over 15 years old', tier: 'Tier 2', responsibleBranch: 'Corporate Communication Branch', expectedOutcome: '100% of aged machines replaced' },
  { id: 'I-11.8', thrustId: 11, name: 'Incorporate cost data bank with BIM for project planning', tier: 'Tier 3', responsibleBranch: 'Special Project Branch / QS Branch', expectedOutcome: 'BIM-Cost Data integration completed' },
  { id: 'I-11.9', thrustId: 11, name: 'Conduct annual cost-benefit analyses for major projects', tier: 'Tier 3', responsibleBranch: 'Finance Branch / Corporate Planning', expectedOutcome: 'Yearly reports completed' },
  { id: 'I-11.10', thrustId: 11, name: 'Pilot a resource-sharing program across divisions', tier: 'Tier 3', responsibleBranch: 'Corporate Planning / HR Branch', expectedOutcome: 'Pilot successfully implemented' },
  { id: 'I-11.11', thrustId: 11, name: 'Implement energy-saving measures in JKR facilities', tier: 'Tier 2', responsibleBranch: 'Electrical Branch / Building Branch', expectedOutcome: '10% reduction in energy use' },
  { id: 'I-11.12', thrustId: 11, name: 'Apply funding of RM2.5M to shift cost data bank to a sophisticated platform', tier: 'Tier 1', responsibleBranch: 'Corporate Planning / QS Branch', expectedOutcome: 'Platform upgrade funded and completed' },

  // Thrust 12
  { id: 'I-12.1', thrustId: 12, name: 'Establish international knowledge exchange program', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch / Corporate Planning', expectedOutcome: 'Annual exchanges held' },
  { id: 'I-12.2', thrustId: 12, name: 'Host annual Sarawak Infrastructure Innovation Summit', tier: 'Tier 2', responsibleBranch: 'Special Project Branch / Corporate Communication', expectedOutcome: 'Summit held every year' },
  { id: 'I-12.3', thrustId: 12, name: 'Develop global benchmarking framework', tier: 'Tier 3', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Framework endorsed' },
  { id: 'I-12.4', thrustId: 12, name: 'Create JKR Sarawak Knowledge Repository', tier: 'Tier 2', responsibleBranch: 'Special Project Branch / Training Branch', expectedOutcome: 'Repository online' },
  { id: 'I-12.5', thrustId: 12, name: 'Participate in international infrastructure awards', tier: 'Tier 1', responsibleBranch: 'Corporate Communication Branch / PIMB', expectedOutcome: 'Minimum one global submission yearly' },
  { id: 'I-12.6', thrustId: 12, name: 'Conduct peer review exchanges', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: '2 exchanges per year' },
  { id: 'I-12.7', thrustId: 12, name: 'Publish annual best practices report', tier: 'Tier 3', responsibleBranch: 'Corporate Planning / Integrity Branch', expectedOutcome: 'Annual report published' },
  { id: 'I-12.8', thrustId: 12, name: 'Develop knowledge transfer program', tier: 'Tier 2', responsibleBranch: 'Training & Competency Branch', expectedOutcome: 'Program established' },
  { id: 'I-12.9', thrustId: 12, name: 'Join global infrastructure networks', tier: 'Tier 3', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Membership in at least 3 global networks' },
  { id: 'I-12.10', thrustId: 12, name: 'Pilot cross-border research collaboration', tier: 'Tier 3', responsibleBranch: 'Research & Investigation Branch', expectedOutcome: 'Collaborative project completed' },
  { id: 'I-12.11', thrustId: 12, name: 'Publish JKR Sarawak Annual Report', tier: 'Tier 1', responsibleBranch: 'Corporate Planning Branch', expectedOutcome: 'Annual report issued yearly' },
  { id: 'I-12.12', thrustId: 12, name: 'Establish an Expert Value Management Team with EPU', tier: 'Tier 2', responsibleBranch: 'Corporate Planning / QS Branch', expectedOutcome: 'Team operational by 2028' },
];

const periodData: { [key: string]: string } = {
    'I-1.1': '2026-2028', 'I-1.2': '2025-2026', 'I-1.3': '2026-2028', 'I-1.4': '2026-2028', 'I-1.5': '2025-2026', 'I-1.6': '2028-2030', 'I-1.7': '2026-2028', 'I-1.8': '2026-2028', 'I-1.9': '2028-2030', 'I-1.10': '2025-2026', 'I-1.11': '2028-2030', 'I-1.12': '2028-2030', 'I-1.13': '2026-2028', 'I-1.14': '2025-2026', 'I-1.15': '2026-2028',
    'I-2.1': '2025-2026', 'I-2.2': '2028-2030', 'I-2.3': '2026-2028', 'I-2.4': '2025-2026', 'I-2.5': '2026-2028', 'I-2.6': '2026-2028', 'I-2.7': '2028-2030', 'I-2.8': '2028-2030', 'I-2.9': '2026-2028', 'I-2.10': '2025-2026', 'I-2.11': '2028-2030', 'I-2.12': '2028-2030', 'I-2.13': '2028-2030', 'I-2.14': '2026-2028', 'I-2.15': '2028-2030',
    'I-3.1': '2025-2026', 'I-3.2': '2026-2028', 'I-3.3': '2028-2030', 'I-3.4': '2026-2028', 'I-3.5': '2028-2030', 'I-3.6': '2028-2030', 'I-3.7': '2026-2028', 'I-3.8': '2028-2030', 'I-3.9': '2028-2030', 'I-3.10': '2026-2028', 'I-3.11': '2028-2030', 'I-3.12': '2025-2026', 'I-3.13': '2025-2026',
    'I-4.1': '2025-2026', 'I-4.2': '2025-2026', 'I-4.3': '2026-2028', 'I-4.4': '2026-2028', 'I-4.5': '2026-2028', 'I-4.6': '2028-2030', 'I-4.7': '2026-2028', 'I-4.8': '2025-2026', 'I-4.9': '2025-2026', 'I-4.10': '2028-2030', 'I-4.11': '2026-2028', 'I-4.12': '2025-2026', 'I-4.13': '2026-2028', 'I-4.14': '2025-2026', 'I-4.15': '2026-2028', 'I-4.16': '2028-2030',
    'I-5.1': '2026-2028', 'I-5.2': '2026-2028', 'I-5.3': '2026-2028', 'I-5.4': '2025-2026', 'I-5.5': '2026-2028', 'I-5.6': '2026-2028', 'I-5.7': '2025-2026', 'I-5.8': '2028-2030', 'I-5.9': '2028-2030', 'I-5.10': '2026-2028', 'I-5.11': '2026-2028',
    'I-6.1': '2025-2026', 'I-6.2': '2026-2028', 'I-6.3': '2026-2028', 'I-6.4': '2026-2028', 'I-6.5': '2028-2030', 'I-6.6': '2026-2028', 'I-6.7': '2028-2030', 'I-6.8': '2028-2030', 'I-6.9': '2028-2030', 'I-6.10': '2028-2030', 'I-6.11': '2025-2026',
    'I-7.1': '2025-2026', 'I-7.2': '2025-2026', 'I-7.3': '2026-2028', 'I-7.4': '2026-2028', 'I-7.5': '2026-2028', 'I-7.6': '2026-2028', 'I-7.7': '2028-2030',
    'I-8.1': '2025-2026', 'I-8.2': '2025-2026', 'I-8.3': '2025-2026', 'I-8.4': '2026-2028', 'I-8.5': '2026-2028', 'I-8.6': '2025-2026', 'I-8.7': '2028-2030', 'I-8.8': '2026-2028', 'I-8.9': '2026-2028', 'I-8.10': '2025-2026', 'I-8.11': '2026-2028',
    'I-9.1': '2025-2026', 'I-9.2': '2025-2026', 'I-9.3': '2026-2028', 'I-9.4': '2026-2028', 'I-9.5': '2026-2028', 'I-9.6': '2026-2028', 'I-9.7': '2026-2028', 'I-9.8': '2026-2028', 'I-9.9': '2026-2028', 'I-9.10': '2028-2030', 'I-9.11': '2026-2028', 'I-9.12': '2028-2030', 'I-9.13': '2028-2030',
    'I-10.1': '2025-2026', 'I-10.2': '2025-2026', 'I-10.3': '2026-2028', 'I-10.4': '2026-2028', 'I-10.5': '2028-2030', 'I-10.6': '2026-2028', 'I-10.7': '2026-2028', 'I-10.8': '2025-2026', 'I-10.9': '2025-2026', 'I-10.10': '2026-2028', 'I-10.11': '2026-2028',
    'I-11.1': '2025-2026', 'I-11.2': '2026-2028', 'I-11.3': '2026-2028', 'I-11.4': '2026-2028', 'I-11.5': '2026-2028', 'I-11.6': '2026-2028', 'I-11.7': '2026-2028', 'I-11.8': '2028-2030', 'I-11.9': '2028-2030', 'I-11.10': '2028-2030', 'I-11.11': '2026-2028', 'I-11.12': '2025-2026',
    'I-12.1': '2026-2028', 'I-12.2': '2026-2028', 'I-12.3': '2028-2030', 'I-12.4': '2026-2028', 'I-12.5': '2025-2026', 'I-12.6': '2026-2028', 'I-12.7': '2028-2030', 'I-12.8': '2026-2028', 'I-12.9': '2028-2030', 'I-12.10': '2028-2030', 'I-12.11': '2025-2026', 'I-12.12': '2026-2028',
}


export const initiativesData: Initiative[] = rawInitiatives.map(initiative => {
    const period = periodData[initiative.id] || '2025-2026'; // Default period
    const { plan_start, plan_end } = periodToDates(period);
    const progressInfo = generateProgress(plan_start, plan_end);
    return {
        ...initiative,
        plan_start,
        plan_end,
        ...progressInfo
    };
});


export const navItems: NavItem[] = [
  { id: 'welcome', label: 'Welcome', icon: LayoutDashboard },
  { id: 'overview', label: 'Plan Overview', icon: Target },
  { id: 'thrusts', label: '12 Strategic Thrusts', icon: Users },
  { id: 'roadmap', label: 'Tier Milestones', icon: Calendar },
  { id: 'timeline', label: 'Initiatives Timeline', icon: BarChart3 },
  { id: 'dashboard', label: 'Live Dashboard', icon: TrendingUp },
  { id: 'financials', label: 'Financials', icon: Banknote },
  { id: 'stories', label: 'Success Stories', icon: Video },
  { id: 'engage', label: 'Engage With Us', icon: MessageSquare }
];


export const initialSuccessStories: SuccessStory[] = [
  { id: 1, title: 'Pan Borneo Highway', subtitle: 'Connecting Communities', description: 'Watch the story of how the Pan Borneo Highway project is transforming travel and creating economic opportunities across Sarawak.', gradient: 'from-blue-500 to-indigo-600', href: '#', buttonText: 'Watch Episode 1' },
  { id: 2, title: 'Rural Electrification', subtitle: 'Powering Progress', description: 'Discover the impact of bringing reliable electricity to remote villages, empowering education, healthcare, and local businesses.', gradient: 'from-yellow-400 to-orange-500', href: '#', buttonText: 'Watch Episode 2' },
  { id: 3, title: 'Sustainable Water Supply', subtitle: 'Clean Water for All', description: 'Learn about our innovative water treatment and supply projects that ensure safe, clean drinking water for communities state-wide.', gradient: 'from-green-400 to-teal-500', href: '#', buttonText: 'Watch Episode 3' }
];

export const initialStoriesPageContent: StoriesPageContent = {
  mainTitle: 'Our Success Stories: Building a Better Sarawak',
  mainSubtitle: 'Explore our "We Build for You" video series, showcasing the real-world impact of our infrastructure projects on the people and communities of Sarawak.',
  knowledgeSharingTitle: 'Commitment to Knowledge Sharing',
  knowledgeSharingBody: 'As part of Strategic Thrust 12, we are dedicated to documenting and sharing our successes, challenges, and innovations. These stories not only build public confidence but also serve as valuable learning resources for our teams and partners, fostering a culture of continuous improvement and excellence.'
};

export const initialEngagementChannels: EngagementChannel[] = [
  { id: 1, icon: Smartphone, color: 'text-red-500', title: 'MyJKR App', description: 'Get real-time project updates, report issues, and provide feedback directly from your mobile device.', buttonText: 'Download Now', buttonColor: 'bg-red-600 hover:bg-red-700', href: '#' },
  { id: 2, icon: MessageSquare, color: 'text-blue-500', title: 'Feedback Portal', description: 'Our official channel for suggestions, complaints, and compliments. Your feedback helps us improve our services.', buttonText: 'Submit Feedback', buttonColor: 'bg-blue-600 hover:bg-blue-700', href: '#' },
  { id: 3, icon: BookOpen, color: 'text-green-500', title: 'Annual Report', description: 'Read our comprehensive annual reports for detailed insights into our performance, projects, and financial stewardship.', buttonText: 'View Reports', buttonColor: 'bg-green-600 hover:bg-green-700', href: '#' },
];

export const initialEngagePageContent: EngagePageContent = {
  mainTitle: 'Stakeholder Engagement & Public Confidence',
  mainSubtitle: 'Building trust is at the heart of what we do. We are committed to transparent communication, active community engagement, and upholding the highest standards of governance to ensure public confidence in our work.',
  transparencyTitle: 'Our Commitment to Transparency & Governance',
  governanceTitle: 'Strong Governance',
  governanceInitiatives: [
    { id: 1, text: 'through full compliance with QAQC and QLASSIC quality control systems.', strong: 'Quality Assurance' },
    { id: 2, text: 'for ethical reporting and accountability (Thrust 10).', strong: 'Whistleblower Policy' },
    { id: 3, text: 'to maintain financial and technical transparency.', strong: 'Periodic Compliance Audits' },
  ],
  mediaTitle: 'Media & Public Relations',
  mediaInitiatives: [
    { id: 1, text: 'for real-time updates and feedback (Thrust 8).', strong: 'MyJKR App' },
    { id: 2, text: 'to showcase community impact and project successes.', strong: 'Success Story Showcase' },
    { id: 3, text: 'to foster strong relationships with media partners.', strong: 'Annual "Hari Bersama Media"' },
  ],
};

export const initialWelcomePageContent: WelcomePageContent = {
  title: "JKR Sarawak Strategic Plan 2025-2030",
  subtitle: "Pioneering the Future of Engineering in Sarawak",
  body: "This interactive dashboard provides a comprehensive overview of our strategic direction for the next five years. We are committed to delivering sustainable, resilient, and innovative infrastructure that drives Sarawak's economic growth and social well-being in alignment with PCDS 2030. Explore our strategic thrusts, track our progress, and see how we are building a better future for you."
};