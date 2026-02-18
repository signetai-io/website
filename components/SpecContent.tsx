
import { PART_1 } from './specs/SpecPart1';
import { PART_2 } from './specs/SpecPart2';
import { PART_3 } from './specs/SpecPart3';

// Explicit concatenation to ensure type safety and avoid parser issues with trailing commas in spread
const allPages = [];
allPages.push(...PART_1);
allPages.push(...PART_2);
allPages.push(...PART_3);

export const SPEC_PAGES = allPages;
