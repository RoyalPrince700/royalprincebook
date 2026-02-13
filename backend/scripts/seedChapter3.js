const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');

const chapter3Data = {
  pageNumber: 3,
  title: "Chapter 3: Discipline: My Non-Negotiable",
  rawContent: `
<h1>Chapter 3: Discipline: My Non-Negotiable</h1>

<blockquote>"Discipline is the bridge between goals and accomplishment." — Jim Rohn</blockquote>

<p>I have established that leadership begins with self-leadership, and self-leadership begins with a shift in mindset. But mindset alone is not enough. You can have the right mindset, you can have the vision, you can have the hunger—but without the engine to drive you there, you will remain stagnant.</p>

<p>That engine is <strong>Discipline</strong>.</p>

<p>Discipline cannot be overemphasized. It is the ingredient that separates the dreamers from the achievers. It is the ability to do what you must do, when you must do it, whether you feel like it or not.</p>

<p>Greatness comes with a lot of "boring stuff." We look at Olympic medalists and admire their glory on the podium. We see the seconds of triumph, but we do not see the years of waking up at 4:00 AM to train when their bodies were screaming for rest. Those silent moments of training require discipline because the result is not evident in the moment. There is no applause. There is no audience. It is just you and the work.</p>

<h2>The Rubik's Cube Challenge: The Boredom of Mastery</h2>

<p>I remember when I decided to learn how to solve a Rubik's Cube. I found a tutorial online and started learning. Within an hour or so, I could solve it—but it took me a long time. Then I saw videos of people solving it in under 30 seconds, sometimes even 10 seconds. I was mesmerized.</p>

<p>I told myself, <em>"I need to learn how to do that."</em></p>

<p>I researched what it would take. I found that speed-cubing required learning complex algorithms—sets of moves that you must memorize and execute instantly. It required learning the Cross, F2L (First Two Layers), OLL (Orientation of the Last Layer), and PLL (Permutation of the Last Layer). It wasn't something you could pick up in a day. It required consistent practice for months.</p>

<p>So, I made a commitment. For nine months, I dedicated a minimum of five hours every day to this craft.</p>

<p>This is where discipline comes in. It wasn't exciting every day. In fact, most days it was incredibly boring. I was just turning a plastic cube over and over again, memorizing patterns. There was no immediate reward. I wasn't getting paid. I wasn't winning awards yet. I was just sitting in my room, twisting a cube.</p>

<p>Some days, I was tired. Some days, I just didn't want to do it. But discipline is that voice that pushes you off the bed, away from social media, and back to the task. I told myself, <em>"I must just solve it."</em></p>

<p>After nine months of rigorous, boring, repetitive practice, I mastered it. Now, when I pick up a Rubik's Cube in public and solve it in seconds, people look at me like I have superpowers. They think I'm a genius from another planet. They say, <em>"Wow, how are you doing it?"</em></p>

<p>They see the magic; they didn't see the discipline. They didn't see the nine months of boring repetition. They didn't see the consistency.</p>

<h2>The Musician's Walk and The Coding President</h2>

<p>This pattern of discipline has been the backbone of every skill I have acquired. Years before the Rubik's Cube, I wanted to learn to play musical instruments—the drums and the keyboard.</p>

<p>My church was far from my house, but I was determined. Every day, from Monday to Friday, I walked that long distance to the church to practice. I played until my hands literally swelled. I did this consistently for two years. I wasn't just learning music; I was learning how to show up.</p>

<p>Later, when I became the Student Union President of the University of Ilorin, I faced a different challenge: time.</p>

<p>I was leading over 40,000 students. My schedule was packed with meetings, administrative duties, and the constant pressure of leadership. I was also writing my final year project. Most people would use that as an excuse to pause their personal development. <em>"I'm too busy,"</em> they would say.</p>

<p>But I had disciplined myself to be a learner. I wanted to learn website development. I picked up coding tutorials—some were 23 hours long. It would take me two or three months to finish a single course because I had to chip away at it in small increments.</p>

<p>Every day, amidst the chaos of the presidency, I found time to code. I was learning JavaScript. I was debugging. I was frustrated. But I kept showing up. Even after my tenure ended, I ramped it up, spending nine hours a day learning to code. Why? because I knew that success is hidden in the discipline of the daily grind.</p>

<h2>The War on Distraction</h2>

<p>You cannot talk about discipline without talking about its greatest enemy: <strong>Distraction</strong>.</p>

<p>If you are distracted, you cannot be disciplined. You might set a goal to work at 8:00 PM, but by 7:30 PM, you've started a movie or opened TikTok. Before you know it, the time is gone. Your brain is wired to seek the easy path, the path of least resistance. It loves the dopamine hit of social media and entertainment.</p>

<p>To lead yourself, you must be ruthless with distractions.</p>

<p>When I started writing this book, I knew I needed absolute focus. So, what did I do? I uninstalled Twitter. I uninstalled Instagram. These were the apps that consumed my time. I even installed Candy Crush at one point, and after two days, I realized it was a distraction, so I deleted it.</p>

<p>You have to tell yourself the truth. You know what is distracting you. Is it football? Is it a specific friend who only wants to gossip? Is it video games?</p>

<p>Identify it and <strong>remove it</strong>.</p>

<p>If your friend is the distraction, you need to have a hard conversation: <em>"I can't continue like this. I have work to do."</em> If it's an app, delete it. You have to go to war against anything that stands between you and your discipline.</p>

<h2>Rewiring Your Brain</h2>

<p>If you are naturally undisciplined, your brain is addicted to quitting when things get hard. You need to rewire it.</p>

<p>You must accept that the new path is going to be difficult. It is not going to be easy to wake up early. It is not going to be easy to study for five hours. Once you accept the difficulty, you stop being surprised by it.</p>

<p>Then, you must force yourself. You have to literally drag your body to do the work. You tell yourself, <em>"I am supposed to be doing this, and I will do it."</em></p>

<p>Use the power of visualization to help you. When I was learning to code, I wasn't just looking at lines of text; I was picturing the result. I saw myself as a full-stack developer. I saw the projects I would build. I saw the income I would earn—300k, 400k per project. That image of the future pulled me through the boredom of the present.</p>

<h2>Conclusion</h2>

<p>Discipline is doing the right thing, at the right time, whether you feel like it or not. It is the ability to give up immediate pleasure for a long-term gain.</p>

<p>My election victory, my skills, my businesses—none of them were accidents. They were the result of showing up every day when no one was watching. If you want to lead others, you must first prove that you can lead yourself to do the work that matters.</p>

<p>Start today. Pick the hard thing. And do it.</p>

<hr />

<h3>🚀 Action Points</h3>

<ol>
<li><strong>The Distraction Audit:</strong> Identify your top three distractions (apps, habits, or people). Choose one and eliminate it completely for the next 7 days. Delete the app. Block the site. Say "no" to the hang-out.</li>
<li><strong>The "Boring Hour":</strong> Identify a skill or task you need to master but have been avoiding because it is tedious. Commit to spending one uninterrupted hour on it every day this week. No phone, no music, just the work.</li>
<li><strong>Visualize the Reward:</strong> Whenever you feel like quitting, stop and close your eyes. Spend two minutes visualizing the specific reward of finishing the task. See the completed project, the new job, or the finished book. Let that vision fuel your discipline.</li>
</ol>
  `,
  formattedContent: `
<h1>Chapter 3: Discipline: My Non-Negotiable</h1>

<blockquote>"Discipline is the bridge between goals and accomplishment." — Jim Rohn</blockquote>

<p>I have established that leadership begins with self-leadership, and self-leadership begins with a shift in mindset. But mindset alone is not enough. You can have the right mindset, you can have the vision, you can have the hunger—but without the engine to drive you there, you will remain stagnant.</p>

<p>That engine is <strong>Discipline</strong>.</p>

<p>Discipline cannot be overemphasized. It is the ingredient that separates the dreamers from the achievers. It is the ability to do what you must do, when you must do it, whether you feel like it or not.</p>

<p>Greatness comes with a lot of "boring stuff." We look at Olympic medalists and admire their glory on the podium. We see the seconds of triumph, but we do not see the years of waking up at 4:00 AM to train when their bodies were screaming for rest. Those silent moments of training require discipline because the result is not evident in the moment. There is no applause. There is no audience. It is just you and the work.</p>

<h2>The Rubik's Cube Challenge: The Boredom of Mastery</h2>

<p>I remember when I decided to learn how to solve a Rubik's Cube. I found a tutorial online and started learning. Within an hour or so, I could solve it—but it took me a long time. Then I saw videos of people solving it in under 30 seconds, sometimes even 10 seconds. I was mesmerized.</p>

<p>I told myself, <em>"I need to learn how to do that."</em></p>

<p>I researched what it would take. I found that speed-cubing required learning complex algorithms—sets of moves that you must memorize and execute instantly. It required learning the Cross, F2L (First Two Layers), OLL (Orientation of the Last Layer), and PLL (Permutation of the Last Layer). It wasn't something you could pick up in a day. It required consistent practice for months.</p>

<p>So, I made a commitment. For nine months, I dedicated a minimum of five hours every day to this craft.</p>

<p>This is where discipline comes in. It wasn't exciting every day. In fact, most days it was incredibly boring. I was just turning a plastic cube over and over again, memorizing patterns. There was no immediate reward. I wasn't getting paid. I wasn't winning awards yet. I was just sitting in my room, twisting a cube.</p>

<p>Some days, I was tired. Some days, I just didn't want to do it. But discipline is that voice that pushes you off the bed, away from social media, and back to the task. I told myself, <em>"I must just solve it."</em></p>

<p>After nine months of rigorous, boring, repetitive practice, I mastered it. Now, when I pick up a Rubik's Cube in public and solve it in seconds, people look at me like I have superpowers. They think I'm a genius from another planet. They say, <em>"Wow, how are you doing it?"</em></p>

<p>They see the magic; they didn't see the discipline. They didn't see the nine months of boring repetition. They didn't see the consistency.</p>

<h2>The Musician's Walk and The Coding President</h2>

<p>This pattern of discipline has been the backbone of every skill I have acquired. Years before the Rubik's Cube, I wanted to learn to play musical instruments—the drums and the keyboard.</p>

<p>My church was far from my house, but I was determined. Every day, from Monday to Friday, I walked that long distance to the church to practice. I played until my hands literally swelled. I did this consistently for two years. I wasn't just learning music; I was learning how to show up.</p>

<p>Later, when I became the Student Union President of the University of Ilorin, I faced a different challenge: time.</p>

<p>I was leading over 40,000 students. My schedule was packed with meetings, administrative duties, and the constant pressure of leadership. I was also writing my final year project. Most people would use that as an excuse to pause their personal development. <em>"I'm too busy,"</em> they would say.</p>

<p>But I had disciplined myself to be a learner. I wanted to learn website development. I picked up coding tutorials—some were 23 hours long. It would take me two or three months to finish a single course because I had to chip away at it in small increments.</p>

<p>Every day, amidst the chaos of the presidency, I found time to code. I was learning JavaScript. I was debugging. I was frustrated. But I kept showing up. Even after my tenure ended, I ramped it up, spending nine hours a day learning to code. Why? because I knew that success is hidden in the discipline of the daily grind.</p>

<h2>The War on Distraction</h2>

<p>You cannot talk about discipline without talking about its greatest enemy: <strong>Distraction</strong>.</p>

<p>If you are distracted, you cannot be disciplined. You might set a goal to work at 8:00 PM, but by 7:30 PM, you've started a movie or opened TikTok. Before you know it, the time is gone. Your brain is wired to seek the easy path, the path of least resistance. It loves the dopamine hit of social media and entertainment.</p>

<p>To lead yourself, you must be ruthless with distractions.</p>

<p>When I started writing this book, I knew I needed absolute focus. So, what did I do? I uninstalled Twitter. I uninstalled Instagram. These were the apps that consumed my time. I even installed Candy Crush at one point, and after two days, I realized it was a distraction, so I deleted it.</p>

<p>You have to tell yourself the truth. You know what is distracting you. Is it football? Is it a specific friend who only wants to gossip? Is it video games?</p>

<p>Identify it and <strong>remove it</strong>.</p>

<p>If your friend is the distraction, you need to have a hard conversation: <em>"I can't continue like this. I have work to do."</em> If it's an app, delete it. You have to go to war against anything that stands between you and your discipline.</p>

<h2>Rewiring Your Brain</h2>

<p>If you are naturally undisciplined, your brain is addicted to quitting when things get hard. You need to rewire it.</p>

<p>You must accept that the new path is going to be difficult. It is not going to be easy to wake up early. It is not going to be easy to study for five hours. Once you accept the difficulty, you stop being surprised by it.</p>

<p>Then, you must force yourself. You have to literally drag your body to do the work. You tell yourself, <em>"I am supposed to be doing this, and I will do it."</em></p>

<p>Use the power of visualization to help you. When I was learning to code, I wasn't just looking at lines of text; I was picturing the result. I saw myself as a full-stack developer. I saw the projects I would build. I saw the income I would earn—300k, 400k per project. That image of the future pulled me through the boredom of the present.</p>

<h2>Conclusion</h2>

<p>Discipline is doing the right thing, at the right time, whether you feel like it or not. It is the ability to give up immediate pleasure for a long-term gain.</p>

<p>My election victory, my skills, my businesses—none of them were accidents. They were the result of showing up every day when no one was watching. If you want to lead others, you must first prove that you can lead yourself to do the work that matters.</p>

<p>Start today. Pick the hard thing. And do it.</p>

<hr />

<h3>🚀 Action Points</h3>

<ol>
<li><strong>The Distraction Audit:</strong> Identify your top three distractions (apps, habits, or people). Choose one and eliminate it completely for the next 7 days. Delete the app. Block the site. Say "no" to the hang-out.</li>
<li><strong>The "Boring Hour":</strong> Identify a skill or task you need to master but have been avoiding because it is tedious. Commit to spending one uninterrupted hour on it every day this week. No phone, no music, just the work.</li>
<li><strong>Visualize the Reward:</strong> Whenever you feel like quitting, stop and close your eyes. Spend two minutes visualizing the specific reward of finishing the task. See the completed project, the new job, or the finished book. Let that vision fuel your discipline.</li>
</ol>
  `
};

