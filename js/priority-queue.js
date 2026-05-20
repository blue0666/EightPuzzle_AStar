/** 简单最小堆优先队列（按 f，其次 h，其次 g 大者优先） */

export class PriorityQueue {
  constructor() {
    /** @type {{ key: string, f: number, h: number, g: number, payload: * }[]} */
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * @param {string} key
   * @param {number} f
   * @param {number} h
   * @param {number} g
   * @param {*} payload
   */
  push(key, f, h, g, payload) {
    this.heap.push({ key, f, h, g, payload });
    this._bubbleUp(this.heap.length - 1);
  }

  /** @returns {{ key: string, f: number, h: number, g: number, payload: * }|undefined} */
  pop() {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  _less(a, b) {
    if (a.f !== b.f) return a.f < b.f;
    if (a.h !== b.h) return a.h < b.h;
    return a.g > b.g;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this._less(this.heap[i], this.heap[p])) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let smallest = i;
      if (l < n && this._less(this.heap[l], this.heap[smallest])) smallest = l;
      if (r < n && this._less(this.heap[r], this.heap[smallest])) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}
