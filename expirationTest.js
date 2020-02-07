var maxSigned31BitInt = 1073741823;

var NoWork = 0;
var Never = 1;
var Sync = maxSigned31BitInt;

var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = maxSigned31BitInt - 1;

function unstable_now() {
  return performance.now();
};

function ceiling(num, precision) {
  return ((num / precision | 0) + 1) * precision;
}

function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
  return MAGIC_NUMBER_OFFSET - ceiling(MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
}


var originalStartTimeMs = unstable_now();

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0);
}

function recomputeCurrentRendererTime() {
  var currentTimeMs = unstable_now() - originalStartTimeMs;
  return msToExpirationTime(currentTimeMs);
}

var LOW_PRIORITY_EXPIRATION = 5000;
var LOW_PRIORITY_BATCH_SIZE = 250;

function computeAsyncExpiration(currentTime) {
  return computeExpirationBucket(currentTime, LOW_PRIORITY_EXPIRATION, LOW_PRIORITY_BATCH_SIZE);
}

var HIGH_PRIORITY_EXPIRATION = 500;
var HIGH_PRIORITY_BATCH_SIZE = 100;

function computeInteractiveExpiration(currentTime) {
  return computeExpirationBucket(currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE);
}


setTimeout(() => {
  const currentTime = recomputeCurrentRendererTime();
  const currentAsyncTime = computeAsyncExpiration(currentTime);
  const currentInteractiveTime = computeInteractiveExpiration(currentTime);
  console.log(currentTime, currentAsyncTime, currentInteractiveTime)
}, 1000)

setTimeout(() => {
  const currentTime = recomputeCurrentRendererTime();
  const currentAsyncTime = computeAsyncExpiration(currentTime);
  const currentInteractiveTime = computeInteractiveExpiration(currentTime);
  console.log(currentTime, currentAsyncTime, currentInteractiveTime)
}, 2000)