// Simple word count helper
const countWords = (str) => {
  return str.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
};

const seedChapter3 = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const bookTitle = "Leading from Within: Mastering Self to Impact Others";
    const book = await Book.findOne({ title: bookTitle });

    if (!book) {
      console.error('Book not found! Please run the main seed script first.');
      process.exit(1);
    }

    // Find if chapter 3 exists
    const chapterIndex = book.pages.findIndex(p => p.pageNumber === 3);

    if (chapterIndex !== -1) {
      console.log('Updating Chapter 3...');
      // Update individual properties of the subdocument
      const page = book.pages[chapterIndex];
      page.title = chapter3Data.title;
      page.rawContent = chapter3Data.rawContent;
      page.formattedContent = chapter3Data.formattedContent;
      page.status = "draft";
      page.wordCount = countWords(chapter3Data.rawContent);
      
      // Explicitly mark the pages array as modified
      book.markModified('pages');
    } else {
      console.log('Chapter 3 not found in pages array. Adding it...');
      book.pages.push({
          ...chapter3Data,
          status: "draft",
          wordCount: countWords(chapter3Data.rawContent)
      });
      // Sort pages by pageNumber to keep order
      book.pages.sort((a, b) => a.pageNumber - b.pageNumber);
      book.markModified('pages');
    }

    const result = await book.save();
    console.log('Chapter 3 updated successfully!');
    console.log('New word count for Chapter 3:', result.pages.find(p => p.pageNumber === 3).wordCount);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Chapter 3:', error);
    process.exit(1);
  }
};

seedChapter3();
