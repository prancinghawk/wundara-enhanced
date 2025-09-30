import React, {ReactNode} from "react";

export interface FadeInProps {
    children: React.ReactNode;
    duration?: number;
    maxTranslate?: number;
    trigger?: number;
}

export interface SlideInProps {
    children: React.ReactNode;
    duration?: number;
    maxTranslate?: number;
    trigger?: number;
}
export interface MoveProps {
    children?: ReactNode;
    duration?: number;
    radius?: number;
    reverse?: boolean;
}
export interface ScaleUpProps {
    children: React.ReactNode;
    duration?: number;
    initialSize?: number;
    maxTranslate?: number;
    trigger?: number;
}

export interface TiltMouseProps {
    children: React.ReactNode;
    duration?: number;
    perspective?: number;
}

export interface TiltProps {
    children: React.ReactNode;
    duration?: number;
    offset?: number;
    perspective?: number;
    distanceTop?: number;
}
