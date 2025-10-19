// src/types/index.ts

// Core TypeScript type definitions

export interface Report {
    id: string;
    title: string;
    sections: ReportSection[];
}

export interface ReportItem {
    id: string;
    title: string;
    content: string;
}

export interface ReportSection {
    id: string;
    title: string;
    items: ReportItem[];
}

export interface PropertyDefinition {
    key: string;
    value: string;
}

export interface Plugin {
    name: string;
    version: string;
    initialize: () => void;
}