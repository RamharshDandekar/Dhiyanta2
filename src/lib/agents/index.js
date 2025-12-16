/**
 * Agent Index - Central export point for all agents
 * Makes imports cleaner: import { salesAgent, technicalAgent } from '@/lib/agents'
 */

export { salesAgent } from './salesAgent';
export { technicalAgent } from './technicalAgent';
export { pricingAgent } from './pricingAgent';
export { orchestratorAgent } from './orchestratorAgent';
export { revisionAgent } from './revisionAgent';
export { documentGenerationAgent } from './documentGenerationAgent';
