import type { FinancialSummary, ThrustFinancials } from '../types';

export const financialSummaryData: FinancialSummary = {
  title: "Financial Performance Overview",
  subtitle: "Tracking budget allocation and spending across all strategic thrusts to ensure fiscal responsibility and value for money.",
  budget: 2500000000, // 2.5 Billion
  spending: 750000000, // 750 Million
};

export const thrustFinancialsData: ThrustFinancials[] = [
  { id: 1, thrustId: 1, thrustTitle: "Environmental Sustainability", budget: 200000000, spending: 65000000 },
  { id: 2, thrustId: 2, thrustTitle: "Risk and Resilience Management", budget: 150000000, spending: 40000000 },
  { id: 3, thrustId: 3, thrustTitle: "Spatial Planning and Regional Connectivity", budget: 450000000, spending: 180000000 },
  { id: 4, thrustId: 4, thrustTitle: "Smart and Efficient Project Delivery", budget: 250000000, spending: 80000000 },
  { id: 5, thrustId: 5, thrustTitle: "Smart and Efficient Asset Management", budget: 220000000, spending: 55000000 },
  { id: 6, thrustId: 6, thrustTitle: "Innovation and Technology Integration", budget: 180000000, spending: 75000000 },
  { id: 7, thrustId: 7, thrustTitle: "Social Responsibility and Inclusion", budget: 150000000, spending: 35000000 },
  { id: 8, thrustId: 8, thrustTitle: "Stakeholder Engagement and Public Confidence", budget: 100000000, spending: 25000000 },
  { id: 9, thrustId: 9, thrustTitle: "Workforce Development and Competency Building", budget: 120000000, spending: 30000000 },
  { id: 10, thrustId: 10, thrustTitle: "Governance and Ethical Practices", budget: 130000000, spending: 40000000 },
  { id: 11, thrustId: 11, thrustTitle: "Financial and Resource Optimization", budget: 250000000, spending: 70000000 },
  { id: 12, thrustId: 12, thrustTitle: "Knowledge Sharing and Global Benchmarking", budget: 200000000, spending: 55000000 },
];
