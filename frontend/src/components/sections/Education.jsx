
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Zap, Target, Trophy, BookOpen, Star, Users, PlayCircle, CheckSquare, Award, Brain, UploadCloud, MessageCircle as ChatIcon, Edit3, ChevronRight, FileText, ListChecks, Users2, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const CourseCard = ({ course, onEnroll }) => (
  <Card className="glass-effect overflow-hidden h-full flex flex-col card-interactive group">
    <CardHeader className="p-0 relative">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img-replace src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="absolute top-2 right-2 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm font-semibold">
        {course.duration}
      </div>
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{course.title}</CardTitle>
      <p className="text-xs text-muted-foreground mb-2">By {course.instructor}</p>
      <p className="text-sm text-muted-foreground mb-3 h-16 overflow-hidden text-ellipsis">{course.description}</p>
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <Users className="w-3 h-3" /><span>{course.students} students</span>
        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span>{course.rating}/5.0</span>
      </div>
    </CardContent>
    <CardFooter className="p-4 border-t border-border/20">
      <Button className="w-full neon-glow btn-primary-glow" onClick={() => onEnroll(course)}>
        <PlayCircle className="w-4 h-4 mr-2" /> Enroll Now ({course.price})
      </Button>
    </CardFooter>
  </Card>
);

const FeatureCard = ({ feature, onClick }) => (
  <motion.div
    className="glass-effect rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col justify-between card-interactive group"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 50 }}
    onClick={onClick}
  >
    <div>
      <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary transition-transform duration-300 group-hover:scale-110" />
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
    </div>
    <Button variant="outline" size="sm" className="mt-auto group-hover:border-primary group-hover:text-primary transition-colors">
      Explore <ChevronRight className="w-4 h-4 ml-1"/>
    </Button>
  </motion.div>
);

