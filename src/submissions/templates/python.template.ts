export const pythonTemplate = `
# Template for Python (python.template.py)

# Importing libraries
import math       # For mathematical operations
import random     # For random number generation
import itertools  # For combinatorics, permutations, etc.
import functools  # For functional programming utilities like reduce
import operator   # For standard operations (addition, subtraction, etc.)
import collections  # Useful data structures like Counter, deque, namedtuple
import heapq        # For heaps (priority queue implementation)
import bisect       # For binary search operations
import re  # Regular expressions


{{{user_code}}}

def runTests():
    try:
        {{{test_cases}}}
        print("All tests passed.")
    except Exception as error:
        print("Test case failed:", error)

runTests()
`

export const pythonTestCaseTemplate = `
        if {{{function_name}}}({{{parsed_inputs}}}) != {{{expected_outputs}}}:
            raise Exception('Expected {{{expected_outputs}}}, but got ' + str({{{function_name}}}({{{parsed_inputs}}})))
`
