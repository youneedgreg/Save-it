// Only define tour steps on client-side
const isClient = typeof window !== 'undefined'

export const dashboardTourSteps = isClient ? [
  {
    target: "body",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Welcome to Save It! 🎉</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">
          Let's take a quick tour to show you all the amazing features that will help you master your finances.
        </p>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          This tour will show you how to track your money, set budgets, manage debts, and achieve your financial goals.
        </p>
      </div>
    `,
    placement: "center",
  },
  {
    target: "[data-tour='navigation']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Navigation Hub</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          This is your main navigation. You can access all features from here:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;"><strong>Dashboard:</strong> Your financial overview</li>
          <li style="margin-bottom: 4px;"><strong>Accounts:</strong> Manage bank accounts & balances</li>
          <li style="margin-bottom: 4px;"><strong>Budgets:</strong> Set spending limits</li>
          <li style="margin-bottom: 4px;"><strong>Debts:</strong> Track what you owe</li>
          <li style="margin-bottom: 4px;"><strong>Analytics:</strong> Insights & reports</li>
        </ul>
      </div>
    `,
    placement: "bottom",
  },
  {
    target: "[data-tour='dashboard-overview']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Dashboard Overview</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Your dashboard shows your key financial metrics at a glance:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;"><strong>Net Worth:</strong> Your total financial position</li>
          <li style="margin-bottom: 4px;"><strong>Monthly Income:</strong> Money coming in</li>
          <li style="margin-bottom: 4px;"><strong>Monthly Expenses:</strong> Money going out</li>
        </ul>
      </div>
    `,
    placement: "bottom",
  },
  {
    target: "[data-tour='debt-overview']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Debt Tracking</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Keep track of all your debts with progress indicators:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">See how much you've paid off</li>
          <li style="margin-bottom: 4px;">Track interest rates and minimum payments</li>
          <li style="margin-bottom: 4px;">Calculate payoff timelines</li>
        </ul>
      </div>
    `,
    placement: "top",
  },
  {
    target: "[data-tour='savings-goals']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Savings Goals</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Set and track your financial goals:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Set short-term and long-term goals</li>
          <li style="margin-bottom: 4px;">Track progress towards your financial objectives</li>
          <li style="margin-bottom: 4px;">Prioritize your savings</li>
        </ul>
      </div>
    `,
    placement: "top",
  },
  {
    target: "[data-tour='budget-tracking']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Budget Tracking</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Monitor your spending against your budgets:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Set monthly spending limits</li>
          <li style="margin-bottom: 4px;">Track progress in real-time</li>
          <li style="margin-bottom: 4px;">Get alerts when over budget</li>
        </ul>
      </div>
    `,
    placement: "top",
  },
  {
    target: "[data-tour='recent-transactions']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Transaction History</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          View your recent financial activity:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Income and expenses</li>
          <li style="margin-bottom: 4px;">Categorized transactions</li>
          <li style="margin-bottom: 4px;">Date and amount tracking</li>
        </ul>
      </div>
    `,
    placement: "top",
  },
  {
    target: "[data-tour='theme-toggle']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Personalization</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Customize your experience:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Switch between light and dark themes</li>
          <li style="margin-bottom: 4px;">Change currency settings</li>
          <li style="margin-bottom: 4px;">Personalize your dashboard</li>
        </ul>
      </div>
    `,
    placement: "bottom",
  },
  {
    target: "body",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">You're All Set! 🚀</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          You've completed the tour! Here's what you can do next:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Add your first account in the Accounts section</li>
          <li style="margin-bottom: 4px;">Set up a budget to track your spending</li>
          <li style="margin-bottom: 4px;">Create a savings goal for something you want</li>
          <li style="margin-bottom: 4px;">Explore Analytics for insights</li>
        </ul>
        <p style="font-size: 14px; font-weight: 500; color: hsl(var(--primary)); margin-top: 12px;">
          Ready to take control of your finances? Let's get started!
        </p>
      </div>
    `,
    placement: "center",
  },
] : []

export const accountsTourSteps = isClient ? [
  {
    target: "body",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Accounts Management 💳</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">
          Here you can manage all your financial accounts and track your balances.
        </p>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          Add bank accounts, cash, mobile money, and investment accounts to get a complete picture of your finances.
        </p>
      </div>
    `,
    placement: "center",
  },
  {
    target: "[data-tour='total-balance']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Total Balance</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          This shows your combined balance across all accounts. It's your total liquid assets.
        </p>
      </div>
    `,
    placement: "bottom",
  },
  {
    target: "[data-tour='add-account-button']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Add Account</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Click here to add a new account. You can add:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;">Bank accounts</li>
          <li style="margin-bottom: 4px;">Cash</li>
          <li style="margin-bottom: 4px;">Mobile money</li>
          <li style="margin-bottom: 4px;">Investment accounts</li>
        </ul>
      </div>
    `,
    placement: "bottom",
  },
] : []

export const budgetsTourSteps = isClient ? [
  {
    target: "body",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Budget Management 💰</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">
          Set spending limits and track your progress to stay on top of your finances.
        </p>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          Create budgets for different spending categories.
        </p>
      </div>
    `,
    placement: "center",
  },
  {
    target: "[data-tour='budget-summary']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Budget Summary</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          See your total budget, spending, and remaining amounts at a glance.
        </p>
      </div>
    `,
    placement: "bottom",
  },
  {
    target: "[data-tour='add-budget-button']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Create Budget</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          Click here to create a new budget. Set limits for different spending categories.
        </p>
      </div>
    `,
    placement: "bottom",
  },
] : []

export const analyticsTourSteps = isClient ? [
  {
    target: "body",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Analytics & Insights 📊</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 8px;">
          Get deep insights into your financial health with data-driven analytics.
        </p>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          Track your savings rate, debt-to-income ratio, and get personalized recommendations.
        </p>
      </div>
    `,
    placement: "center",
  },
  {
    target: "[data-tour='financial-metrics']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Key Metrics</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground)); margin-bottom: 12px;">
          Monitor important financial ratios:
        </p>
        <ul style="font-size: 14px; color: hsl(var(--muted-foreground)); margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 4px;"><strong>Savings Rate:</strong> How much you save vs. earn</li>
          <li style="margin-bottom: 4px;"><strong>Debt-to-Income:</strong> Your debt burden</li>
          <li style="margin-bottom: 4px;"><strong>Daily Spending:</strong> Average daily expenses</li>
        </ul>
      </div>
    `,
    placement: "bottom",
  },
  {
    target: "[data-tour='financial-insights']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Smart Insights</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          Get personalized recommendations based on your financial data.
        </p>
      </div>
    `,
    placement: "top",
  },
  {
    target: "[data-tour='charts']",
    content: `
      <div style="text-align: left; padding: 20px;">
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: hsl(var(--foreground));">Visual Analytics</h3>
        <p style="font-size: 14px; color: hsl(var(--muted-foreground));">
          See your spending patterns and income trends through interactive charts.
        </p>
      </div>
    `,
    placement: "top",
  },
] : []