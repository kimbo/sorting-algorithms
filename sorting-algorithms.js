'use strict';

function swap(arr, i, j) {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr, i, minIdx);
    }

    return arr;
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
            swap(arr, j, j - 1);
        }
    }

    return arr;
}

function mergeSort(arr) {

    function merge(arr, workArr, leftIdx, middleIdx, rightIdx) {
        let i = leftIdx;
        let j = middleIdx;

        for (let k = leftIdx; k < rightIdx; k++) {
            if (i < middleIdx && (arr[i] <= arr[j] || j >= rightIdx)) {
                workArr[k] = arr[i];
                i++;
            } else {
                workArr[k] = arr[j];
                j++;
            }
        }
    }

    let workArr = [...arr];

    for (let sublistSize = 1; sublistSize < arr.length; sublistSize *= 2) {
        for (let leftIdx = 0; leftIdx < arr.length; leftIdx = leftIdx + 2 * sublistSize) {
            let middleIdx = Math.min(leftIdx + sublistSize, arr.length);
            let rightIdx = Math.min(leftIdx + 2 * sublistSize, arr.length);
            merge(arr, workArr, leftIdx, middleIdx, rightIdx);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = workArr[i];
            }
        }
    }

    return arr;
}

function heapSort(arr) {

    function maxHeapify(arr, i, end) {
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        let largest = i;

        if (left <= end && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right <= end && arr[right] > arr[largest]) {
            largest = right;
        }
        if (largest != i) {
            swap(arr, i, largest);
            maxHeapify(arr, largest, end);
        }
    }

    function buildMaxHeap(arr) {
        for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
            maxHeapify(arr, i, arr.length - 1);
        }
    }

    buildMaxHeap(arr);

    for (let end = arr.length - 1; end > 0; end--) {
        swap(arr, end, 0);
        maxHeapify(arr, 0, end - 1);
    }

    return arr;
}

function quickSort(arr, lo=null, hi=null) {

    function partition(arr, lo, hi) {
        let pivot = arr[Math.floor((hi + lo) / 2)];
        let i = lo - 1;
        let j = hi + 1;

        while (true) {
            for (i++; arr[i] < pivot; i++) {}
            for (j--; arr[j] > pivot; j--) {}
            if (i >= j) {
                return j;
            }
            swap(arr, i, j);
        }
    }

    if (lo == null && hi == null) {
        lo = 0;
        hi = arr.length - 1;
    }

    if (lo >= 0 && hi >= 0 && lo < hi) {
        let p = partition(arr, lo, hi)
        quickSort(arr, lo, p);
        quickSort(arr, p + 1, hi);
    }

    return arr;
}

function bubbleSort(arr) {
    while (true) {
        let didSwap = false
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                swap(arr, i, i - 1);
                didSwap = true
            }
        }
        if (!didSwap) {
            break
        }
    }

    return arr
}

function shellSort(arr) {
    let gaps = [701, 301, 132, 57, 23, 10, 4, 1]  // Ciura gap sequence
    for (let i = 0; i < gaps.length; i++) {
        let gap = gaps[i];
        for (let j = gap; j < arr.length; j++) {
            let tmp = arr[j];
            let k;
            for (k = j; k >= gap && arr[k - gap] > tmp; k -= gap) {
                arr[k] = arr[k - gap];
            }
            arr[k] = tmp;
        }
    }
    return arr;
}

function combSort(arr) {
    const SHRINK_FACTOR = 1.3;
    let gap = arr.length;
    let sorted = false;

    while (!sorted) {
        gap = Math.floor(gap / SHRINK_FACTOR);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }
        for (let i = 0; i + gap < arr.length; i++) {
            if (arr[i] > arr[i + gap]) {
                swap(arr, i, i + gap);
                sorted = false;
            }
        }
    }

    return arr;
}

function radixSort(arr) {
    const BITS_IN_BYTE = 8;
    const RADIX = 256;
    const MASK = 0xFF;

    function getNumBits(val) {
        let i;
        for (i = 1; 2**(i-1) < val; i++) {}
        return Math.max(Math.floor(i-1), 1);
    }

    function getByte(val, idx) {
        return (val >> BITS_IN_BYTE * idx) & MASK;
    }

    let buckets = Array(RADIX).fill();
    let maxNumBits = 0;
    for (let i = 0; i < arr.length; i++) {
        let nbits = getNumBits(arr[i]);
        if (nbits > maxNumBits) {
            maxNumBits = nbits;
        }
    }
    let maxNumBytes = Math.max(maxNumBits / BITS_IN_BYTE, 4);
    for (let bytePos = 0; bytePos < maxNumBytes; bytePos++) {
        buckets = buckets.map(() => []);
        for (let i = 0; i < arr.length; i++) {
            let byte = getByte(arr[i], bytePos);
            buckets[byte].push(arr[i]);
        }
        if (bytePos == maxNumBytes - 1) {
            let k = 0;
            for (let i = buckets.length / 2; i < buckets.length; i++) {
                for (let j = 0; j < buckets[i].length; j++) {
                    arr[k++] = buckets[i][j];
                }
            }
            for (let i = 0; i < buckets.length / 2; i++) {
                for (let j = 0; j < buckets[i].length; j++) {
                    arr[k++] = buckets[i][j];
                }
            }
        } else {
            for (let i = 0, k = 0; i < buckets.length; i++) {
                for (let j = 0; j < buckets[i].length; j++) {
                    arr[k++] = buckets[i][j];
                }
            }
        }
    }

    return arr;
}

// This isn't the most efficient way to do radix sort
// since the radix is 10, but it was a fun exercise.
function radixSortDecimalDigits(arr) {

    function numDigits(n, base=10) {
        let i;
        for (i = 1; base**(i-1) < n; i++) {}
        return Math.max(Math.floor(i-1), 0) + 1;
    }

    function getDigit(num, i) {
        return Math.floor(Math.abs(num) / (10**(i-1))) % 10;
    }

    let maxNumDigits = 0;
    for (let i = 0; i < arr.length; i++) {
        let nDigits = numDigits(arr[i]);
        if (nDigits > maxNumDigits) {
            maxNumDigits = nDigits;
        }
    }

    let buckets = Array(20).fill();
    for (let digitPos = 1; digitPos <= maxNumDigits; digitPos++) {
        buckets = buckets.map(() => []);
        for (let i = 0; i < arr.length; i++) {
            let digit = getDigit(arr[i], digitPos);
            if (isNaN(digit)) {
                continue;
            }
            if (arr[i] >= 0) {
                digit = digit + 10;
            }
            buckets[digit].push(arr[i]);
        }
        let k = 0;
        for (let i = 9; i >= 0; i--) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[k++] = buckets[i][j];
            }
        }
        for (let i = 10; i < buckets.length; i++) {
            for (let j = 0; j < buckets[i].length; j++) {
                arr[k++] = buckets[i][j];
            }
        }
    }

    return arr;
}

export {
    insertionSort,
    selectionSort,
    mergeSort,
    heapSort,
    quickSort,
    bubbleSort,
    shellSort,
    combSort,
    radixSort,
    radixSortDecimalDigits,
}