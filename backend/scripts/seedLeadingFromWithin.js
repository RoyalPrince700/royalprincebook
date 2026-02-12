const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Book = require('../models/Book');
const User = require('../models/User');

const bookData = {
  title: "Leading from Within: Mastering Self to Impact Others",
  description: "A guide on how mastering self-leadership is the foundation for leading others and achieving success.",
  genre: "Leadership / Self-Development",
  status: "published",
  coverImage: "https://placehold.co/300x450/e9ecef/333333?text=Leading+from+Within",
  pages: [
    {
      pageNumber: 1,
      title: "Chapter 1: The Mindset Shift",
      rawContent: `
<h1>Chapter 1: The Mindset Shift</h1>

<blockquote>"The greatest discovery of my generation is that a human being can alter his life by altering his attitudes." — William James</blockquote>

<p>I became the 36th Student Union President of the University of Ilorin, leading a student body of over 40,000 individuals. Prior to that peak, I served as the Student Union General Secretary in my third year. In my second year, I was the Librarian for the Faculty of Agriculture, representing over 5,000 students. Even as a freshman in 100 level, I served as an Honourable Representative for my department.</p>

<p>To an outside observer, my leadership journey might look like a perfectly calculated ascent through the university ranks—a straight line of victories. But looking back, I know the truth. My leadership journey didn't start with an election victory. It didn't start when I arrived on campus. It didn't start with a title.</p>

<p>It started years earlier, in a single room I shared with my mother and sister, with a quiet but radical decision to be different.</p>

<h2>The Origin of Hunger</h2>

<p>I did not come from a wealthy background. At the time my journey began, my mother was earning about forty to forty-five thousand Naira a month. That was our reality. We lived in a single room, and resources were so tight that my admission to the university had to be delayed; the family needed my elder sister to graduate before they could afford to send me.</p>

<p>I remember sitting at home after secondary school, stuck in that waiting period. I looked at our situation—the limitations, the struggle—and I knew with absolute clarity: <strong>I cannot continue like this.</strong></p>

<p>In church, I saw families who were comfortable. I saw people living the kind of life I wished we had. At sixteen or seventeen, my definition of success was simple and material: I wanted to build my own house. I wanted to drive my own car. I wanted to live well. It was a limited view, shaped by my lack of exposure, but it was a powerful fuel.</p>

<p>I told myself, <em>"I have to do all it takes to be successful."</em></p>

<p>That phrase became the bedrock of my existence. I realized that because of my background, I didn't have the luxury of chance. If I wanted a different life, <em>I</em> had to be different. It wouldn't be handed to me on a platter of gold.</p>

<h2>The Awakening: Leading Yourself First</h2>

<p>Many people assume leadership is about directing others—standing in front of a crowd and giving orders. They neglect the foundational truth that <strong>true leadership begins with leading yourself.</strong></p>

<p>Before I could lead 40,000 students, I had to learn to lead one person: myself.</p>

<p>This self-leadership started with a shift in mindset. I began to picture a future that didn't exist yet. I didn't know the "how," but I knew the "what." I constantly affirmed to myself that my future would be bright. This wasn't just wishful thinking; it was a mental restructuring. I was training my mind to see possibilities where others saw dead ends.</p>

<p>My close friend and former roommate, Adeyemi Favour, recalls this period vividly:</p>

<blockquote>"One of the most defining aspects of Royal’s life is that he acts like the person he wants to become... If Royal aspired to become a president, for example, he would begin painting the picture for us—how he would walk, the kind of clothes he would wear, the people he would meet, and the rooms he would enter... He spoke first, acted next, and followed through relentlessly."</blockquote>

<p>I wasn't just dreaming; I was rehearsing. I was living in the future I wanted to create before it arrived.</p>

<h3>The Spoken Word Challenge</h3>

<p>One of the most critical moments in this transformation happened when I was scrolling online and saw a flyer for a talent competition. It promised a cash prize for singing, dancing, or spoken word poetry.</p>

<p>I had never faced an audience in my life. I had never written a poem to perform. I had never spoken publicly. But I saw that flyer, and something in me clicked.</p>

<p>I said to myself, <em>"I can do spoken words. Let me give this a trial."</em></p>

<p>The competition was massive, drawing participants from major cities like Lagos, Ibadan, and Akure. And there I was, in my small town, telling myself I could compete with them.</p>

<p>I went for the competition. The result? I didn't even pass the audition stage.</p>

<p>But here is the lesson: the victory wasn't in the prize money. The victory was in the audacity of the attempt. The moment I said, <em>"I can go, I can do this,"</em> something shifted. That thought pushed me to step out of my comfort zone. I realized that once I made up my mind to do something, my body and actions would align to make it happen. I had proven to myself that I could take action.</p>

<h2>The Discipline of Passion</h2>

<p>This new mindset—this hunger for success—began to bleed into everything I did. I decided that if I was going to be successful, I had to put my entire being into whatever task was in front of me, no matter how small.</p>

<p>I started attending a new church and noticed they didn't have a conga drummer. I had played in my former church—played so well that people would put money in my pockets and celebrate me. So, I volunteered.</p>

<p>I didn't just play; I attacked the drums. I played with such energy and strength that my hands would literally swell after the service. I played as if my life depended on it.</p>

<p>People in the church started asking, <em>"Who is this new boy playing so passionately?"</em></p>

<p>I wasn't playing for the applause. I was practicing success. I started going to the church every day, Monday to Friday, just to practice. I believed that this discipline, this consistency, and this passion were the raw ingredients of the success I craved. I was building the muscles of a leader before I had a team to lead.</p>

<p>This disciplined approach to growth didn't just affect my skills; it shifted the perspectives of those around me. Another close associate, Phoenix, who is now the Student Union Senate President of the University of Ilorin, shared how this mindset impacted him when we first met:</p>

<blockquote>"When you approached me to be different, I only saw an avenue to do better... Seeing my potential, when I started tutoring, initially when you challenged me to, I saw it as a big task and not achievable. After the first case, I was like, 'So I could do this?' And boom, I knew there was more... I had to sit down, tear the book of play, and say I was going to make a positive influence on this campus."</blockquote>

<p>Leadership, I learned, is contagious. When you lead yourself with excellence, you implicitly challenge everyone around you to rise to your level.</p>

<h2>The Blueprint: Exposure and Preparation</h2>

<p>This drive followed me as I prepared for university. While waiting for my admission, I stayed with my elder sister who was a student at the Federal University of Agriculture, Abeokuta (FUNAAB).</p>

<p>This period was my training ground. My sister was a Class Representative, and she would come home and share stories of her responsibilities. I admired that. I thought, <em>"I want to hold that kind of position."</em></p>

<p>Then, a friend of hers contested for Faculty President. I watched the drama unfold from the sidelines—the campaigns, the rallies, the political maneuvering, the petitions, and the disqualifications. It was intense, and to many, it might have been discouraging. But to me? It was fascinating.</p>

<p>I told myself, <em>"When I gain admission, I'm going to do this. I'm going to go into student politics."</em></p>

<p>By the time I eventually entered the University of Ilorin, I wasn't just a confused freshman. I was a young man with a plan. My mind was already prepared. I had seen the landscape. I had built the discipline. I had cultivated the hunger.</p>

<p>This preparation didn't just affect me; it created a ripple effect. As my roommate Adeyemi noted:</p>

<blockquote>"Living around Royal’s leadership pushed both Johnson and me into leadership roles ourselves. In my 400-level days, I became the class representative, while Johnson became the General Secretary of his department. His excellence in leadership rubbed off on us naturally... Being around him made leadership feel normal, attainable, and expected."</blockquote>

<p>My girlfriend, Oladipo Favour, who has witnessed my journey from that early ambition to my presidency, reflects on how this foundational mindset has remained a constant force, not just in politics, but in our personal lives:</p>

<blockquote>"One thing that wowed me about your mindset was how straightforward you were... You knew what you wanted and went for it. And another thing that impressed me was how you made time for our relationship despite your busy schedule... That says a lot about your priorities and mindset. You have this mindset where, as long as you think you're doing what's right, nobody can change your mind... It's definitely consistent – then and now."</blockquote>

<p>This consistency—whether in pursuing a position or a partner—is the hallmark of self-leadership. It means knowing what you want, going for it without hesitation, and making the time to nurture it.</p>

<h2>Conclusion: Mindset Over Discipline</h2>

<p>My success as a Student Union President was not an accident. It was the result of a mindset that had been cultivated years prior in a single room with a struggling mother.</p>

<p>Many believe that discipline is the first step to leadership, but I disagree. <strong>Leadership starts with mindset.</strong></p>

<p>Discipline is the engine, but mindset is the steering wheel. You can be disciplined about the wrong things, or disciplined without direction. But when your mindset shifts—when you truly <em>believe</em> you are capable of more, when you <em>see</em> yourself as a leader before anyone else does—discipline becomes a natural byproduct.</p>

<p>I didn't start practicing the drums every day because I forced myself to be disciplined; I did it because my mindset had shifted to one of excellence. I didn't step into student politics because I wanted a title; I did it because my mind had already accepted the responsibility of leadership.</p>

<p>If you take nothing else from this chapter, take this: <strong>No man who cannot put his own mind in order can put the lives of others in order.</strong></p>

<p>It starts with the thought. It starts with the belief. It starts with the decision to be different.</p>

<p>If you want to lead, you must first answer the call to change your mind.</p>

<hr />

<h3>🚀 Action Points</h3>

<ol>
<li><strong>Define Your Success:</strong> Take a moment to write down what "success" looks like to you right now. Be honest. Is it material? Is it impact? There is no wrong answer, but you must have a target.</li>
<li><strong>Identify Your "Conga Drum":</strong> What is one small thing you are currently doing—a job, a chore, a class—that you can choose to do with "presidential" passion this week? Commit to doing it with excellence, not for the reward, but for the discipline.</li>
<li><strong>The Mindset Check:</strong> Close your eyes and picture the future you want. Do you truly believe it is possible? If you don't believe it, you cannot build it. Spend five minutes today visualizing your future self.</li>
</ol>
`,
      formattedContent: `
<h1>Chapter 1: The Mindset Shift</h1>

<blockquote>"The greatest discovery of my generation is that a human being can alter his life by altering his attitudes." — William James</blockquote>

<p>I became the 36th Student Union President of the University of Ilorin, leading a student body of over 40,000 individuals. Prior to that peak, I served as the Student Union General Secretary in my third year. In my second year, I was the Librarian for the Faculty of Agriculture, representing over 5,000 students. Even as a freshman in 100 level, I served as an Honourable Representative for my department.</p>

<p>To an outside observer, my leadership journey might look like a perfectly calculated ascent through the university ranks—a straight line of victories. But looking back, I know the truth. My leadership journey didn't start with an election victory. It didn't start when I arrived on campus. It didn't start with a title.</p>

<p>It started years earlier, in a single room I shared with my mother and sister, with a quiet but radical decision to be different.</p>

<h2>The Origin of Hunger</h2>

<p>I did not come from a wealthy background. At the time my journey began, my mother was earning about forty to forty-five thousand Naira a month. That was our reality. We lived in a single room, and resources were so tight that my admission to the university had to be delayed; the family needed my elder sister to graduate before they could afford to send me.</p>

<p>I remember sitting at home after secondary school, stuck in that waiting period. I looked at our situation—the limitations, the struggle—and I knew with absolute clarity: <strong>I cannot continue like this.</strong></p>

<p>In church, I saw families who were comfortable. I saw people living the kind of life I wished we had. At sixteen or seventeen, my definition of success was simple and material: I wanted to build my own house. I wanted to drive my own car. I wanted to live well. It was a limited view, shaped by my lack of exposure, but it was a powerful fuel.</p>

<p>I told myself, <em>"I have to do all it takes to be successful."</em></p>

<p>That phrase became the bedrock of my existence. I realized that because of my background, I didn't have the luxury of chance. If I wanted a different life, <em>I</em> had to be different. It wouldn't be handed to me on a platter of gold.</p>

<h2>The Awakening: Leading Yourself First</h2>

<p>Many people assume leadership is about directing others—standing in front of a crowd and giving orders. They neglect the foundational truth that <strong>true leadership begins with leading yourself.</strong></p>

<p>Before I could lead 40,000 students, I had to learn to lead one person: myself.</p>

<p>This self-leadership started with a shift in mindset. I began to picture a future that didn't exist yet. I didn't know the "how," but I knew the "what." I constantly affirmed to myself that my future would be bright. This wasn't just wishful thinking; it was a mental restructuring. I was training my mind to see possibilities where others saw dead ends.</p>

<p>My close friend and former roommate, Adeyemi Favour, recalls this period vividly:</p>

<blockquote>"One of the most defining aspects of Royal’s life is that he acts like the person he wants to become... If Royal aspired to become a president, for example, he would begin painting the picture for us—how he would walk, the kind of clothes he would wear, the people he would meet, and the rooms he would enter... He spoke first, acted next, and followed through relentlessly."</blockquote>

<p>I wasn't just dreaming; I was rehearsing. I was living in the future I wanted to create before it arrived.</p>

<h3>The Spoken Word Challenge</h3>

<p>One of the most critical moments in this transformation happened when I was scrolling online and saw a flyer for a talent competition. It promised a cash prize for singing, dancing, or spoken word poetry.</p>

<p>I had never faced an audience in my life. I had never written a poem to perform. I had never spoken publicly. But I saw that flyer, and something in me clicked.</p>

<p>I said to myself, <em>"I can do spoken words. Let me give this a trial."</em></p>

<p>The competition was massive, drawing participants from major cities like Lagos, Ibadan, and Akure. And there I was, in my small town, telling myself I could compete with them.</p>

<p>I went for the competition. The result? I didn't even pass the audition stage.</p>

<p>But here is the lesson: the victory wasn't in the prize money. The victory was in the audacity of the attempt. The moment I said, <em>"I can go, I can do this,"</em> something shifted. That thought pushed me to step out of my comfort zone. I realized that once I made up my mind to do something, my body and actions would align to make it happen. I had proven to myself that I could take action.</p>

<h2>The Discipline of Passion</h2>

<p>This new mindset—this hunger for success—began to bleed into everything I did. I decided that if I was going to be successful, I had to put my entire being into whatever task was in front of me, no matter how small.</p>

<p>I started attending a new church and noticed they didn't have a conga drummer. I had played in my former church—played so well that people would put money in my pockets and celebrate me. So, I volunteered.</p>

<p>I didn't just play; I attacked the drums. I played with such energy and strength that my hands would literally swell after the service. I played as if my life depended on it.</p>

<p>People in the church started asking, <em>"Who is this new boy playing so passionately?"</em></p>

<p>I wasn't playing for the applause. I was practicing success. I started going to the church every day, Monday to Friday, just to practice. I believed that this discipline, this consistency, and this passion were the raw ingredients of the success I craved. I was building the muscles of a leader before I had a team to lead.</p>

<p>This disciplined approach to growth didn't just affect my skills; it shifted the perspectives of those around me. Another close associate, Phoenix, who is now the Student Union Senate President of the University of Ilorin, shared how this mindset impacted him when we first met:</p>

<blockquote>"When you approached me to be different, I only saw an avenue to do better... Seeing my potential, when I started tutoring, initially when you challenged me to, I saw it as a big task and not achievable. After the first case, I was like, 'So I could do this?' And boom, I knew there was more... I had to sit down, tear the book of play, and say I was going to make a positive influence on this campus."</blockquote>

<p>Leadership, I learned, is contagious. When you lead yourself with excellence, you implicitly challenge everyone around you to rise to your level.</p>

<h2>The Blueprint: Exposure and Preparation</h2>

<p>This drive followed me as I prepared for university. While waiting for my admission, I stayed with my elder sister who was a student at the Federal University of Agriculture, Abeokuta (FUNAAB).</p>

<p>This period was my training ground. My sister was a Class Representative, and she would come home and share stories of her responsibilities. I admired that. I thought, <em>"I want to hold that kind of position."</em></p>

<p>Then, a friend of hers contested for Faculty President. I watched the drama unfold from the sidelines—the campaigns, the rallies, the political maneuvering, the petitions, and the disqualifications. It was intense, and to many, it might have been discouraging. But to me? It was fascinating.</p>

<p>I told myself, <em>"When I gain admission, I'm going to do this. I'm going to go into student politics."</em></p>

<p>By the time I eventually entered the University of Ilorin, I wasn't just a confused freshman. I was a young man with a plan. My mind was already prepared. I had seen the landscape. I had built the discipline. I had cultivated the hunger.</p>

<p>This preparation didn't just affect me; it created a ripple effect. As my roommate Adeyemi noted:</p>

<blockquote>"Living around Royal’s leadership pushed both Johnson and me into leadership roles ourselves. In my 400-level days, I became the class representative, while Johnson became the General Secretary of his department. His excellence in leadership rubbed off on us naturally... Being around him made leadership feel normal, attainable, and expected."</blockquote>

<p>My girlfriend, Oladipo Favour, who has witnessed my journey from that early ambition to my presidency, reflects on how this foundational mindset has remained a constant force, not just in politics, but in our personal lives:</p>

<blockquote>"One thing that wowed me about your mindset was how straightforward you were... You knew what you wanted and went for it. And another thing that impressed me was how you made time for our relationship despite your busy schedule... That says a lot about your priorities and mindset. You have this mindset where, as long as you think you're doing what's right, nobody can change your mind... It's definitely consistent – then and now."</blockquote>

<p>This consistency—whether in pursuing a position or a partner—is the hallmark of self-leadership. It means knowing what you want, going for it without hesitation, and making the time to nurture it.</p>

<h2>Conclusion: Mindset Over Discipline</h2>

<p>My success as a Student Union President was not an accident. It was the result of a mindset that had been cultivated years prior in a single room with a struggling mother.</p>

<p>Many believe that discipline is the first step to leadership, but I disagree. <strong>Leadership starts with mindset.</strong></p>

<p>Discipline is the engine, but mindset is the steering wheel. You can be disciplined about the wrong things, or disciplined without direction. But when your mindset shifts—when you truly <em>believe</em> you are capable of more, when you <em>see</em> yourself as a leader before anyone else does—discipline becomes a natural byproduct.</p>

<p>I didn't start practicing the drums every day because I forced myself to be disciplined; I did it because my mindset had shifted to one of excellence. I didn't step into student politics because I wanted a title; I did it because my mind had already accepted the responsibility of leadership.</p>

<p>If you take nothing else from this chapter, take this: <strong>No man who cannot put his own mind in order can put the lives of others in order.</strong></p>

<p>It starts with the thought. It starts with the belief. It starts with the decision to be different.</p>

<p>If you want to lead, you must first answer the call to change your mind.</p>

<hr />

<h3>🚀 Action Points</h3>

<ol>
<li><strong>Define Your Success:</strong> Take a moment to write down what "success" looks like to you right now. Be honest. Is it material? Is it impact? There is no wrong answer, but you must have a target.</li>
<li><strong>Identify Your "Conga Drum":</strong> What is one small thing you are currently doing—a job, a chore, a class—that you can choose to do with "presidential" passion this week? Commit to doing it with excellence, not for the reward, but for the discipline.</li>
<li><strong>The Mindset Check:</strong> Close your eyes and picture the future you want. Do you truly believe it is possible? If you don't believe it, you cannot build it. Spend five minutes today visualizing your future self.</li>
</ol>
`,
      status: "draft"
    },
    {
      pageNumber: 2,
      title: "Chapter 2: Self-Leadership: The Foundation",
      rawContent: `
<h1>Chapter 2: Self-Leadership: The Foundation</h1>

<blockquote>"The first and greatest victory is to conquer yourself; to be conquered by yourself is of all things most shameful and vile." — Plato</blockquote>

<p>I have come to a profound realization that challenges the conventional view of authority: <strong>leadership is not solely about leading other people; leadership is, first and foremost, about leading yourself.</strong></p>

<p><strong>Self-Mastery is the Peak:</strong> Winning an Olympic gold or a war is nothing compared to getting your own mind and habits under control.</p>

<p><strong>The Ultimate Defeat:</strong> Letting your impulses, laziness, or temper run the show isn't just a "fail"—in Plato's view, it's the most "shameful" way to live because it means you've lost your freedom to your own shadows.</p>

<p>If you get this fundamental truth right, you will fully comprehend the essence of true leadership. I have searched through history and observed contemporaries, and I have found this to be an absolute law: there is no great leader of others who cannot first lead himself. It is impossible. While someone might stumble into a position of authority unconsciously, sustained greatness requires the capacity for self-mastery.</p>

<p>Why is this? Because the people you intend to lead are watching. They are not just listening to your words; they are studying your life. They are asking silent questions: <em>Is this person disciplined? Is he committed? Is he result-oriented?</em></p>

<p>Before you can direct the lives of multitudes, you must answer a simple question: <strong>Are you capable of directing your own life?</strong></p>

<h2>The Lost Cannot Lead</h2>

<p>Leading from within is not a new concept; it is the ancient prerequisite for influence. Picture it this way: imagine someone is lost in a dense forest, disoriented and panic-stricken. Then, they meet another person who is equally lost.</p>

<p>Can the second person help the first? No. A man who is lost cannot help another find his way.</p>

<p>For a leader to be a guide, he must first have navigated the path himself. He must have found his direction. Only after he has worked that path—struggled with it, understood it, and mastered it—can he turn back and say to others, "Follow me, I know the way."</p>

<p>This is the essence of leadership. It is easier to bring others along a path you have already walked. You must first discipline yourself and commit to the task. Leadership must be result-oriented, and the first result you must show is the command you have over your own actions.</p>

<h2>Leadership by Example: The Hunger Test</h2>

<p>One of the most powerful forms of leadership is <strong>Exemplary Leadership</strong>—leadership by example. It is the concept that you do not ask your team to do what you are not willing to do yourself.</p>

<p>I remember a specific incident with one of the teams I lead. We were holding a program, and it became apparent that the food provided was not enough for everyone. I had already received my share, and so had many others. But then we realized that one crucial team member had been overlooked.</p>

<p>This person was vital to the team. He had spent his own money and time traveling all the way from Lagos to Ibadan just to be there. And now, after all that sacrifice, I was being told there was no food for him?</p>

<p>I was angry. How could we miss this? But anger is not leadership; action is.</p>

<p>I immediately brought out my food and said, "Give my food to him."</p>

<p>People around me protested. "No, we won't allow you to do that. You are the leader."</p>

<p>I insisted. "Okay, if you won't allow me to give it all, take half of my food."</p>

<p>The moment I made that move—the moment I showed I was willing to go hungry for the sake of my team member—the atmosphere shifted. Other people started donating their food. "Take mine," "Take some of mine." Before we knew it, we had more than enough food for him.</p>

<p>What is the lesson here? As the leader, I spearheaded the solution. I didn't just issue a command: "Go and find food for him." I didn't delegate the problem. I took a bold step. I sacrificed. When others saw that the leader was willing to pay the price, they said, "Oh, let's follow this person."</p>

<h2>The Ripple Effect of Initiative</h2>

<p>This principle of "going first" became a habit for me. I realized that people are often waiting for permission to be generous or helpful, and the leader's action gives them that permission.</p>

<p>During my time as a student, and later as Student Union President at the University of Ilorin, I saw this play out repeatedly.</p>

<p>I recall an exam period when I was still a Faculty Librarian in my 300 level. Exam periods are notoriously difficult for students; many are broke and struggling to afford basic meals. Someone reached out to me saying they needed food.</p>

<p>I didn't have much, but I had a platform. I posted on my status that there were students in need and that I was willing to donate a certain amount of food to start the drive.</p>

<p>Immediately, the response was electric. Because I had volunteered first, another person said, "Oh, I'm interested in donating too." Then another. And another. We raised enough money to buy bags of rice, packs of spaghetti, and various foodstuffs. We ended up feeding a lot of students that season.</p>

<p>Later, as Student Union President, a similar situation occurred. Engineering students reached out on Twitter; some needed scientific calculators, others needed food. I publicly volunteered to buy some calculators and support with food.</p>

<p>Before I knew it, other student leaders and students were replying under the tweet, "I'll support with one calculator," "I'll send this amount." What started as a casual interaction snowballed into a massive community support system.</p>

<p>Why? <strong>Because I volunteered.</strong></p>

<p>You must be the one to make the move. You cannot put the responsibility on others until you have placed it squarely on yourself. That is self-leadership.</p>

<p>This standard of self-leadership—of doing the work before asking others to do it—transforms those around you. Phoenix, who is now the Student Union Senate President, reflects on how this demanding style of self-leadership influenced his own work ethic when he worked with me:</p>

<blockquote>"The tasks were getting too much at a point... But here's the drill: Royal Prince gives a task—'I need you to set 50 questions, take a class, summarize with deadlines!' He didn't compel me to do it; I wanted to. Meeting deadlines became the baseline; I don't procrastinate. I learned from Royal Prince to stop when I am done, not when I am tired. That habit of getting things done has rubbed off on all spheres of my life."</blockquote>

<p>When you lead yourself relentlessly, you give those around you a blueprint for their own excellence.</p>

<h2>Skin in the Game: The Financial Commitment</h2>

<p>The ultimate test of this self-leadership often comes down to finances. It is easy to pledge support; it is harder to pledge your own money.</p>

<p>I made it a rule: whenever my team or organization needed to raise money for a project, I would be the first to contribute.</p>

<p>I remember when I was the Director for one of my organizations. We needed to buy equipment that cost about 60,000 Naira. In a room full of people, the silence can be deafening when a figure like that is mentioned.</p>

<p>I broke the silence. "I am dropping this specific amount," I said, mentioning a significant portion.</p>

<p>The dynamic changed instantly. Everyone looked at me, saw the seriousness, and started chipping in. We raised the complete sum that very day.</p>

<p>This strategy proved itself again during my NYSC (National Youth Service Corps) at the Iseyin camp. The University of Ilorin alumni were known for making contributions, and at that time, a hall was being built for the camp. I looked at the project and told my fellow alumni, "This project is big. Our population here is large. We must do something."</p>

<p>I set a target: 100,000 Naira.</p>

<p>I gathered a few friends and told them the vision. But I didn't just sell the vision; I sold my commitment. "We are going to contribute at least 100,000 Naira," I said, "and <strong>I am dropping 20,000 Naira instantly.</strong>"</p>

<p>I sent the money immediately.</p>

<p>That action made the vision visible. It made it realistic. If I had just said, "Hey everyone, let's start contributing," without defining my own stake, doubt would have crept in. They would have wondered if the goal was achievable. But because I took the first step, they believed.</p>

<p>"I will send 5,000," one said. "I will send 1,000," said another.</p>

<p>By the end of the day, we had raised 109,000 Naira—surpassing our target.</p>

<p>Jeremiah Alabi, a fellow alumnus who participated in that contribution, later shared why he joined in:</p>

<blockquote>"What majorly moved me to participate was the fact that I know you personally... I know you for something, it's the fact that you are a goal getter... I knew then for sure that it took a lot of self-restraint and personal discipline to still lead the project and see to its successful completion."</blockquote>

<p>Kofoworola, another team member on the project, echoed this sentiment:</p>

<blockquote>"I felt motivated to join the project because I genuinely believed in the vision... You coordinated everyone, motivated alumni to participate, and ensured the contributions were organized and impactful."</blockquote>

<p>Trust is the currency of leadership, and self-leadership is how you earn it. When people see you have "skin in the game," their hesitation turns into action.</p>

<h2>The Resilience of Self-Leadership</h2>

<p>However, self-leadership is not just about strength and public victories. It is also about what happens behind closed doors. It is about resilience when things go wrong.</p>

<p>Leadership can be draining. There will be times when the weight of expectation feels heavy, when the "light goes out" literally and metaphorically.</p>

<p>My partner, Oladipo Favour, who saw the behind-the-scenes reality of my tenure, describes this hidden side of self-leadership:</p>

<blockquote>"I saw how you handled tough situations... Getting to know you closely, I saw how draining leadership can be – mentally and emotionally. Like that time there was a light issue in school and everyone was criticizing you, and you literally broke down... But I'm glad you bounced back stronger... What I saw in you was resilience and a strong mind. The late nights, overthinking, and striving to make right decisions... You'd push through exhaustion, driven by a desire to get things done."</blockquote>

<p>Self-leadership doesn't mean you are immune to stress or failure. It means you have the resolve to bounce back. It means that even when you break down, you don't stay down. You process the pain, you rest if you must, but you eventually stand up and continue the work.</p>

<h2>Conclusion</h2>

<p>The concept of self-leadership is synonymous with exemplary leadership. Regardless of the position you hold, if you want your team, your members, or your organization to do something, <strong>start it first.</strong></p>

<p>You cannot ask for sacrifice if you are living in comfort. You cannot ask for generosity if you are tight-fisted. You cannot ask for discipline if you are chaotic.</p>

<p>When you lead yourself, you make the vision believable for others. You show them that the destination is reachable because you are already walking towards it.</p>

<p>Leadership is not a title you wear; it is an action you take. And that action must always begin with you.</p>

<hr />

<h3>🚀 Action Points</h3>

<ol>
<li><strong>The "First Mover" Audit:</strong> Identify one area in your team, family, or business where things are stagnant. Ask yourself: "Have I taken the first step here?" If people aren't speaking up in meetings, are you speaking up? If people aren't punctual, are you early? Identify one action you can take <em>first</em> this week to break the deadlock.</li>
<li><strong>Visual Commitment:</strong> The next time you need to rally people for a cause (a project, a donation, a trip), do not just announce the plan. Announce your contribution <em>simultaneously</em>. Make your "skin in the game" visible to those you lead.</li>
<li><strong>Self-Correction Reflection:</strong> At the end of each day this week, look in the mirror and ask: "If everyone on my team acted exactly like I did today, would we have succeeded or failed?" This is the ultimate test of self-leadership.</li>
</ol>
`,
      formattedContent: `
<h1>Chapter 2: Self-Leadership: The Foundation</h1>

<blockquote>"The first and greatest victory is to conquer yourself; to be conquered by yourself is of all things most shameful and vile." — Plato</blockquote>

<p>I have come to a profound realization that challenges the conventional view of authority: <strong>leadership is not solely about leading other people; leadership is, first and foremost, about leading yourself.</strong></p>

<p><strong>Self-Mastery is the Peak:</strong> Winning an Olympic gold or a war is nothing compared to getting your own mind and habits under control.</p>

<p><strong>The Ultimate Defeat:</strong> Letting your impulses, laziness, or temper run the show isn't just a "fail"—in Plato's view, it's the most "shameful" way to live because it means you've lost your freedom to your own shadows.</p>

<p>If you get this fundamental truth right, you will fully comprehend the essence of true leadership. I have searched through history and observed contemporaries, and I have found this to be an absolute law: there is no great leader of others who cannot first lead himself. It is impossible. While someone might stumble into a position of authority unconsciously, sustained greatness requires the capacity for self-mastery.</p>

<p>Why is this? Because the people you intend to lead are watching. They are not just listening to your words; they are studying your life. They are asking silent questions: <em>Is this person disciplined? Is he committed? Is he result-oriented?</em></p>

<p>Before you can direct the lives of multitudes, you must answer a simple question: <strong>Are you capable of directing your own life?</strong></p>

<h2>The Lost Cannot Lead</h2>

<p>Leading from within is not a new concept; it is the ancient prerequisite for influence. Picture it this way: imagine someone is lost in a dense forest, disoriented and panic-stricken. Then, they meet another person who is equally lost.</p>

<p>Can the second person help the first? No. A man who is lost cannot help another find his way.</p>

<p>For a leader to be a guide, he must first have navigated the path himself. He must have found his direction. Only after he has worked that path—struggled with it, understood it, and mastered it—can he turn back and say to others, "Follow me, I know the way."</p>

<p>This is the essence of leadership. It is easier to bring others along a path you have already walked. You must first discipline yourself and commit to the task. Leadership must be result-oriented, and the first result you must show is the command you have over your own actions.</p>

<h2>Leadership by Example: The Hunger Test</h2>

<p>One of the most powerful forms of leadership is <strong>Exemplary Leadership</strong>—leadership by example. It is the concept that you do not ask your team to do what you are not willing to do yourself.</p>

<p>I remember a specific incident with one of the teams I lead. We were holding a program, and it became apparent that the food provided was not enough for everyone. I had already received my share, and so had many others. But then we realized that one crucial team member had been overlooked.</p>

<p>This person was vital to the team. He had spent his own money and time traveling all the way from Lagos to Ibadan just to be there. And now, after all that sacrifice, I was being told there was no food for him?</p>

<p>I was angry. How could we miss this? But anger is not leadership; action is.</p>

<p>I immediately brought out my food and said, "Give my food to him."</p>

<p>People around me protested. "No, we won't allow you to do that. You are the leader."</p>

<p>I insisted. "Okay, if you won't allow me to give it all, take half of my food."</p>

<p>The moment I made that move—the moment I showed I was willing to go hungry for the sake of my team member—the atmosphere shifted. Other people started donating their food. "Take mine," "Take some of mine." Before we knew it, we had more than enough food for him.</p>

<p>What is the lesson here? As the leader, I spearheaded the solution. I didn't just issue a command: "Go and find food for him." I didn't delegate the problem. I took a bold step. I sacrificed. When others saw that the leader was willing to pay the price, they said, "Oh, let's follow this person."</p>

<h2>The Ripple Effect of Initiative</h2>

<p>This principle of "going first" became a habit for me. I realized that people are often waiting for permission to be generous or helpful, and the leader's action gives them that permission.</p>

<p>During my time as a student, and later as Student Union President at the University of Ilorin, I saw this play out repeatedly.</p>

<p>I recall an exam period when I was still a Faculty Librarian in my 300 level. Exam periods are notoriously difficult for students; many are broke and struggling to afford basic meals. Someone reached out to me saying they needed food.</p>

<p>I didn't have much, but I had a platform. I posted on my status that there were students in need and that I was willing to donate a certain amount of food to start the drive.</p>

<p>Immediately, the response was electric. Because I had volunteered first, another person said, "Oh, I'm interested in donating too." Then another. And another. We raised enough money to buy bags of rice, packs of spaghetti, and various foodstuffs. We ended up feeding a lot of students that season.</p>

<p>Later, as Student Union President, a similar situation occurred. Engineering students reached out on Twitter; some needed scientific calculators, others needed food. I publicly volunteered to buy some calculators and support with food.</p>

<p>Before I knew it, other student leaders and students were replying under the tweet, "I'll support with one calculator," "I'll send this amount." What started as a casual interaction snowballed into a massive community support system.</p>

<p>Why? <strong>Because I volunteered.</strong></p>

<p>You must be the one to make the move. You cannot put the responsibility on others until you have placed it squarely on yourself. That is self-leadership.</p>

<p>This standard of self-leadership—of doing the work before asking others to do it—transforms those around you. Phoenix, who is now the Student Union Senate President, reflects on how this demanding style of self-leadership influenced his own work ethic when he worked with me:</p>

<blockquote>"The tasks were getting too much at a point... But here's the drill: Royal Prince gives a task—'I need you to set 50 questions, take a class, summarize with deadlines!' He didn't compel me to do it; I wanted to. Meeting deadlines became the baseline; I don't procrastinate. I learned from Royal Prince to stop when I am done, not when I am tired. That habit of getting things done has rubbed off on all spheres of my life."</blockquote>

<p>When you lead yourself relentlessly, you give those around you a blueprint for their own excellence.</p>

<h2>Skin in the Game: The Financial Commitment</h2>

<p>The ultimate test of this self-leadership often comes down to finances. It is easy to pledge support; it is harder to pledge your own money.</p>

<p>I made it a rule: whenever my team or organization needed to raise money for a project, I would be the first to contribute.</p>

<p>I remember when I was the Director for one of my organizations. We needed to buy equipment that cost about 60,000 Naira. In a room full of people, the silence can be deafening when a figure like that is mentioned.</p>

<p>I broke the silence. "I am dropping this specific amount," I said, mentioning a significant portion.</p>

<p>The dynamic changed instantly. Everyone looked at me, saw the seriousness, and started chipping in. We raised the complete sum that very day.</p>

<p>This strategy proved itself again during my NYSC (National Youth Service Corps) at the Iseyin camp. The University of Ilorin alumni were known for making contributions, and at that time, a hall was being built for the camp. I looked at the project and told my fellow alumni, "This project is big. Our population here is large. We must do something."</p>

<p>I set a target: 100,000 Naira.</p>

<p>I gathered a few friends and told them the vision. But I didn't just sell the vision; I sold my commitment. "We are going to contribute at least 100,000 Naira," I said, "and <strong>I am dropping 20,000 Naira instantly.</strong>"</p>

<p>I sent the money immediately.</p>

<p>That action made the vision visible. It made it realistic. If I had just said, "Hey everyone, let's start contributing," without defining my own stake, doubt would have crept in. They would have wondered if the goal was achievable. But because I took the first step, they believed.</p>

<p>"I will send 5,000," one said. "I will send 1,000," said another.</p>

<p>By the end of the day, we had raised 109,000 Naira—surpassing our target.</p>

<p>Jeremiah Alabi, a fellow alumnus who participated in that contribution, later shared why he joined in:</p>

<blockquote>"What majorly moved me to participate was the fact that I know you personally... I know you for something, it's the fact that you are a goal getter... I knew then for sure that it took a lot of self-restraint and personal discipline to still lead the project and see to its successful completion."</blockquote>

<p>Kofoworola, another team member on the project, echoed this sentiment:</p>

<blockquote>"I felt motivated to join the project because I genuinely believed in the vision... You coordinated everyone, motivated alumni to participate, and ensured the contributions were organized and impactful."</blockquote>

<p>Trust is the currency of leadership, and self-leadership is how you earn it. When people see you have "skin in the game," their hesitation turns into action.</p>

<h2>The Resilience of Self-Leadership</h2>

<p>However, self-leadership is not just about strength and public victories. It is also about what happens behind closed doors. It is about resilience when things go wrong.</p>

<p>Leadership can be draining. There will be times when the weight of expectation feels heavy, when the "light goes out" literally and metaphorically.</p>

<p>My partner, Oladipo Favour, who saw the behind-the-scenes reality of my tenure, describes this hidden side of self-leadership:</p>

<blockquote>"I saw how you handled tough situations... Getting to know you closely, I saw how draining leadership can be – mentally and emotionally. Like that time there was a light issue in school and everyone was criticizing you, and you literally broke down... But I'm glad you bounced back stronger... What I saw in you was resilience and a strong mind. The late nights, overthinking, and striving to make right decisions... You'd push through exhaustion, driven by a desire to get things done."</blockquote>

<p>Self-leadership doesn't mean you are immune to stress or failure. It means you have the resolve to bounce back. It means that even when you break down, you don't stay down. You process the pain, you rest if you must, but you eventually stand up and continue the work.</p>

<h2>Conclusion</h2>

<p>The concept of self-leadership is synonymous with exemplary leadership. Regardless of the position you hold, if you want your team, your members, or your organization to do something, <strong>start it first.</strong></p>

<p>You cannot ask for sacrifice if you are living in comfort. You cannot ask for generosity if you are tight-fisted. You cannot ask for discipline if you are chaotic.</p>

<p>When you lead yourself, you make the vision believable for others. You show them that the destination is reachable because you are already walking towards it.</p>

<p>Leadership is not a title you wear; it is an action you take. And that action must always begin with you.</p>

<hr />

<h3>🚀 Action Points</h3>

<ol>
<li><strong>The "First Mover" Audit:</strong> Identify one area in your team, family, or business where things are stagnant. Ask yourself: "Have I taken the first step here?" If people aren't speaking up in meetings, are you speaking up? If people aren't punctual, are you early? Identify one action you can take <em>first</em> this week to break the deadlock.</li>
<li><strong>Visual Commitment:</strong> The next time you need to rally people for a cause (a project, a donation, a trip), do not just announce the plan. Announce your contribution <em>simultaneously</em>. Make your "skin in the game" visible to those you lead.</li>
<li><strong>Self-Correction Reflection:</strong> At the end of each day this week, look in the mirror and ask: "If everyone on my team acted exactly like I did today, would we have succeeded or failed?" This is the ultimate test of self-leadership.</li>
</ol>
`,
      status: "draft"
    },
    {
      pageNumber: 3,
      title: "Chapter 3: Discipline: My Non-Negotiable",
      rawContent: "<h2>Discipline: My Non-Negotiable</h2><p>How discipline drove your achievements (student politics, businesses, etc.)</p>",
      formattedContent: "<h2>Discipline: My Non-Negotiable</h2><p>How discipline drove your achievements (student politics, businesses, etc.)</p>",
      status: "draft"
    },
    {
      pageNumber: 4,
      title: "Chapter 4: Purpose Fuels Direction",
      rawContent: "<h2>Purpose Fuels Direction</h2><p>Finding your \"why\" and letting it guide your actions.</p>",
      formattedContent: "<h2>Purpose Fuels Direction</h2><p>Finding your \"why\" and letting it guide your actions.</p>",
      status: "draft"
    },
    {
      pageNumber: 5,
      title: "Chapter 5: From Campus to Beyond",
      rawContent: "<h2>From Campus to Beyond</h2><p>Student leadership (SU President, organizations) as a testing ground.</p>",
      formattedContent: "<h2>From Campus to Beyond</h2><p>Student leadership (SU President, organizations) as a testing ground.</p>",
      status: "draft"
    },
    {
      pageNumber: 6,
      title: "Chapter 6: Impacting Lives, Scaling Yourself",
      rawContent: "<h2>Impacting Lives, Scaling Yourself</h2><p>Tutorials, organizations, impacting 20,000+ students.</p>",
      formattedContent: "<h2>Impacting Lives, Scaling Yourself</h2><p>Tutorials, organizations, impacting 20,000+ students.</p>",
      status: "draft"
    },
    {
      pageNumber: 7,
      title: "Chapter 7: Entrepreneurship & Self-Leadership",
      rawContent: "<h2>Entrepreneurship & Self-Leadership</h2><p>Balancing Fintech work, building your business, passions like photography.</p>",
      formattedContent: "<h2>Entrepreneurship & Self-Leadership</h2><p>Balancing Fintech work, building your business, passions like photography.</p>",
      status: "draft"
    },
    {
      pageNumber: 8,
      title: "Chapter 8: Leading from Within: Your Next Step",
      rawContent: "<h2>Leading from Within: Your Next Step</h2><p>Encouragement to start mastering self-leadership for greater impact.</p>",
      formattedContent: "<h2>Leading from Within: Your Next Step</h2><p>Encouragement to start mastering self-leadership for greater impact.</p>",
      status: "draft"
    }
  ]
};

const seedBook = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the first user to assign the book to
    const user = await User.findOne();
    
    if (!user) {
      console.error('No user found! Please register a user first via the app.');
      process.exit(1);
    }

    console.log(`Assigning book to user: ${user.username} (${user.email})`);

    // Check if book already exists
    let book = await Book.findOne({ title: bookData.title });

    if (book) {
        console.log('Book already exists. Updating content...');
        book.description = bookData.description;
        book.genre = bookData.genre;
        book.status = bookData.status;
        book.coverImage = bookData.coverImage;
        book.pages = bookData.pages;
        await book.save();
        console.log('Book updated successfully!');
    } else {
        // Create the book
        book = new Book({
        ...bookData,
        author: user._id
        });
        await book.save();
        console.log('Book created successfully!');
    }

    console.log('Title:', book.title);
    console.log('ID:', book._id);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding book:', error);
    process.exit(1);
  }
};

seedBook();
