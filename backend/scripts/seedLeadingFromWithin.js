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
      title: "Chapter 1: The Pre-University Mindset Shift",
      rawContent: `
<p>I became the 36th Student Union President of the University of Ilorin, leading a student body of over 40,000. Prior to that, in my third year (300 level), I served as the Student Union General Secretary. In my second year, I was the Librarian for the Faculty of Agriculture, representing over 5,000 students. Even in my first year (100 level), I served as an Honourable Representative for my department.</p>

<p>To the outside world, my leadership journey seemed to follow a straight, upward trajectory through the university ranks. But thinking back, my leadership journey didn't start with an election. It didn't start when I arrived on campus.</p>

<p>It started years earlier, in a single room I shared with my mother and sister. It started with a decision.</p>

<h3>The Hunger for "Success"</h3>

<p>I come from a humble background. At the time, my mother was earning about forty to forty-five thousand Naira (roughly $100 at the time) a month. That was what sustained us. We lived in a single room. My admission to university was even delayed because my family had to wait for my older sister to graduate before they could afford to send me.</p>

<p>I sat at home after secondary school, looking at my life, and I knew one thing with absolute certainty: <strong>I cannot continue like this.</strong></p>

<p>I looked at the people in my church who came from wealthy backgrounds. I saw their lives, and I wished my family had what they had. To my young mind—I was about sixteen or seventeen—success meant material things. It meant fine houses, beautiful cars, and living well. That was the limit of my exposure at the time.</p>

<p>But that hunger sparked a critical question. I asked myself, "What do I want to become?"</p>

<p>I realized that if I wanted to change my family's situation, <em>I</em> had to be different. It wouldn't be handed to me on a platter of gold. I had to do something. I said to myself, "I have to do all it takes to be successful."</p>

<p>This wasn't just a wish; it was a mindset shift. I started telling myself what I needed to do to get the kind of life I wanted. I believed strongly—perhaps fueled by my faith and the movies I'd watched about rags-to-riches stories—that there was a future where things would be better. But I knew I had to work for it.</p>

<h3>The First Test: Stepping Out</h3>

<p>One of the most critical moments in this transformation happened when I was scrolling online and saw a flyer for a talent competition. It promised a cash prize for singing, dancing, or spoken word poetry.</p>

<p>I had never faced an audience in my life. I had never written a poem to perform. I had never spoken publicly. But I saw that flyer, and something in me clicked.</p>

<p>I said to myself, "I can do spoken words. Let me give this a trial."</p>

<p>The competition was huge, with participants coming from major cities like Lagos, Ibadan, and Akure. And there I was, in my small town, telling myself I could compete with them.</p>

<p>I went for the competition. I didn't even pass the audition stage.</p>

<p>But for me, that didn't matter. The victory wasn't in the prize money; the victory was in the attempt. The moment I said, "I can go, I can do this," something shifted. That thought pushed me to step out of my comfort zone. I realized that once I made up my mind to do something, my body and actions would align to make it happen.</p>

<h3>The Discipline of Passion</h3>

<p>This new mindset began to shape everything I did. I decided that if I was going to be successful, I had to put my entire being into whatever task was in front of me.</p>

<p>I started attending a new church and noticed they didn't have a conga drummer. I had played in my former church—played so well that people would put money in my pockets and celebrate me. So, I volunteered.</p>

<p>I played that drum with everything I had. I played with such energy and strength that my hands would swell after the service. I played as if my life depended on it.</p>

<p>People in the church started asking, "Who is this new boy playing so passionately?"</p>

<p>I wasn't just playing for applause. I was practicing success. I started going to the church every day, Monday to Friday, just to practice. I believed that this discipline, this consistency, and this passion were the ingredients of the success I craved.</p>

<h3>The Seed of Student Politics</h3>

<p>This drive followed me as I prepared for university. While waiting for my admission, I stayed with my elder sister who was a student at the Federal University of Agriculture, Abeokuta (FUNAAB).</p>

<p>My sister was a Class Representative for her level. She would come home and tell me about her responsibilities and assignments. I admired that. I thought, "I want to hold that kind of position."</p>

<p>Then, a friend of hers contested for Faculty President. My sister would come back home tired, sharing stories about the campaigns, the rallies, and the strategies. I was fascinated.</p>

<p>There was drama, too. Her friend won, but only after a complex political battle involving petitions and disqualifications. A disqualified candidate even mobilized his supporters to vote for my sister's friend to spite an opponent.</p>

<p>Hearing these stories didn't scare me; they intrigued me. I told myself, "When I gain admission, I'm going to go into student politics."</p>

<p>Because I had already made that decision—because I had already "led myself" to believe I could do it—when I finally arrived at the University of Ilorin, I didn't hesitate. I was ready.</p>

<h3>Conclusion: Leading Yourself First</h3>

<p>Many people assume leadership is strictly about directing others—holding a title, giving orders, or managing a crowd. But they neglect the foundational truth: <strong>Leadership starts with YOU leading yourself.</strong></p>

<p>My success as a Student Union President wasn't an accident. It was the result of a boy in a single room deciding to lead his own life first. It was the result of the discipline learned on a conga drum and the courage tested in a failed audition.</p>

<p>If you cannot lead yourself—if you cannot govern your own mindset, discipline your own actions, and push yourself beyond your comfort zone—you cannot effectively lead others.</p>

<p>The journey to the presidency began with the presidency of my own mind.</p>

<hr />

<p><strong>Action Point:</strong><br />
Reflect on your current mindset. Are you waiting for a title to start leading, or are you leading your own life with passion and discipline right now? Identify one area in your life today where you can apply "presidential" dedication, even if no one is watching.</p>
`,
      formattedContent: `
<p>I became the 36th Student Union President of the University of Ilorin, leading a student body of over 40,000. Prior to that, in my third year (300 level), I served as the Student Union General Secretary. In my second year, I was the Librarian for the Faculty of Agriculture, representing over 5,000 students. Even in my first year (100 level), I served as an Honourable Representative for my department.</p>

<p>To the outside world, my leadership journey seemed to follow a straight, upward trajectory through the university ranks. But thinking back, my leadership journey didn't start with an election. It didn't start when I arrived on campus.</p>

<p>It started years earlier, in a single room I shared with my mother and sister. It started with a decision.</p>

<h3>The Hunger for "Success"</h3>

<p>I come from a humble background. At the time, my mother was earning about forty to forty-five thousand Naira (roughly $100 at the time) a month. That was what sustained us. We lived in a single room. My admission to university was even delayed because my family had to wait for my older sister to graduate before they could afford to send me.</p>

<p>I sat at home after secondary school, looking at my life, and I knew one thing with absolute certainty: <strong>I cannot continue like this.</strong></p>

<p>I looked at the people in my church who came from wealthy backgrounds. I saw their lives, and I wished my family had what they had. To my young mind—I was about sixteen or seventeen—success meant material things. It meant fine houses, beautiful cars, and living well. That was the limit of my exposure at the time.</p>

<p>But that hunger sparked a critical question. I asked myself, "What do I want to become?"</p>

<p>I realized that if I wanted to change my family's situation, <em>I</em> had to be different. It wouldn't be handed to me on a platter of gold. I had to do something. I said to myself, "I have to do all it takes to be successful."</p>

<p>This wasn't just a wish; it was a mindset shift. I started telling myself what I needed to do to get the kind of life I wanted. I believed strongly—perhaps fueled by my faith and the movies I'd watched about rags-to-riches stories—that there was a future where things would be better. But I knew I had to work for it.</p>

<h3>The First Test: Stepping Out</h3>

<p>One of the most critical moments in this transformation happened when I was scrolling online and saw a flyer for a talent competition. It promised a cash prize for singing, dancing, or spoken word poetry.</p>

<p>I had never faced an audience in my life. I had never written a poem to perform. I had never spoken publicly. But I saw that flyer, and something in me clicked.</p>

<p>I said to myself, "I can do spoken words. Let me give this a trial."</p>

<p>The competition was huge, with participants coming from major cities like Lagos, Ibadan, and Akure. And there I was, in my small town, telling myself I could compete with them.</p>

<p>I went for the competition. I didn't even pass the audition stage.</p>

<p>But for me, that didn't matter. The victory wasn't in the prize money; the victory was in the attempt. The moment I said, "I can go, I can do this," something shifted. That thought pushed me to step out of my comfort zone. I realized that once I made up my mind to do something, my body and actions would align to make it happen.</p>

<h3>The Discipline of Passion</h3>

<p>This new mindset began to shape everything I did. I decided that if I was going to be successful, I had to put my entire being into whatever task was in front of me.</p>

<p>I started attending a new church and noticed they didn't have a conga drummer. I had played in my former church—played so well that people would put money in my pockets and celebrate me. So, I volunteered.</p>

<p>I played that drum with everything I had. I played with such energy and strength that my hands would swell after the service. I played as if my life depended on it.</p>

<p>People in the church started asking, "Who is this new boy playing so passionately?"</p>

<p>I wasn't just playing for applause. I was practicing success. I started going to the church every day, Monday to Friday, just to practice. I believed that this discipline, this consistency, and this passion were the ingredients of the success I craved.</p>

<h3>The Seed of Student Politics</h3>

<p>This drive followed me as I prepared for university. While waiting for my admission, I stayed with my elder sister who was a student at the Federal University of Agriculture, Abeokuta (FUNAAB).</p>

<p>My sister was a Class Representative for her level. She would come home and tell me about her responsibilities and assignments. I admired that. I thought, "I want to hold that kind of position."</p>

<p>Then, a friend of hers contested for Faculty President. My sister would come back home tired, sharing stories about the campaigns, the rallies, and the strategies. I was fascinated.</p>

<p>There was drama, too. Her friend won, but only after a complex political battle involving petitions and disqualifications. A disqualified candidate even mobilized his supporters to vote for my sister's friend to spite an opponent.</p>

<p>Hearing these stories didn't scare me; they intrigued me. I told myself, "When I gain admission, I'm going to go into student politics."</p>

<p>Because I had already made that decision—because I had already "led myself" to believe I could do it—when I finally arrived at the University of Ilorin, I didn't hesitate. I was ready.</p>

<h3>Conclusion: Leading Yourself First</h3>

<p>Many people assume leadership is strictly about directing others—holding a title, giving orders, or managing a crowd. But they neglect the foundational truth: <strong>Leadership starts with YOU leading yourself.</strong></p>

<p>My success as a Student Union President wasn't an accident. It was the result of a boy in a single room deciding to lead his own life first. It was the result of the discipline learned on a conga drum and the courage tested in a failed audition.</p>

<p>If you cannot lead yourself—if you cannot govern your own mindset, discipline your own actions, and push yourself beyond your comfort zone—you cannot effectively lead others.</p>

<p>The journey to the presidency began with the presidency of my own mind.</p>

<hr />

<p><strong>Action Point:</strong><br />
Reflect on your current mindset. Are you waiting for a title to start leading, or are you leading your own life with passion and discipline right now? Identify one area in your life today where you can apply "presidential" dedication, even if no one is watching.</p>
`,
      status: "draft"
    },
    {
      pageNumber: 2,
      title: "Chapter 2: Self-Leadership: The Foundation",
      rawContent: "<h2>Self-Leadership: The Foundation</h2><p>Why leading yourself is key to leading others.</p>",
      formattedContent: "<h2>Self-Leadership: The Foundation</h2><p>Why leading yourself is key to leading others.</p>",
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
