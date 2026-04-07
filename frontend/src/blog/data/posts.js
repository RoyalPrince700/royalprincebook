export const blogPosts = [
  {
    id: 'becoming-a-corps-camp-director-my-nysc-experience-and-tips-to-get-you-there',
    slug: 'becoming-a-corps-camp-director-my-nysc-experience-and-tips-to-get-you-there',
    title: 'Becoming a Corps Camp Director: My NYSC Experience and Tips to Get You There',
    category: 'NYSC Leadership',
    author: 'RoyalPrince',
    publishedAt: '2026-04-07',
    readTime: '5 min read',
    excerpt:
      'Serving as a Corps Camp Director during NYSC orientation camp was one of the most demanding and rewarding leadership experiences of my service year. Here is the introduction to that journey and the lessons it taught me.',
    intro:
      "As a Corps Camp Director (CCD), I had the privilege of serving in the highest administrative position as a corps member during my NYSC orientation camp. It was a challenging yet rewarding experience that taught me valuable leadership skills and allowed me to make a lasting impact. If you're aiming for this esteemed role, I'd love to share my insights and tips on how to become a Corps Camp Director and make the most of your three weeks in camp.",
    sections: [
      {
        heading: 'Introduction',
        paragraphs: [
          "As a Corps Camp Director (CCD), I had the privilege of serving in the highest administrative position as a corps member during my NYSC orientation camp. It was a challenging yet rewarding experience that taught me valuable leadership skills and allowed me to make a lasting impact. If you're aiming for this esteemed role, I'd love to share my insights and tips on how to become a Corps Camp Director and make the most of your three weeks in camp."
        ]
      },
      {
        heading: 'Why This Story Matters',
        paragraphs: [
          'The role of CCD goes beyond wearing a title. It requires discipline, visibility, emotional intelligence, and the ability to work with both camp officials and fellow corps members under pressure.',
          'This post is now set up as a reusable frontend blog template, so more sections, stories, and practical tips can be added easily without backend work.'
        ]
      }
    ]
  }
];

export const getBlogPostBySlug = (slug) =>
  blogPosts.find((post) => post.slug === slug);
