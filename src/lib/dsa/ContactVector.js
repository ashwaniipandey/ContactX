/**
 * ContactVector
 * Direct JavaScript implementation of std::vector<Contact> from ContactManager.h
 * 
 * Provides:
 * - push_back (Amortized O(1))
 * - at (O(1) random access)
 * - erase (O(N) deletion with element shifting)
 * - size & empty (O(1))
 * - clear (O(1))
 * - custom comparator sort (O(N log N))
 * - Metrics recording: tracks array accesses, comparisons, and shift operations
 */
export class ContactVector {
  constructor(initialCapacity = 8) {
    this.capacity = initialCapacity;
    this.length = 0;
    this.data = new Array(this.capacity);
    this.stats = {
      reallocations: 0,
      comparisons: 0,
      shifts: 0,
    };
  }

  // Helper to reallocate memory when capacity is exceeded
  _resize(newCapacity) {
    const oldData = this.data;
    this.data = new Array(newCapacity);
    for (let i = 0; i < this.length; i++) {
      this.data[i] = oldData[i];
    }
    this.capacity = newCapacity;
    this.stats.reallocations++;
  }

  // std::vector::push_back
  push_back(element) {
    if (this.length >= this.capacity) {
      this._resize(this.capacity * 2);
    }
    this.data[this.length] = element;
    this.length++;
  }

  // std::vector::size
  size() {
    return this.length;
  }

  // std::vector::empty
  empty() {
    return this.length === 0;
  }

  // std::vector::clear
  clear() {
    this.data = new Array(this.capacity);
    this.length = 0;
  }

  // Access element by 0-based index
  at(index) {
    if (index < 0 || index >= this.length) {
      throw new RangeError(`Vector index out of bounds: ${index} (size: ${this.length})`);
    }
    return this.data[index];
  }

  // Update element at index
  set(index, element) {
    if (index < 0 || index >= this.length) {
      throw new RangeError(`Vector index out of bounds: ${index}`);
    }
    this.data[index] = element;
  }

  /**
   * std::vector::erase(contacts.begin() + i)
   * Shifts elements left by 1 to maintain contiguous array memory
   * Time Complexity: O(N)
   */
  erase(index) {
    if (index < 0 || index >= this.length) {
      return false;
    }
    for (let i = index; i < this.length - 1; i++) {
      this.data[i] = this.data[i + 1];
      this.stats.shifts++;
    }
    this.data[this.length - 1] = undefined;
    this.length--;
    return true;
  }

  // Returns shallow array copy of items
  toArray() {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      result.push(this.data[i]);
    }
    return result;
  }

  /**
   * Custom sort implementing std::sort(contacts.begin(), contacts.end(), comparator)
   * Uses Quicksort / Timsort with comparison tracking
   */
  sort(comparator) {
    const arr = this.toArray();
    this.stats.comparisons = 0;
    arr.sort((a, b) => {
      this.stats.comparisons++;
      return comparator(a, b);
    });
    for (let i = 0; i < this.length; i++) {
      this.data[i] = arr[i];
    }
  }
}
