import { QuizQuestion } from "@/components/quiz/QuizEngine";

export const quizData: Record<string, QuizQuestion[]> = {
  "ground-zero/module-1": [
    {
      id: "gz-1-1",
      question: "What percentage of retail traders lose money according to FCA data?",
      options: ["50%", "62%", "74%", "89%"],
      correctIndex: 2,
      explanation: "The FCA reports that approximately 74% of retail CFD traders lose money. This figure has remained consistent for years and is a key reason why education matters.",
    },
    {
      id: "gz-1-2",
      question: "What is the primary business model of most 'trading gurus'?",
      options: ["Commission from brokers", "Selling education products", "Copy trading fees", "Signal subscriptions"],
      correctIndex: 1,
      explanation: "The majority of trading educators make their income from selling courses and mentorships — not from trading. Their incentive is marketing, not your success.",
    },
    {
      id: "gz-1-3",
      question: "What does 'drawdown' mean in trading?",
      options: [
        "The total profit from a winning streak",
        "A decline from peak equity to trough",
        "The spread between bid and ask",
        "The margin requirement for a position",
      ],
      correctIndex: 1,
      explanation: "A drawdown is the decline from a peak in equity to a subsequent trough. Managing drawdowns is a critical part of long-term survival as a trader.",
    },
    {
      id: "gz-1-4",
      question: "Why is focusing on P&L dangerous for new traders?",
      options: [
        "It encourages over-leveraging",
        "It creates emotional attachment to outcomes rather than process",
        "It slows down execution speed",
        "It makes tax reporting harder",
      ],
      correctIndex: 1,
      explanation: "Focusing on P&L creates emotional decision-making. Professional traders focus on process adherence and statistical edge — the P&L follows when the process is correct.",
    },
    {
      id: "gz-1-5",
      question: "What is the minimum recommended sample size to evaluate a strategy?",
      options: ["5 trades", "10 trades", "20 trades", "100 trades"],
      correctIndex: 2,
      explanation: "A minimum of 20 trades is needed before making any statistically meaningful conclusions about a strategy. Fewer trades and you're just seeing noise.",
    },
  ],
  "ground-zero/module-3": [
    {
      id: "gz-3-1",
      question: "If you have a 40% win rate and a 1:3 RR, what is your expected value per £100 risked?",
      options: ["−£20", "£0 (Break Even)", "+£20", "+£40"],
      correctIndex: 2,
      explanation: "EV = (Win% × Avg Win) − (Loss% × Avg Loss) = (0.40 × £300) − (0.60 × £100) = £120 − £60 = +£60 per trade. Per £100 risked, that's +£20 EV.",
    },
    {
      id: "gz-3-2",
      question: "What is 'Risk of Ruin'?",
      options: [
        "The probability of losing your entire account",
        "The maximum number of consecutive losses",
        "The cost of trading commissions over time",
        "The risk of a broker going bankrupt",
      ],
      correctIndex: 0,
      explanation: "Risk of Ruin is the mathematical probability of losing your entire trading capital. It's determined by your win rate, risk-reward ratio, and position sizing.",
    },
    {
      id: "gz-3-3",
      question: "How many consecutive £100 losses can a £10,000 account sustain at 1% risk?",
      options: ["10", "50", "100", "Theoretically infinite"],
      correctIndex: 3,
      explanation: "At 1% risk, each loss is 1% of the current balance. As the balance decreases, so does the loss size — making it theoretically impossible to reach zero (though practically, you'd stop trading well before).",
    },
    {
      id: "gz-3-4",
      question: "Which factor has the MOST impact on long-term trading survival?",
      options: ["Win rate", "Risk-reward ratio", "Position sizing", "Entry timing"],
      correctIndex: 2,
      explanation: "Position sizing is the single most important factor in survival. A great strategy with poor sizing will blow up; a mediocre strategy with disciplined sizing can survive indefinitely.",
    },
    {
      id: "gz-3-5",
      question: "What does a Profit Factor of 2.0 mean?",
      options: [
        "You win twice as often as you lose",
        "Your gross profits are 2x your gross losses",
        "Your account doubled",
        "You have a 200% return",
      ],
      correctIndex: 1,
      explanation: "Profit Factor = Gross Profits ÷ Gross Losses. A PF of 2.0 means for every £1 lost, you make £2. Anything above 1.5 is generally considered good.",
    },
  ],
};
