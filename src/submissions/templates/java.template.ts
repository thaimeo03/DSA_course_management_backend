export const solutionClassName = 'solution'

export const javaTemplate = `
// Template for Java (java.template.java)

// Importing libraries
import java.util.*;
import java.math.*;

public class Main {    
    public static void main(String[] args) {
        runTests();
    }
    
    public static void runTests() {
        Solution ${solutionClassName} = new Solution();
        try {
            {{{test_cases}}}
            System.out.println("All tests passed.");
        } catch (AssertionError error) {
            System.err.println("Test case failed: " + error.getMessage());
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
        }
    }
}

{{{user_code}}}
`

export const javaTestCaseTemplate = `
            if (!{{{comparison}}}) {
                throw new AssertionError("Expected " + {{{expected_output_string}}} + ", but got " + {{{parsed_calling_function}}});
            }
`
