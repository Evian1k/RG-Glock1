import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Coins, TrendingUp, Wallet, Share2, Plus, Crown, ArrowRightLeft, ShieldCheck, Receipt } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';

const TransactionRow = ({ tx }) => (
  <div className={`flex justify-between items-center p-3 rounded-md ${tx.type === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
    <div className="flex items-center space-x-3">
      {tx.type === 'credit' ? <Plus className="w-5 h-5"/> : <ArrowRightLeft className="w-5 h-5"/>}
      <div>
        <p className="text-sm font-medium text-foreground">{tx.description}</p>
        <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
      </div>
    </div>
    <p className={`text-sm font-semibold`}>
      {tx.type === 'credit' ? '+' : '-'} {tx.amount.toLocaleString()} RGX
    </p>
  </div>
);

const RGXWallet = ({ rgxCoins, setNotifications, updateRgxCoins, currentUser }) => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from backend
  useEffect(() => {
    async function fetchTxs() {
      try {
        const res = await fetch('/api/transactions', {
          headers: { Authorization: `Bearer ${currentUser?.access_token}` }
        });
        if (res.ok) {
          setTransactions(await res.json());
        }
      } catch (e) {
        // Optionally handle error
      }
    }
    if (currentUser?.access_token) fetchTxs();
  }, [currentUser]);

  // Create transaction via backend
  const handleSendCoins = async () => {
    const amountNum = parseFloat(sendAmount);
    if (!recipient.trim() || !sendAmount || amountNum <= 0) {
      toast({ title: "Invalid Input 😟", description: "Please enter a valid recipient and amount.", variant: "destructive" });
      return;
    }
    if (amountNum > rgxCoins) {
      toast({ title: "Insufficient Funds 💸", description: "You don't have enough RGX to send this amount.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.access_token}`
        },
        body: JSON.stringify({ type: 'debit', amount: amountNum, description: `Sent to ${recipient}` })
      });
      if (res.ok) {
        const newTx = await res.json();
        setTransactions(prev => [newTx, ...prev]);
        updateRgxCoins(-amountNum);
        toast({ title: "Coins Sent! 💸", description: `${amountNum} RGX sent to ${recipient}.` });
        setNotifications(`You sent ${amountNum} RGX to ${recipient}.`, "wallet");
        setShowSendModal(false);
        setSendAmount('');
        setRecipient('');
      } else {
        toast({ title: "Error", description: "Could not send coins.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network Error", description: "Could not connect to backend.", variant: "destructive" });
    }
  };

  const handleFeatureClick = (title, description) => {
    toast({ title: `🚧 ${title} Coming Soon!`, description: description || "This wallet feature is under development. 🚀" });
    setNotifications(`Accessed "${title}" in RGX Wallet.`, "wallet");
  };

  const walletFeatures = [
    { 
      title: "Staking Rewards", 
      icon: TrendingUp, 
      description: "Stake your RGX Coins and earn passive income with competitive APYs.",
      action: () => handleFeatureClick("Staking Rewards", "Earn rewards by locking your RGX Coins.")
    },
    { 
      title: "Buy More Coins", 
      icon: Plus, 
      description: "Securely purchase additional RGX Coins using various payment methods.",
      action: () => handleFeatureClick("Buy More Coins", "Top up your RGX balance. This will require Stripe integration.")
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <motion.h1 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          RGX Wallet
        </motion.h1>
        <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          Manage your RGX Coins, view transactions, and explore staking.
        </motion.p>
      </div>

      <Card className="glass-effect rounded-xl p-6 md:p-8 text-center neon-glow shadow-xl">
        <div className="w-20 h-20 md:w-24 md:h-24 coin-gradient rounded-full flex items-center justify-center mx-auto mb-4 floating">
          <Coins className="w-10 h-10 md:w-12 md:h-12 text-black" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1">Current Balance</h2>
        <p className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{rgxCoins.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">RGX Coins</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex-1 neon-glow">
                <Share2 className="w-5 h-5 mr-2" /> Send Coins
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center"><Share2 className="w-5 h-5 mr-2"/>Send RGX Coins</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="recipient">Recipient Username or Address</Label>
                  <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="@username or 0x123..." />
                </div>
                <div>
                  <Label htmlFor="sendAmount">Amount (RGX)</Label>
                  <Input id="sendAmount" type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="E.g. 100" min="0.01" step="0.01" />
                </div>
                 <p className="text-xs text-muted-foreground">Available: {rgxCoins.toLocaleString()} RGX</p>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleSendCoins}>Confirm & Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button size="lg" variant="outline" className="flex-1" onClick={() => handleFeatureClick("Receive Coins", "View your RGX address to receive coins.")}>
            <ArrowRightLeft className="w-5 h-5 mr-2 transform rotate-90" /> Receive Coins
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {walletFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 50 }}
          >
            <Card className="glass-effect h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <feature.icon className="w-6 h-6 mr-3 text-primary" /> {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={feature.action}>
                  {feature.title === "Staking Rewards" ? "Explore Staking" : "Proceed"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <Card className="glass-effect rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center"><Receipt className="w-6 h-6 mr-3 text-primary"/>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {transactions.length > 0 ? transactions.map(tx => (
            <TransactionRow key={tx.id} tx={tx} />
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
          )}
        </CardContent>
        {transactions.length > 0 && (
          <CardFooter>
            <Button variant="link" className="mx-auto" onClick={() => handleFeatureClick("Full Transaction History")}>View All Transactions</Button>
          </CardFooter>
        )}
      </Card>

      <Card className="glass-effect rounded-xl p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl flex items-center">
            <Crown className="w-6 h-6 mr-3 text-yellow-400" />
            RGX Coin Staking Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground mb-4">
            Boost your RGX holdings by staking them. Choose a plan that suits you and watch your coins grow.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-background/50 rounded-md">
              <h4 className="text-lg font-bold text-green-400">5-12% APY</h4>
              <p className="text-xs text-muted-foreground">Potential Annual Rewards</p>
            </div>
            <div className="p-3 bg-background/50 rounded-md">
              <h4 className="text-lg font-bold text-blue-400">Flexible Periods</h4>
              <p className="text-xs text-muted-foreground">30, 60, 90+ Days Lock-in</p>
            </div>
            <div className="p-3 bg-background/50 rounded-md">
              <h4 className="text-lg font-bold text-purple-400">Min. 100 RGX</h4>
              <p className="text-xs text-muted-foreground">Low Minimum Stake</p>
            </div>
          </div>
           <Button variant="outline" className="w-full mt-6" onClick={() => handleFeatureClick("Staking Details")}>
            Explore Staking Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RGXWallet;