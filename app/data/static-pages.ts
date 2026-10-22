import type { StaticPageSlug } from '#shared/tools'

export interface StaticPageSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface StaticPageContent {
  title: string
  description: string
  updated: string
  sections: StaticPageSection[]
}

export const staticPages: Record<StaticPageSlug, StaticPageContent> = {
  about: {
    title: 'About NivoKit',
    description: 'NivoKit is a privacy-minded collection of focused browser utilities designed to remove friction from everyday tasks.',
    updated: '22 October 2026',
    sections: [
      {
        heading: 'Why we are building it',
        paragraphs: ['Small file and data tasks should not require an account, a complicated workflow, or unclear data handling. NivoKit aims to put the useful action first and explain its limits plainly.'],
      },
      {
        heading: 'Current scope',
        paragraphs: ['This Phase 1 release contains one complete image resizing tool. Other tools will appear only after their processing, error handling, accessibility, and tests are complete.'],
      },
      {
        heading: 'Working brand',
        paragraphs: ['NivoKit is a working product name. Domain, trademark, and social-handle clearance must be completed before a public launch.'],
      },
    ],
  },
  privacy: {
    title: 'Privacy',
    description: 'How this early NivoKit release handles files, local storage, and third-party services.',
    updated: '22 October 2026',
    sections: [
      {
        heading: 'File processing',
        paragraphs: ['The image resizer processes selected files in your browser. It does not upload them to a NivoKit server. Image data remains in volatile browser memory and is released when replaced or when the page closes.'],
      },
      {
        heading: 'Local preferences',
        paragraphs: ['The site stores your light or dark theme preference in local storage. This release does not use accounts, advertising, analytics, tracking pixels, or marketing cookies.'],
      },
      {
        heading: 'Hosting and dependencies',
        paragraphs: ['A production host may receive standard network metadata such as IP address, request time, and requested URL. Hosting terms and a verified operator identity must be added before public deployment.'],
      },
    ],
  },
  terms: {
    title: 'Terms',
    description: 'Plain-language conditions for this pre-release NivoKit software.',
    updated: '22 October 2026',
    sections: [
      {
        heading: 'Pre-release software',
        paragraphs: ['NivoKit is currently development software provided for evaluation. Check downloaded results before relying on them, and keep an original copy of important files.'],
      },
      {
        heading: 'Acceptable use',
        paragraphs: ['Use the tools only with files and material you are authorized to process. Do not use the service to violate applicable law or third-party rights.'],
      },
      {
        heading: 'Deployment blocker',
        paragraphs: ['Verified operator identity, jurisdiction, contact information, and final legal review are required before public launch. This page intentionally does not invent those details.'],
      },
    ],
  },
  contact: {
    title: 'Contact',
    description: 'How to reach the NivoKit project during development.',
    updated: '22 October 2026',
    sections: [
      {
        heading: 'Development contact',
        paragraphs: ['A public support address has not been verified yet. During development, use the repository issue tracker or the project channel through which you received this build.'],
      },
      {
        heading: 'Before launch',
        paragraphs: ['Add a monitored support email and verified operator details before publishing this site. No fictitious address is shown here.'],
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    description: 'NivoKit’s current accessibility approach and how to report barriers.',
    updated: '22 October 2026',
    sections: [
      {
        heading: 'Our approach',
        paragraphs: ['NivoKit is designed for keyboard operation, visible focus, readable contrast, clear labels, reduced-motion preferences, and screen-reader status updates. The target is WCAG 2.2 AA-minded implementation, not an unsupported certification claim.'],
      },
      {
        heading: 'Known work',
        paragraphs: ['Formal assistive-technology testing and an independent accessibility review remain release tasks. Report a barrier through the repository issue tracker while the permanent support channel is being established.'],
      },
    ],
  },
}
