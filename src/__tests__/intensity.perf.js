/**
 * Intensity Performance Benchmark
 * Simulates high-concurrency intent resolution to measure 
 * system resilience and latency under disaster-scale load.
 */

async function runIntensityTest(concurrentUsers = 50) {
  console.log(`\n🚀 Starting LifeBridge Intensity Test: ${concurrentUsers} concurrent requests...\n`);

  const mockResolve = async (id) => {
    const start = performance.now();
    // Simulate network + AI latency (0.5s to 1.5s)
    const latency = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, latency));
    const end = performance.now();
    return { id, duration: end - start };
  };

  const startTime = performance.now();
  const tasks = Array.from({ length: concurrentUsers }, (_, i) => mockResolve(i));
  
  try {
    const results = await Promise.all(tasks);
    const totalTime = performance.now() - startTime;
    
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / concurrentUsers;
    const maxDuration = Math.max(...results.map(r => r.duration));

    console.log(`✅ Intensity Test Complete!`);
    console.log(`-----------------------------------`);
    console.log(`Concurrent Users:    ${concurrentUsers}`);
    console.log(`Total Wall-Clock Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Avg Resolution Time:  ${avgDuration.toFixed(2)}ms`);
    console.log(`Max Latency:          ${maxDuration.toFixed(2)}ms`);
    console.log(`-----------------------------------\n`);

  } catch (error) {
    console.error("❌ Intensity Test Failed:", error);
  }
}

// Run the benchmark
runIntensityTest(50);
