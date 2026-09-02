import aiBlogImg from '../../assets/aiblog.png';
import leadershipBlogImg from '../../assets/leadershipblog.png';
import disciplineBlogImg from '../../assets/discipline.png';
import planBlogImg from '../../assets/planblog.png';

export const blogPostImages = {
  'two-day-build-with-ai-workshop-this-weekend': aiBlogImg,
  'lead-yourself-before-the-world-calls-your-name': leadershipBlogImg,
  'mindset-first-why-discipline-finally-follows': disciplineBlogImg,
  'your-plan-needs-a-visible-move-not-another-meeting-with-yourself': planBlogImg,
  'becoming-a-corps-camp-director-my-nysc-experience-and-tips-to-get-you-there':
    leadershipBlogImg
};

export const getBlogPostImage = (slug) => blogPostImages[slug] || leadershipBlogImg;