const UploadCourseModal = ({ isOpen, onOpenChange, setNotifications, currentUser }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');

  const handleUploadCourse = () => {
     if (!courseTitle || !courseDescription || !coursePrice) {
      toast({ title: "Missing Fields! 📝", description: "Please fill in all course details.", variant: "destructive" });
      return;
    }
    toast({ title: "Course Submitted (Simulated)! 📚", description: `"${courseTitle}" is now pending review (local simulation). Real upload needs backend.` });
    setNotifications(`${currentUser.name} submitted a new course "${courseTitle}" for review.`, "education");
    onOpenChange(false);
    setCourseTitle(''); setCourseDescription(''); setCoursePrice('');
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl"><UploadCloud className="w-6 h-6 mr-2 text-primary"/>Upload New Course</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin pr-2">
          <div><Label htmlFor="courseTitle">Course Title</Label><Input id="courseTitle" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="E.g. Mastering React Hooks"/></div>
          <div><Label htmlFor="courseDescription">Course Description</Label><Textarea id="courseDescription" value={courseDescription} onChange={e => setCourseDescription(e.target.value)} placeholder="Detailed description of your course content..." className="min-h-[120px]"/></div>
          <div><Label htmlFor="coursePrice">Price (RGX)</Label><Input id="coursePrice" type="number" value={coursePrice} onChange={e => setCoursePrice(e.target.value)} placeholder="E.g. 99"/></div>
          <div>
            <Label htmlFor="courseThumbnail">Course Thumbnail (Optional)</Label>
            <Button variant="outline" className="w-full mt-1" onClick={() => toast({title: "🚧 Upload Not Implemented", description:"Actual image upload needs backend storage."})}>Upload Thumbnail</Button>
          </div>
           <div>
            <Label htmlFor="courseVideos">Course Videos/Modules (Optional)</Label>
            <Button variant="outline" className="w-full mt-1" onClick={() => toast({title: "🚧 Upload Not Implemented", description:"Actual content upload needs backend storage."})}>Upload Content</Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleUploadCourse} className="btn-primary-glow">Submit for Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AITutorModal = ({ isOpen, onOpenChange, setNotifications }) => {
  const [chatMessages, setChatMessages] = useState([ { id: 1, sender: 'ai', text: "Hello! I'm your AI Tutor. What subject are you studying today?" } ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const newUserMessage = { id: Date.now(), sender: 'user', text: userInput };
    const aiResponse = { id: Date.now() + 1, sender: 'ai', text: `That's an interesting question about "${userInput}"! Let's break it down. (Simulated AI tutor response)` };
    setChatMessages(prev => [...prev, newUserMessage, aiResponse]);
    setUserInput('');
    setNotifications("Sent a message to AI Tutor.", "education");
  };
   return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-lg h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-border/20">
          <DialogTitle className="flex items-center text-xl"><Brain className="w-5 h-5 mr-2 text-purple-400"/>AI Tutor</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {chatMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] p-2.5 rounded-lg text-sm ${msg.sender === 'ai' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="p-4 border-t border-border/20 bg-background/50">
          <div className="flex w-full space-x-2">
            <Input value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Ask your question..." onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
            <Button onClick={handleSendMessage} disabled={!userInput.trim()} className="btn-primary-glow">Send</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const QuizModal = ({ isOpen, onOpenChange, setNotifications }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const quizQuestions = [
    { question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
    { question: "Capital of France?", options: ["Berlin", "Madrid", "Paris"], answer: "Paris" },
    { question: "Largest Planet?", options: ["Earth", "Jupiter", "Mars"], answer: "Jupiter" },
  ];

  const handleAnswer = (option) => {
    if (option === quizQuestions[currentQuestion].answer) setScore(s => s + 1);
    if (currentQuestion < quizQuestions.length - 1) setCurrentQuestion(q => q + 1);
    else setQuizFinished(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0); setScore(0); setQuizFinished(false); onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetQuiz}>
      <DialogContent className="glass-effect sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl"><ListChecks className="w-6 h-6 mr-2 text-primary"/>Knowledge Quiz</DialogTitle>
        </DialogHeader>
        {!quizFinished ? (
          <div className="py-4 space-y-4">
            <p className="font-semibold">{quizQuestions[currentQuestion].question}</p>
            <div className="space-y-2">
              {quizQuestions[currentQuestion].options.map(opt => (
                <Button key={opt} variant="outline" className="w-full justify-start" onClick={() => handleAnswer(opt)}>{opt}</Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">Question {currentQuestion + 1} of {quizQuestions.length}</p>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <Trophy className="w-16 h-16 mx-auto text-yellow-400"/>
            <h3 className="text-2xl font-bold">Quiz Finished!</h3>
            <p className="text-lg">Your Score: <span className="font-bold text-primary">{score} / {quizQuestions.length}</span></p>
            <Button onClick={resetQuiz} className="btn-primary-glow">Try Again</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


const Education = ({ setNotifications, updateRgxCoins, rgxCoins, currentUser }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAITutorModalOpen, setIsAITutorModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  
  const features = [
    { title: "AI Tutor", icon: Brain, description: "Personalized learning with AI assistance, get instant feedback and guidance.", action: () => setIsAITutorModalOpen(true) },
    { title: "Quizzes & Tests", icon: CheckSquare, description: "Test your knowledge, track progress, and earn RGX for achievements.", action: () => setIsQuizModalOpen(true) },
    { title: "Competition System", icon: Trophy, description: "Compete in challenges, climb leaderboards, and win exclusive prizes.", action: () => handleFeatureClick("Competition System", "Join educational competitions and win rewards.") },
    { title: "Course Uploads", icon: BookOpen, description: "Share your expertise, create courses, and earn RGX Coins.", action: () => setIsUploadModalOpen(true) },
    { title: "Certificates", icon: Award, description: "Receive verified certificates upon course completion to showcase your skills.", action: () => handleFeatureClick("Certificates", "View and share your earned certificates.") },
    { title: "Study Groups", icon: Users2, description: "Collaborate with peers, discuss topics, and learn together in interactive groups.", action: () => handleFeatureClick("Study Groups", "Find or create study groups for your courses.") }
  ];

  const sampleCourses = [
    { id: "c1", title: "Intro to Web Dev", instructor: "Dr. Code", description: "Learn HTML, CSS, and JavaScript basics.", imageUrl: "Web development course graphic with code snippets", students: 1205, rating: 4.8, duration: "6 Weeks", price: "50 RGX", priceValue: 50 },
    { id: "c2", title: "Advanced AI/ML", instructor: "Prof. Neuron", description: "Dive deep into neural networks and algorithms.", imageUrl: "AI and machine learning concept art with glowing brain", students: 850, rating: 4.9, duration: "12 Weeks", price: "150 RGX", priceValue: 150 },
    { id: "c3", title: "Digital Marketing Pro", instructor: "Market Maven", description: "Master SEO, SMM, and content strategy.", imageUrl: "Digital marketing strategy illustration with charts", students: 2100, rating: 4.7, duration: "4 Weeks", price: "75 RGX", priceValue: 75 },
    { id: "c4", title: "Graphic Design Masterclass", instructor: "Pixel Perfect", description: "Unlock your creativity with design principles.", imageUrl: "Graphic design tools and colorful artwork", students: 1500, rating: 4.6, duration: "8 Weeks", price: "60 RGX", priceValue: 60 },
  ];

  const handleEnroll = (course) => {
    if (rgxCoins >= course.priceValue) {
      updateRgxCoins(-course.priceValue);
      toast({ title: `Enrolled in ${course.title}! 🎉`, description: `You paid ${course.price}. Happy learning!` });
      setNotifications(`Successfully enrolled in "${course.title}".`, "education");
    } else {
      toast({ title: "Insufficient Funds 💸", description: `You need ${course.priceValue - rgxCoins} more RGX to enroll.`, variant: "destructive"});
      setNotifications(`Failed to enroll in "${course.title}" due to insufficient funds.`, "education");
    }
  };
  
  const handleFeatureClick = (title, description = "This educational feature is under development. 🚀") => {
     toast({ title: `🚧 ${title} Coming Soon!`, description });
     setNotifications(`Accessed ${title} in Education.`, "education");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <UploadCourseModal isOpen={isUploadModalOpen} onOpenChange={setIsUploadModalOpen} setNotifications={setNotifications} currentUser={currentUser} />
      <AITutorModal isOpen={isAITutorModalOpen} onOpenChange={setIsAITutorModalOpen} setNotifications={setNotifications} />
      <QuizModal isOpen={isQuizModalOpen} onOpenChange={setIsQuizModalOpen} setNotifications={setNotifications} />

      <div className="text-center space-y-2">
        <motion.h1 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          RG Fling Education Hub
        </motion.h1>
        <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          Learn, compete, and earn RGX Coins. Knowledge is power!
        </motion.p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 mb-6 glass-effect p-2 rounded-lg">
          <TabsTrigger value="courses" className="py-2.5 rounded-md"><BookOpen className="w-4 h-4 mr-2"/>Courses</TabsTrigger>
          <TabsTrigger value="features" className="py-2.5 rounded-md"><Zap className="w-4 h-4 mr-2"/>Platform Features</TabsTrigger>
          <TabsTrigger value="competitions" className="py-2.5 md:col-span-1 col-span-2 rounded-md"><Trophy className="w-4 h-4 mr-2"/>Competitions</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sampleCourses.map((course, index) => (
                <motion.div key={course.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: index * 0.05, type: "spring", stiffness: 50}}>
                   <CourseCard course={course} onEnroll={handleEnroll} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="features">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                 <FeatureCard key={index} feature={feature} onClick={feature.action} />
              ))}
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="competitions">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-center glass-effect rounded-xl p-10 card-interactive">
             <Trophy className="w-20 h-20 mx-auto text-yellow-400 mb-6 animate-pulse" />
             <h2 className="text-2xl font-bold mb-3">Coding Challenges & Quiz Bowls!</h2>
             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
               Put your skills to the test! Weekly coding competitions and subject-based quiz bowls with RGX Coin prizes and leaderboard glory.
             </p>
             <Button size="lg" className="neon-glow btn-primary-glow" onClick={() => handleFeatureClick("View Competitions", "Browse ongoing and upcoming educational competitions.")}>
               View Active Competitions
             </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Education;
