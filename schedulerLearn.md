schedule作为react核心调度

其主要的作用就是将任务用双向链表连接

```
 var newTask = {
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    next: null,
    previous: null
  };

```


```
function unstable_scheduleCallback(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now();

  var startTime;
  var timeout;
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
    timeout = typeof options.timeout === 'number' ? options.timeout : timeoutForPriorityLevel(priorityLevel);
  } else {
    timeout = timeoutForPriorityLevel(priorityLevel);
    startTime = currentTime;
  }

  var expirationTime = startTime + timeout;

  var newTask = {
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: startTime,
    expirationTime: expirationTime,
    next: null,
    previous: null
  };
  // 这个if代表这个是一个需要delayed的任务，所以插入delay队列
  if (startTime > currentTime) {
    // This is a delayed task.
    insertDelayedTask(newTask, startTime);
    if (firstTask === null && firstDelayedTask === newTask) {
      // All tasks are delayed, and this is the task with the earliest delay.
      if (isHostTimeoutScheduled) {
        // Cancel an existing timeout.
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // Schedule a timeout.
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    // 需要执行的任务，直接插入scheduled队列
    insertScheduledTask(newTask, expirationTime);
    // Schedule a host callback, if needed. If we're already performing work,
    // wait until the next time we yield.
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

```
