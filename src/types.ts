// types.ts
export interface StatCardProps {
    number: string;
    label: string;
}

export interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    languages?: string[];
    categories?: string[];
    features?: string[];
    rankings?: string[];
}