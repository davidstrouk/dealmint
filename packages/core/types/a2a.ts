/**
 * A2A (Agent-to-Agent) Protocol Types
 * Based on the A2A open standard for agent interoperability
 */

export interface AgentCard {
  name: string;
  description?: string;
  capabilities: string[];
  version: string;
  endpoint?: string;
}

export interface A2AMessage {
  timestamp: string;
  from: string;
  to: string;
  type: MessageType;
  content: MessageContent;
}

export type MessageType =
  | "offer"
  | "counter-offer"
  | "accept"
  | "reject"
  | "negotiate"
  | "query"
  | "response";

export interface MessageContent {
  message: string;
  amount?: number;
  proposedAmount?: number;
  finalAmount?: number;
  discount?: number;
  terms?: Record<string, any>;
}

export interface A2ATranscript {
  protocol: "A2A";
  version: string;
  messages: A2AMessage[];
  participants?: {
    seller: AgentCard;
    buyer: AgentCard;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
}
