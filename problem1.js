const readline = require('node:readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  function parseTime(timeStr) {
    // Parse time in HHMM format to minutes since start of the day
    const hours = Number.parseInt(timeStr.slice(0, 2), 10);
    const minutes = Number.parseInt(timeStr.slice(2), 10);
    return hours * 60 + minutes;
  }
  
  function findLastNonConflict(jobs, index) {
    // Find the last job that doesn't conflict with the job at 'index'
    for (let i = index - 1; i >= 0; i--) {
      if (jobs[i].end <= jobs[index].start) return i;
    }
    return -1;
  }
  
  function maxProfitJobs(jobs) {
    // Sort jobs by their end time to facilitate the DP approach
    jobs.sort((a, b) => a.end - b.end);
    
    const n = jobs.length;
    const dp = new Array(n).fill(0);  // DP array to store maximum profit up to each job
    const jobSelection = new Array(n).fill(0);  // Array to track selected jobs
  
    dp[0] = jobs[0].profit;
  
    for (let i = 1; i < n; i++) {
      let includeProfit = jobs[i].profit;
      const lastNonConflictIndex = findLastNonConflict(jobs, i);
  
      if (lastNonConflictIndex !== -1) {
        includeProfit += dp[lastNonConflictIndex];
      }
  
      dp[i] = Math.max(includeProfit, dp[i - 1]);
      //jobSelection[i] = (includeProfit > dp[i - 1]) ? 1 : 0;
    }
  
    dp[n - 1];
    const selectedJobs = [];
    let i = n - 1;
  
    // Backtrack to find the jobs that contributed to max profit
    while (i >= 0) {
      const lastNonConflictIndex = findLastNonConflict(jobs, i);
      if (dp[i] === (jobs[i].profit + (lastNonConflictIndex !== -1 ? dp[lastNonConflictIndex] : 0))) {
        selectedJobs.push(jobs[i]);
        i = lastNonConflictIndex;
      } else {
        i--;
      }
    }
  
    // Calculate remaining jobs and earnings
    const remainingJobs = jobs.filter(job => !selectedJobs.includes(job));
    const remainingEarnings = remainingJobs.reduce((sum, job) => sum + job.profit, 0);
  
    return {
      remainingTasks: remainingJobs.length,
      remainingEarnings
    };
  }
  
  function main() {
    readline.question('Enter the number of Jobs\n', (n) => {
      const jobs = [];
      let count = 0;
  
      const getInput = () => {
        if (count < n) {
          readline.question('Enter job start time, end time, and earnings\n', (start) => {
            readline.question('', (end) => {
              readline.question('', (profit) => {
                jobs.push({
                  start: parseTime(start),
                  end: parseTime(end),
                  profit: Number.parseInt(profit, 10)
                });
                count++;
                getInput();
              });
            });
          });
        } else {
          const { remainingTasks, remainingEarnings } = maxProfitJobs(jobs);
          console.log(`The number of tasks and earnings available for others\nTask: ${remainingTasks}\nEarnings: ${remainingEarnings}`);
          readline.close();
        }
      };
  
      getInput();
    });
  }
  
  main();
  