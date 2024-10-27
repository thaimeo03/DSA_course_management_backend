export const javaTemplate = `
// Template for Java (java.template.java)

// Importing libraries
import java.util.*;
import java.math.*;

{{{user_code}}}

public class Main {    
    public static void main(String[] args) {
        runTests();
    }
    
    public static void runTests() {
        Solution solution = new Solution();
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
`

export const javaTestCaseTemplate = `
            if (!solution.{{function_name}}({{{parsed_inputs}}}).equals({{{expected_outputs}}})) {
                throw new AssertionError("Expected " + {{{expected_outputs}}} + ", but got " + solution.{{function_name}}({{{parsed_inputs}}}));
            }
`
