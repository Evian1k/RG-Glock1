
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Stethoscope, Zap, Gift, TrendingUp, Video, CalendarDays, ShieldCheck, Brain, Activity, HeartPulse, ChevronRight, PlusCircle, BarChart3, BedDouble } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const ServiceCard = ({ service, onAction }) => (
  <Card 
    className="glass-effect h-full flex flex-col text-center p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer card-interactive group"
    onClick={() => onAction(service)}
  >
    <service.icon className={`w-12 h-12 mx-auto mb-4 ${service.color || 'text-primary'} transition-transform duration-300 group-hover:scale-110`} />
    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
    <p className="text-muted-foreground text-sm flex-grow">{service.description}</p>
    <Button variant="outline" size="sm" className="mt-4 group-hover:border-primary group-hover:text-primary transition-colors">
      Explore <ChevronRight className="w-4 h-4 ml-1"/>
    </Button>
  </Card>
);

const HealthAIChatModal = ({ isOpen, onOpenChange, setNotifications }) => {
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! I'm your AI Health Assistant. I can provide general health information and tips. For medical advice, please consult a doctor." }
  ]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const newUserMessage = { id: Date.now(), sender: 'user', text: userInput };
    const aiResponse = { id: Date.now() + 1, sender: 'ai', text: `Regarding "${userInput}", remember that I am an AI and cannot give medical diagnoses. It's best to consult a healthcare professional for specific concerns. (Simulated AI response)` };
    
    setChatMessages(prev => [...prev, newUserMessage, aiResponse]);
    setUserInput('');
    setNotifications("Sent a message to AI Health Assistant.", "health");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-lg h-[70vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-border/20">
          <DialogTitle className="flex items-center text-xl"><Brain className="w-5 h-5 mr-2 text-purple-400"/>AI Health Assistant</DialogTitle>
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
            <Input 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)} 
              placeholder="Ask a health question (general info only)..." 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} disabled={!userInput.trim()} className="btn-primary-glow">
              Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DoctorBookingModal = ({ isOpen, onOpenChange, setNotifications }) => {
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleBookAppointment = () => {
    if(!specialty || !date || !time) {
      toast({title: "Missing Information", description: "Please select specialty, date, and time.", variant: "destructive"});
      return;
    }
    toast({ title: "Appointment Booked (Simulated)!", description: `Your appointment for ${specialty} on ${date} at ${time} is confirmed.` });
    setNotifications(`Booked a simulated doctor appointment for ${specialty}.`, "health");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl"><Stethoscope className="w-6 h-6 mr-2 text-blue-400"/>Book an Appointment</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div><Label htmlFor="specialty">Specialty</Label><Input id="specialty" value={specialty} onChange={e=>setSpecialty(e.target.value)} placeholder="E.g., General Physician, Dentist"/></div>
          <div><Label htmlFor="date">Preferred Date</Label><Input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
          <div><Label htmlFor="time">Preferred Time</Label><Input id="time" type="time" value={time} onChange={e=>setTime(e.target.value)}/></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleBookAppointment} className="btn-primary-glow">Book Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const HealthTrackingModal = ({ isOpen, onOpenChange, setNotifications }) => {
  const [steps, setSteps] = useState(5000);
  const [sleep, setSleep] = useState(7);

  const handleLogData = () => {
    toast({ title: "Health Data Logged (Simulated)!", description: `Steps: ${steps}, Sleep: ${sleep} hours.` });
    setNotifications(`Logged health data: ${steps} steps, ${sleep} hours sleep.`, "health");
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect sm:max-w-md">
        <DialogHeader><DialogTitle className="flex items-center text-xl"><Activity className="w-6 h-6 mr-2 text-red-400"/>Log Health Data</DialogTitle></DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <Label htmlFor="steps" className="flex justify-between"><span>Steps Walked:</span> <span className="font-bold text-primary">{steps.toLocaleString()}</span></Label>
            <Slider id="steps" defaultValue={[steps]} max={20000} step={100} onValueChange={(val) => setSteps(val[0])} className="mt-2"/>
          </div>
          <div>
            <Label htmlFor="sleep" className="flex justify-between"><span>Hours Slept:</span> <span className="font-bold text-primary">{sleep} hrs</span></Label>
            <Slider id="sleep" defaultValue={[sleep]} max={12} step={0.5} onValueChange={(val) => setSleep(val[0])} className="mt-2"/>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleLogData} className="btn-primary-glow">Log Data</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


const HealthAI = ({ setNotifications }) => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isDoctorBookingOpen, setIsDoctorBookingOpen] = useState(false);
  const [isHealthTrackingOpen, setIsHealthTrackingOpen] = useState(false);

  const services = [
    { 
      title: "Doctor Booking", icon: Stethoscope, color: "text-blue-400",
      description: "Find & book appointments with verified healthcare professionals.",
      action: () => setIsDoctorBookingOpen(true)
    },
    { 
      title: "AI Health Assistant", icon: Brain, color: "text-purple-400",
      description: "Get instant, personalized health advice & wellness recommendations from our AI.",
      action: () => setIsAIChatOpen(true)
    },
    { 
      title: "Wellness Rewards", icon: Gift, color: "text-green-400",
      description: "Earn RGX for achieving health goals & maintaining healthy habits.",
      action: () => handleServiceAction({title: "Wellness Rewards", description: "Track your fitness goals and earn RGX Coins! (Connect fitness trackers in future)"})
    },
    { 
      title: "Health Tracking", icon: Activity, color: "text-red-400",
      description: "Monitor activity, sleep, nutrition, and vital health metrics.",
      action: () => setIsHealthTrackingOpen(true)
    },
    { 
      title: "Telemedicine", icon: Video, color: "text-indigo-400",
      description: "Connect with doctors for virtual consultations from home.",
      action: () => handleServiceAction({title: "Telemedicine", description: "Secure video calls with healthcare providers. (Requires specialized video call integration)"})
    },
    { 
      title: "Health Calendar", icon: CalendarDays, color: "text-yellow-500",
      description: "Manage appointments, medication schedules, and health reminders.",
      action: () => handleServiceAction({title: "Health Calendar", description: "Keep track of all your health-related appointments and reminders."})
    }
  ];

  const handleServiceAction = (service) => {
    toast({ title: `🚧 Exploring ${service.title}`, description: service.description || "This feature is under development. Check back later! 🚀" });
    setNotifications(`Accessed "${service.title}" in Health & AI.`, "health");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <HealthAIChatModal isOpen={isAIChatOpen} onOpenChange={setIsAIChatOpen} setNotifications={setNotifications} />
      <DoctorBookingModal isOpen={isDoctorBookingOpen} onOpenChange={setIsDoctorBookingOpen} setNotifications={setNotifications} />
      <HealthTrackingModal isOpen={isHealthTrackingOpen} onOpenChange={setIsHealthTrackingOpen} setNotifications={setNotifications} />

      <div className="text-center space-y-2">
        <motion.h1 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          Health & AI Hub
        </motion.h1>
        <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your intelligent wellness companion. Stay healthy, earn rewards.
        </motion.p>
      </div>

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-2 mb-6 glass-effect p-2 rounded-lg">
          <TabsTrigger value="services" className="py-2.5 rounded-md"><HeartPulse className="w-4 h-4 mr-2"/>Services</TabsTrigger>
          <TabsTrigger value="security" className="py-2.5 rounded-md"><ShieldCheck className="w-4 h-4 mr-2"/>Platform Security</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 50 }}
              >
                <ServiceCard service={service} onAction={service.action || (() => handleServiceAction(service))} />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        
        <TabsContent value="security">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass-effect shadow-xl card-interactive">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Zap className="w-7 h-7 mr-3 text-red-400" />
                  AI-Powered Security & Fraud Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  At RG Fling, your security and privacy are paramount. Our advanced AI systems work tirelessly to protect your account, data, and transactions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="p-4 rounded-lg bg-background/50">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Real-time Monitoring</h4>
                    <p className="text-xs text-muted-foreground">24/7 AI surveillance detects and flags suspicious activities instantly.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Secure Transactions</h4>
                    <p className="text-xs text-muted-foreground">All financial transactions are protected with end-to-end encryption and fraud prevention.</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50">
                    <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold mb-1">Data Privacy</h4>
                    <p className="text-xs text-muted-foreground">We adhere to strict data protection standards to keep your personal information safe.</p>
                  </div>
                </div>
                <Button className="w-full neon-glow btn-primary-glow" onClick={() => handleServiceAction({title: "Security Details", description: "Learn more about RG Fling's comprehensive security protocols."})}>
                  Learn More About Our Security Measures
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthAI;
